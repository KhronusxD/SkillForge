import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-proj-...'
});

export async function POST(req: Request) {
    try {
        const { nodeContext } = await req.json();

        if (!nodeContext) {
            return NextResponse.json({ error: 'Missing context' }, { status: 400 });
        }

        const systemPrompt = `
You are a Quiz Generator.
Generate a 3-question multiple choice quiz for the topic: "${nodeContext.name}".
Context: ${nodeContext.description}

Output JSON format:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctIndex": number (0-3)
    }
  ]
}
Return ONLY valid JSON.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const quiz = JSON.parse(completion.choices[0].message.content || '{}');

        return NextResponse.json(quiz);

    } catch (error) {
        console.error('Quiz Gen Error:', error);
        return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
    }
}
