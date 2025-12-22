import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateEssay } from '@/lib/openai'
import { validatePrompt, sanitizePrompt } from '@/lib/utils/validation'
import { rateLimit, getRateLimitIdentifier } from '@/lib/utils/rate-limit'
import { withTimeout } from '@/lib/utils/timeout'
import { formatErrorResponse, logError, AuthenticationError, ValidationError, AuthorizationError } from '@/lib/utils/errors'

const ESSAY_GENERATION_TIMEOUT = 60000 // 60 seconds
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 essays per minute per user

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new AuthenticationError()
    }

    // Rate limiting
    const rateLimitId = getRateLimitIdentifier(request, user.id)
    const rateLimitResult = rateLimit(rateLimitId, {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX,
    })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait before generating another essay.',
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          },
        }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { prompt } = body

    // Validate prompt
    const validation = validatePrompt(prompt)
    if (!validation.valid) {
      throw new ValidationError(validation.error || 'Invalid prompt')
    }

    const sanitizedPrompt = sanitizePrompt(prompt)

    // Check user credits and get profile in one query
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      logError(profileError, { userId: user.id, action: 'get_profile' })
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (profile.credits < 1) {
      throw new AuthorizationError('Insufficient credits')
    }

    // Generate essay with timeout
    const essayContent = await withTimeout(
      generateEssay(sanitizedPrompt),
      ESSAY_GENERATION_TIMEOUT,
      'Essay generation timed out'
    )

    // Use transaction-like approach: update credits and save essay
    // First, try to deduct credit atomically
    const { data: updatedProfile, error: creditError } = await supabase
      .from('user_profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id)
      .eq('credits', profile.credits) // Optimistic locking to prevent race conditions
      .select('credits')
      .single()

    if (creditError || !updatedProfile) {
      logError(creditError, { userId: user.id, credits: profile.credits })
      return NextResponse.json(
        { error: 'Failed to update credits. Please try again.' },
        { status: 500 }
      )
    }

    // Save essay to database
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .insert({
        user_id: user.id,
        prompt: sanitizedPrompt,
        content: essayContent,
      })
      .select()
      .single()

    if (essayError) {
      // Rollback credit if essay save fails
      await supabase
        .from('user_profiles')
        .update({ credits: profile.credits })
        .eq('id', user.id)

      logError(essayError, { userId: user.id, prompt: sanitizedPrompt })
      return NextResponse.json({ error: 'Failed to save essay' }, { status: 500 })
    }

    // Log activity (non-blocking)
    ;(async () => {
      try {
        await supabase.rpc('log_activity', {
          p_user_id: user.id,
          p_action_type: 'essay_generated',
          p_details: { essay_id: essay.id, prompt: sanitizedPrompt },
        })
      } catch (err) {
        logError(err, { userId: user.id, action: 'log_activity' })
      }
    })()

    return NextResponse.json(
      {
        essay,
        credits: updatedProfile.credits,
      },
      {
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime),
        },
      }
    )
  } catch (error) {
    const errorResponse = formatErrorResponse(error)
    logError(error, { endpoint: '/api/generate-essay', method: 'POST' })
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}

