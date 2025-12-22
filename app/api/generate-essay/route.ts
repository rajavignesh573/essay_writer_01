import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateEssay } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Check user credits
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
    }

    // Generate essay
    const essayContent = await generateEssay(prompt)

    // Deduct credit
    const { error: creditError } = await supabase
      .from('user_profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id)

    if (creditError) {
      return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 })
    }

    // Save essay to database
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .insert({
        user_id: user.id,
        prompt: prompt.trim(),
        content: essayContent,
      })
      .select()
      .single()

    if (essayError) {
      return NextResponse.json({ error: 'Failed to save essay' }, { status: 500 })
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action_type: 'essay_generated',
      p_details: { essay_id: essay.id, prompt: prompt.trim() },
    })

    return NextResponse.json({ essay, credits: profile.credits - 1 })
  } catch (error) {
    console.error('Error generating essay:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

