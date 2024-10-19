import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request, { params }) {
  const { slug } = params

  try {
    // Get the authenticated user's ID and full name
    const { userId, user } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the storyboard based on the slug and user_id
    const { data: story, error } = await supabase
      .from('storyboards')
      .select('*')
      .eq('slug', slug)
      .eq('user_id', userId) // Ensure the story belongs to the authenticated user
      .single()

    if (error) {
      console.error('Error fetching story:', error.message) // Log the error message
      return NextResponse.json({ error: 'Failed to fetch story', details: error.message }, { status: 500 })
    }

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const formattedStory = {
      ...story,
      user_name: user?.fullName || 'Anonymous', // Get the user's full name from Clerk
      content: JSON.parse(story.content), // Ensure content is parsed if it's stored as JSON
      source_articles: JSON.parse(story.source_articles) // Ensure source_articles is parsed if it's stored as JSON
    }

    return NextResponse.json(formattedStory)
  } catch (error) {
    console.error('Error fetching story:', error) // Log the error
    return NextResponse.json({ error: 'Failed to fetch story', details: error.message }, { status: 500 })
  }
}
