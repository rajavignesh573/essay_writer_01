/**
 * Input validation and sanitization utilities
 */

export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' }
  }

  const trimmed = prompt.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' }
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Prompt is too long (max 5000 characters)' }
  }

  return { valid: true }
}

export function sanitizePrompt(prompt: string): string {
  return prompt.trim().slice(0, 5000)
}

export function validateEssayContent(content: string): { valid: boolean; error?: string } {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Content is required' }
  }

  if (content.length > 50000) {
    return { valid: false, error: 'Essay content is too long (max 50000 characters)' }
  }

  return { valid: true }
}

export function sanitizeEssayContent(content: string): string {
  return content.trim().slice(0, 50000)
}

export function validatePlanType(planType: unknown): planType is 'monthly' | 'annual' {
  return planType === 'monthly' || planType === 'annual'
}

