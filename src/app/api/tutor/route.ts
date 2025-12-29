import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-proj-...' // Fallback for build time
});

export async function POST(req: Request) {
    try {
        const { messages, nodeContext } = await req.json();

        if (!messages || !nodeContext) {
            return NextResponse.json({ error: 'Missing messages or context' }, { status: 400 });
        }

        const systemPrompt = `
You are an expert AI Tutor specializing in "${nodeContext.name}".
Context:
- Description: ${nodeContext.description}
- Objectives: ${nodeContext.objectives?.join(', ') || 'N/A'}

Your goal is to help the user understand this specific topic.
- Be concise, encouraging, and educational.
- Use analogies where appropriate.
- If the user asks about something unrelated, politely steer them back to ${nodeContext.name}.
- Format your response in Markdown.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('AI Tutor Error:', error);
        return NextResponse.json({ error: 'Failed to get tutor response' }, { status: 500 });
    }
}
