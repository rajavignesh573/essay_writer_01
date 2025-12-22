import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEssay(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using GPT-4o-mini as GPT-5 mini doesn't exist yet
      messages: [
        {
          role: 'system',
          content: 'You are an expert essay writer. Write comprehensive, well-structured essays based on the given prompt. The essay should be well-organized with an introduction, body paragraphs, and a conclusion.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'Failed to generate essay.'
  } catch (error) {
    console.error('Error generating essay:', error)
    throw new Error('Failed to generate essay. Please try again.')
  }
}

