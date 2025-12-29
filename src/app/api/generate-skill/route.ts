import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { SkillTreeSchema, BranchSchema } from '@/types/schema';
import {
    SKILL_TREE_LEVEL_1_PROMPT,
    SKILL_TREE_LEVEL_2_PROMPT,
    SKILL_TREE_LEVEL_3_RESOURCES_PROMPT,
    SKILL_TREE_LEVEL_3_QUIZ_PROMPT,
    SKILL_TREE_LEVEL_3_TUTORIAL_PROMPT
} from '@/lib/prompts';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { skill, category, level, nodeContext, generationType } = body;

        let systemPrompt = "";
        let userPrompt = "";
        let responseSchema: any = z.any();

        if (level === 1) {
            if (!skill) return NextResponse.json({ error: 'Skill is required for Level 1' }, { status: 400 });
            systemPrompt = SKILL_TREE_LEVEL_1_PROMPT;
            userPrompt = `Generate a Level 1 Skill Tree for: ${skill}. Context/Category: ${category || 'General'}`;
            responseSchema = SkillTreeSchema;
        }
        else if (level === 2) {
            if (!nodeContext || !nodeContext.name) return NextResponse.json({ error: 'Node context is required for Level 2' }, { status: 400 });
            systemPrompt = SKILL_TREE_LEVEL_2_PROMPT
                .replace('{{skillName}}', skill || 'Unknown')
                .replace('{{nodeName}}', nodeContext.name)
                .replace('{{nodeDescription}}', nodeContext.description || '');
            userPrompt = `Generate Level 2 sub-tasks for the Main Area: ${nodeContext.name}`;
            // Schema for Level 2 is just a list of branches wrapped in an object
            responseSchema = z.object({ branches: z.array(BranchSchema) });
        }
        else if (level === 3) {
            if (!nodeContext || !nodeContext.name || !generationType) return NextResponse.json({ error: 'Node context and generation type required for Level 3' }, { status: 400 });

            const replacements = [
                { key: '{{skillName}}', value: skill || 'Unknown' },
                { key: '{{nodeName}}', value: nodeContext.name },
                { key: '{{nodeDescription}}', value: nodeContext.description || '' }
            ];

            if (generationType === 'resources') {
                systemPrompt = SKILL_TREE_LEVEL_3_RESOURCES_PROMPT;
                userPrompt = `Generate resources for: ${nodeContext.name}`;
            } else if (generationType === 'quiz') {
                systemPrompt = SKILL_TREE_LEVEL_3_QUIZ_PROMPT;
                userPrompt = `Generate quiz for: ${nodeContext.name}`;
            } else if (generationType === 'tutorial') {
                systemPrompt = SKILL_TREE_LEVEL_3_TUTORIAL_PROMPT;
                userPrompt = `Generate tutorial for: ${nodeContext.name}`;
            } else {
                return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 });
            }

            replacements.forEach(r => {
                systemPrompt = systemPrompt.replace(r.key, r.value);
            });

            responseSchema = z.any(); // Flexible schema for level 3 parts
        }
        else {
            return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const data = JSON.parse(content);

        // For Level 1, ensure category is set
        if (level === 1) {
            const dataWithCategory = { ...data, category: category || data.category || 'Other' };
            // Validate if possible, but be lenient to avoid breaking on minor schema mismatches from AI
            return NextResponse.json(dataWithCategory);
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
