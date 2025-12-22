import OpenAI from 'openai'
import { logError } from './utils/errors'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout
  maxRetries: 2,
})

const SYSTEM_PROMPT = `You are an expert essay writer. Write comprehensive, well-structured essays based on the given prompt. The essay should be well-organized with an introduction, body paragraphs, and a conclusion. Use clear, academic language and ensure proper flow between paragraphs.`

export async function generateEssay(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        timeout: 60000, // 60 second timeout
      }
    )

    const content = completion.choices[0]?.message?.content

    if (!content) {
      logError(new Error('OpenAI returned empty response'), { prompt })
      throw new Error('Failed to generate essay. The AI returned an empty response.')
    }

    return content
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      logError(error, {
        prompt,
        status: error.status,
        code: error.code,
        type: error.type,
      })

      // Handle specific OpenAI errors
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.')
      }
      if (error.status === 401) {
        throw new Error('Authentication failed. Please contact support.')
      }
      if (error.status === 500 || error.status === 503) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.')
      }
    }

    logError(error, { prompt })
    throw new Error('Failed to generate essay. Please try again.')
  }
}

