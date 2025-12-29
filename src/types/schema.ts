import { z } from "zod";

export const SubSkillSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.preprocess((val) => String(val).toLowerCase(), z.enum(["theory", "practice", "project"])),
    status: z.preprocess((val) => String(val).toLowerCase(), z.enum(["locked", "available", "completed", "in-progress"])).default("locked"),
    description: z.string().optional(),
});

export type SubSkill = z.infer<typeof SubSkillSchema>;

export interface Branch {
    id: string;
    name: string;
    level: "Basic" | "Intermediate" | "Advanced" | "Expert" | "Master";
    status?: "locked" | "available" | "completed";
    description: string;
    resources?: { title: string; url?: string; searchQuery?: string; type: 'video' | 'article' }[];
    quiz?: { question: string; options: string[]; correctIndex: number }[];
    notes?: string;
    xpReward: number;
    subSkills?: SubSkill[];
    objectives?: string[];
    branches?: Branch[];
}

export const BranchSchema: z.ZodType<Branch> = z.lazy(() => z.object({
    id: z.string(),
    name: z.string(),
    level: z.enum(["Basic", "Intermediate", "Advanced", "Expert", "Master"]),
    status: z.preprocess((val) => String(val).toLowerCase(), z.enum(["locked", "available", "completed"])).optional().default("locked"),
    description: z.string(),
    resources: z.array(z.object({
        title: z.string(),
        url: z.string().optional(),
        searchQuery: z.string().optional(),
        type: z.preprocess((val) => String(val).toLowerCase(), z.enum(['video', 'article']))
    })).optional(),
    quiz: z.array(z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctIndex: z.number()
    })).optional(),
    notes: z.string().optional(),
    xpReward: z.number(),
    subSkills: z.array(SubSkillSchema).optional(),
    objectives: z.array(z.string()).optional(),
    branches: z.array(BranchSchema).optional(),
}));

export const SkillTreeSchema = z.object({
    skillName: z.string(),
    description: z.string(),
    category: z.string().optional().default("Other"),
    totalXp: z.number(),
    branches: z.array(BranchSchema),
});

export interface SkillTree {
    skillName: string;
    description: string;
    category?: string;
    totalXp: number;
    branches: Branch[];
}
