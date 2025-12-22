import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, content } = await request.json()

    if (!id || !content) {
      return NextResponse.json({ error: 'Essay ID and content are required' }, { status: 400 })
    }

    // Verify ownership
    const { data: existingEssay, error: fetchError } = await supabase
      .from('essays')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingEssay) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 })
    }

    // Update essay
    const { data: essay, error: updateError } = await supabase
      .from('essays')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update essay' }, { status: 500 })
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action_type: 'essay_edited',
      p_details: { essay_id: id },
    })

    return NextResponse.json({ essay })
  } catch (error) {
    console.error('Error updating essay:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

