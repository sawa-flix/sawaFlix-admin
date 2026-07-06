import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const MAX_VIDEO_SIZE = 150 * 1024 * 1024 // 150MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024   // 5MB

const FormSchema = z.object({
    name: z.string().min(1, 'Name is required').trim(),
    dish_name: z.string().min(1, 'Dish name is required').trim(),
    description: z.string().optional().default(''),
    duration: z.preprocess(val => val ? Number(val) : null, z.number().nullable().optional())
})

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const formData = await req.formData()
        const video = formData.get('video') as File | null
        const cover = formData.get('cover') as File | null

        // 1. Validate Files
        if (!video || !(video instanceof File)) {
            return NextResponse.json({ error: 'Video file is required' }, { status: 400 })
        }
        if (video.size > MAX_VIDEO_SIZE) return NextResponse.json({ error: 'Video exceeds 150MB' }, { status: 400 })
        if (cover && cover.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: 'Cover exceeds 5MB' }, { status: 400 })

        // 2. Validate Text Metadata
        const parsed = FormSchema.safeParse({
            name: formData.get('name'),
            dish_name: formData.get('dish_name'),
            description: formData.get('description'),
            duration: formData.get('duration')
        })

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
        }
        const data = parsed.data

        // 3. Upload Helper Function
        const uploadFile = async (file: File, folder: string) => {
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
            const path = `${user.id}/${folder}/${Date.now()}-${cleanName}`

            const { error } = await supabase.storage.from('food').upload(
                path,
                await file.arrayBuffer(),
                { contentType: file.type, duplex: 'half' }
            )

            if (error) throw new Error(`Failed to upload ${folder}: ${error.message}`)
            const { data: { publicUrl } } = supabase.storage.from('food').getPublicUrl(path)

            return { url: publicUrl, path }
        }

        // 4. Execute Uploads
        const videoData = await uploadFile(video, 'videos')
        let coverData = null

        if (cover && cover instanceof File) {
            coverData = await uploadFile(cover, 'covers').catch(() => null)
        }

        // 5. Database Insert
        const { data: newFood, error: dbError } = await supabase.from('food').insert({
            user_id: user.id,
            name: data.name,
            dish_name: data.dish_name,
            description: data.description,
            duration: data.duration,
            video_url: videoData.url,
            video_path: videoData.path,
            cover_photo_url: coverData?.url || null,
            cover_photo_path: coverData?.path || null,
            submission_date: new Date().toISOString()
        }).select().single()

        // 6. Cleanup on DB Failure
        if (dbError) {
            console.error('CRITICAL: Supabase Insert Error:', JSON.stringify(dbError, null, 2))
            const pathsToDelete = [videoData.path, coverData?.path].filter(Boolean) as string[]
            try {
                await supabase.storage.from('food').remove(pathsToDelete)
            } catch (cleanupErr) {
                console.error('Cleanup failed:', cleanupErr)
            }
            return NextResponse.json({
                error: 'Database insert failed',
                details: dbError.message,
                code: dbError.code
            }, { status: 400 })
        }

        return NextResponse.json({ success: true, data: newFood })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred'
        console.error('Unexpected Terminal Upload error:', error)
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
