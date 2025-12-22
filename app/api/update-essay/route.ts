import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { validateEssayContent, sanitizeEssayContent } from '@/lib/utils/validation'
import { formatErrorResponse, logError, AuthenticationError, ValidationError, NotFoundError } from '@/lib/utils/errors'

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new AuthenticationError()
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { id, content } = body

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Essay ID is required')
    }

    if (!content) {
      throw new ValidationError('Content is required')
    }

    // Validate content
    const validation = validateEssayContent(content)
    if (!validation.valid) {
      throw new ValidationError(validation.error || 'Invalid content')
    }

    const sanitizedContent = sanitizeEssayContent(content)

    // Verify ownership and update in one query
    const { data: essay, error: updateError } = await supabase
      .from('essays')
      .update({
        content: sanitizedContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure ownership
      .select()
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        // No rows returned - essay not found or not owned by user
        throw new NotFoundError('Essay not found')
      }
      logError(updateError, { userId: user.id, essayId: id })
      return NextResponse.json({ error: 'Failed to update essay' }, { status: 500 })
    }

    if (!essay) {
      throw new NotFoundError('Essay not found')
    }

    // Log activity (non-blocking)
    ;(async () => {
      try {
        await supabase.rpc('log_activity', {
          p_user_id: user.id,
          p_action_type: 'essay_edited',
          p_details: { essay_id: id },
        })
      } catch (err) {
        logError(err, { userId: user.id, action: 'log_activity' })
      }
    })()

    return NextResponse.json({ essay })
  } catch (error) {
    const errorResponse = formatErrorResponse(error)
    logError(error, { endpoint: '/api/update-essay', method: 'PUT' })
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}

