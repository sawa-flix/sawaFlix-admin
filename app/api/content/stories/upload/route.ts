import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const MAX_MEDIA_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024   // 5MB

const FormSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
    community_group: z.string().min(1, 'Community group is required').trim(),
    content_type: z.enum(['video', 'audio', 'text']),
    languages: z.preprocess(val => String(val || '').split(',').map(l => l.trim()).filter(Boolean), z.array(z.string()).min(1, 'At least one language is required')),
    content_text: z.preprocess(val => (val === null || val === undefined) ? '' : String(val), z.string().default('')),
    duration: z.preprocess(val => val ? Number(val) : null, z.number().nullable().optional())
})

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const formData = await req.formData()
        const media = formData.get('media') as File | null
        const cover = formData.get('cover') as File | null

        // 1. Validate Form Metadata
        const parsed = FormSchema.safeParse({
            title: formData.get('title'),
            community_group: formData.get('community_group'),
            content_type: formData.get('content_type'),
            languages: formData.get('languages'),
            content_text: formData.get('content_text'),
            duration: formData.get('duration')
        })

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
        }
        const data = parsed.data

        // 2. Validate Media Requirements
        if (data.content_type !== 'text') {
            if (!media || !(media instanceof File)) {
                return NextResponse.json({ error: `Media file is required for ${data.content_type} stories` }, { status: 400 })
            }
            if (media.size > MAX_MEDIA_SIZE) return NextResponse.json({ error: 'Media exceeds 100MB' }, { status: 400 })
        }

        if (cover && cover.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: 'Cover exceeds 5MB' }, { status: 400 })

        // 3. Upload Helper Function
        const uploadFile = async (file: File, folder: string) => {
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
            const path = `${user.id}/${folder}/${Date.now()}-${cleanName}`

            const { error } = await supabase.storage.from('stories').upload(
                path,
                await file.arrayBuffer(),
                { contentType: file.type, duplex: 'half' }
            )

            if (error) throw new Error(`Failed to upload ${folder}: ${error.message}`)
            const { data: { publicUrl } } = supabase.storage.from('stories').getPublicUrl(path)

            return { url: publicUrl, path }
        }

        // 4. Execute Uploads
        let mediaData = null
        if (media && media instanceof File) {
            mediaData = await uploadFile(media, data.content_type === 'video' ? 'videos' : 'audio')
        }

        let coverData = null
        if (cover && cover instanceof File) {
            coverData = await uploadFile(cover, 'covers').catch(() => null)
        }

        // 5. Database Insert
        const { data: newStory, error: dbError } = await supabase.from('stories').insert({
            user_id: user.id,
            title: data.title,
            community_group: data.community_group,
            content_type: data.content_type,
            languages: data.languages,
            content_text: data.content_text,
            media_url: mediaData?.url || null,
            media_path: mediaData?.path || null,
            cover_photo_url: coverData?.url || null,
            cover_photo_path: coverData?.path || null,
            duration: data.duration,
            submission_date: new Date().toISOString()
        }).select().single()

        // 6. Cleanup on DB Failure
        if (dbError) {
            console.error('CRITICAL: Supabase Insert Error:', JSON.stringify(dbError, null, 2))
            const pathsToDelete = [mediaData?.path, coverData?.path].filter(Boolean) as string[]
            try {
                if (pathsToDelete.length > 0) {
                    await supabase.storage.from('stories').remove(pathsToDelete)
                }
            } catch (cleanupErr) {
                console.error('Cleanup failed:', cleanupErr)
            }
            return NextResponse.json({
                error: 'Database insert failed',
                details: dbError.message,
                code: dbError.code
            }, { status: 400 })
        }

        return NextResponse.json({ success: true, data: newStory })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred'
        console.error('Unexpected Terminal Upload error:', error)
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
