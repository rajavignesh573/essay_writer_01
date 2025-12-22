import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * Health check endpoint for monitoring
 */
export async function GET() {
  const startTime = Date.now()
  
  try {
    // Check database connection
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from('user_profiles').select('count').limit(1)
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      database: error ? 'disconnected' : 'connected',
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

