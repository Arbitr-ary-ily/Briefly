import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import slugify from 'slugify'

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { title, content, sourceArticles } = await req.json()
    const slug = slugify(title, { lower: true, strict: true })

    const { data, error } = await supabase
      .from('storyboards')
      .insert({
        user_id: userId,
        title,
        content,
        slug,
        published_at: new Date().toISOString(),
        source_articles: sourceArticles,
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return new Response(JSON.stringify({ success: true, data, slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error publishing storyboard:', error)
    return new Response(JSON.stringify({ error: 'Failed to publish storyboard', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
