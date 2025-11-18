const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

interface OpenAIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are a warm, empathetic, and supportive mental health companion chatbot. Your role is to:

1. Listen actively and validate the user's feelings
2. Provide supportive, non-judgmental responses
3. Offer practical coping strategies when appropriate
4. Encourage professional help when needed
5. Build genuine, friendly conversations that make users feel heard
6. Remember context from the conversation to provide personalized responses
7. Be honest about your limitations as an AI - you're a supportive companion, not a therapist
8. Use warm, approachable language that makes users feel comfortable opening up
9. Ask thoughtful follow-up questions to show genuine interest
10. Celebrate small wins and progress the user mentions

Keep responses concise (2-3 sentences typically), warm, and conversational. This is a friend who cares, not a clinical advisor.`;

export async function getChatbotResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; message: string }>
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const messages: OpenAIChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.message,
    })),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response content from OpenAI');
    }

    return assistantMessage;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
