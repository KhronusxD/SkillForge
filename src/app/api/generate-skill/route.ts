import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { SkillTreeSchema } from '@/types/schema';
import { SKILL_TREE_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
    try {
        const { skill, category } = await req.json();

        if (!skill) {
            return NextResponse.json({ error: 'Skill is required' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SKILL_TREE_SYSTEM_PROMPT },
                { role: "user", content: `Generate a skill tree for: ${skill}. Context/Category: ${category || 'General'}` }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const data = JSON.parse(content);
        // Merge category from request if not present (or overwrite to ensure consistency)
        const dataWithCategory = { ...data, category: category || data.category || 'Other' };

        const validated = SkillTreeSchema.parse(dataWithCategory);

        return NextResponse.json(validated);
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: 'Failed to generate skill tree' }, { status: 500 });
    }
}
