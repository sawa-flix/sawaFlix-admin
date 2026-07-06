import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const MAX_AUDIO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024   // 5MB

const FormSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().optional().default(''),
    is_featured: z.preprocess(val => val === 'true', z.boolean().default(false)),
    genre: z.preprocess(val => String(val || '').split(',').map(g => g.trim()).filter(Boolean), z.array(z.string())),
    tags: z.preprocess(val => String(val || '').split(',').map(t => t.trim()).filter(Boolean), z.array(z.string()))
})

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const formData = await req.formData()
        const audio = formData.get('audio') as File | null
        const cover = formData.get('cover') as File | null

        // 1. Validate Files
        if (!audio || !(audio instanceof File)) {
            return NextResponse.json({ error: 'Audio file is required' }, { status: 400 })
        }
        if (audio.size > MAX_AUDIO_SIZE) return NextResponse.json({ error: 'Audio exceeds 100MB' }, { status: 400 })
        if (cover && cover.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: 'Cover exceeds 5MB' }, { status: 400 })

        // 2. Validate Text Metadata
        const parsed = FormSchema.safeParse({
            title: formData.get('title'),
            description: formData.get('description'),
            is_featured: formData.get('is_featured'),
            genre: formData.get('genre'),
            tags: formData.get('tags')
        })

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
        }
        const data = parsed.data

        // 3. Upload Helper Function
        const uploadFile = async (file: File, folder: string) => {
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
            const path = `${user.id}/${folder}/${Date.now()}-${cleanName}`

            const { error } = await supabase.storage.from('music-content').upload(
                path,
                await file.arrayBuffer(),
                { contentType: file.type, duplex: 'half' }
            )

            if (error) throw new Error(`Failed to upload ${folder}: ${error.message}`)
            const { data: { publicUrl } } = supabase.storage.from('music-content').getPublicUrl(path)

            return { url: publicUrl, path }
        }

        // 4. Execute Uploads
        const audioData = await uploadFile(audio, 'tracks')
        let coverData = null

        if (cover && cover instanceof File) {
            coverData = await uploadFile(cover, 'covers').catch(() => null) // Non-fatal if cover fails
        }

        // normalize genre/tags to arrays (defensive)
        const genres = Array.isArray(data.genre)
            ? data.genre
            : (data.genre ? String(data.genre).split(',').map(s => s.trim()).filter(Boolean) : [])

        const tagsArr = Array.isArray(data.tags)
            ? data.tags
            : (data.tags ? String(data.tags).split(',').map(s => s.trim()).filter(Boolean) : [])

        // 5. Database Insert
        const { data: newTrack, error: dbError } = await supabase.from('music').insert({
            title: data.title,
            artist_id: user.id,
            is_featured: data.is_featured,
            description: data.description,
            genre: genres,
            tags: tagsArr,
            audio_url: audioData.url,
            audio_path: audioData.path,
            cover_url: coverData?.url || null,
            cover_path: coverData?.path || null,
            file_size: audio.size,
            mime_type: audio.type
        }).select().single()

        // 6. Cleanup on DB Failure
        if (dbError) {
            console.error('CRITICAL: Supabase Insert Error:', JSON.stringify(dbError, null, 2))
            const pathsToDelete = [audioData.path, coverData?.path].filter(Boolean) as string[]
            try {
                await supabase.storage.from('music-content').remove(pathsToDelete)
            } catch (cleanupErr) {
                console.error('Cleanup failed:', cleanupErr)
            }
            return NextResponse.json({
                error: 'Database insert failed',
                details: dbError.message,
                code: dbError.code,
                hint: dbError.hint
            }, { status: 400 }) // 400 is better than 500 for schema/policy issues
        }

        return NextResponse.json({ success: true, data: newTrack })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred'
        console.error('Unexpected Terminal Upload error:', error)
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)

    try {
        const artistId = searchParams.get('artist_id')
        const isFeatured = searchParams.get('featured') === 'true'
        const limit = Number(searchParams.get('limit')) || 20
        const page = Number(searchParams.get('page')) || 1
        const offset = (page - 1) * limit

        let query = supabase.from('music')
            .select('*, users:artist_id(id, email, full_name, avatar_url)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (artistId) query = query.eq('artist_id', artistId)
        if (isFeatured) query = query.eq('is_featured', true)

        const { data, error, count } = await query
        if (error) throw error

        return NextResponse.json({
            success: true,
            data,
            pagination: { page, limit, total: count, pages: count ? Math.ceil(count / limit) : 0 }
        })

    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch music'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}