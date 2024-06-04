import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Setup OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY, // API key for OpenAI
});


// Store conversations in memory
let sessionConversations: { [key: string]: any[] } = {};

export async function POST(req: Request) {
  try {
    const { prompt, sessionId } = await req.json();

    let messages = [
      {
        role: 'system',
        content: 'give a response to the message from the date on the dating app. keep it casual',
      },
    ];

    messages.push({ role: 'user', content: prompt });
    sessionConversations[sessionId] = messages;

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const botMessage = gptResponse.data.choices[0].message.content;
    sessionConversations[sessionId].push({
      role: 'assistant',
      content: botMessage,
    });

    return NextResponse.json({
      message: 'Success',
      response: botMessage,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
