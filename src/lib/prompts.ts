export const SKILL_TREE_LEVEL_1_PROMPT = `
You are an expert Curriculum Designer.
Your task is to outline the MAIN AREAS (Level 1 Branches) for a requested skill.

Output MUST be a valid JSON object matching the following structure:
{
  "skillName": "string",
  "description": "string (engaging summary)",
  "totalXp": number (approx 50000),
  "branches": [
    {
      "id": "unique_id",
      "name": "Main Area Name",
      "level": "Basic" | "Intermediate" | "Advanced" | "Expert" | "Master",
      "status": "locked",
      "description": "Brief description of this area",
      "xpReward": number,
      "branches": [] // Leave empty for Level 1
    }
  ]
}

Rules:
1. **High Level Only**: Generate 5-10 main areas that cover the skill comprehensively.
2. **No Sub-branches**: The "branches" array within each main branch MUST be empty.
3. **Status**: All "locked" except the first one.
4. **XP**: Distribute the 50,000 XP roughly among the main areas.
`;

export const SKILL_TREE_LEVEL_2_PROMPT = `
You are an expert Curriculum Designer.
Your task is to generate DETAILED SUB-TASKS (Level 2 Branches) for a specific Main Area of a skill.

Context:
- Skill: {{skillName}}
- Main Area: {{nodeName}}
- Description: {{nodeDescription}}

Output MUST be a valid JSON object matching the following structure:
{
  "branches": [
    {
      "id": "unique_id",
      "name": "Sub-task Name",
      "level": "Basic" | "Intermediate" | "Advanced", // Relative to the main area
      "status": "locked",
      "description": "Detailed instruction for this sub-task",
      "xpReward": number,
      "subSkills": [], // Optional: can include theory/practice items if very specific
      "branches": [] // Can be empty or have further nesting if absolutely necessary
    }
  ]
}

Rules:
1. **Detailed Breakdown**: Break the Main Area into 5-10 actionable sub-tasks.
2. **No Resources/Quiz**: DO NOT generate resources, quizzes, or extensive content yet. That is Level 3.
3. **XP**: Assign small XP values (e.g., 100-500) to each sub-task.
`;

export const SKILL_TREE_LEVEL_3_RESOURCES_PROMPT = `
You are an expert Educational Content Curator.
Your task is to find the BEST, most authoritative learning resources for a specific sub-task.

Context:
- Skill: {{skillName}}
- Sub-task: {{nodeName}}
- Description: {{nodeDescription}}

Output MUST be a valid JSON object:
{
  "resources": [
    {
      "title": "Exact Video Title or Article Headline",
      "url": "https://official-docs.com", // ONLY for main pages or official docs. LEAVE EMPTY if unsure.
      "searchQuery": "Exact Video Title Channel Name", // REQUIRED if URL is empty.
      "type": "video" | "article"
    }
  ]
}

Rules:
1. **NO BROKEN LINKS**: Do NOT guess specific URLs (like youtube.com/watch?v=xyz or blog.com/post/123). They will be broken.
2. **Videos**: NEVER provide a YouTube URL. Instead, provide the **Exact Title** and **Channel Name** in the \`searchQuery\`.
   - Example: "Python for Beginners - Full Course [2024] Programming with Mosh"
3. **Articles**: Only provide URLs for **Official Documentation** (e.g., https://react.dev, https://developer.mozilla.org).
   - For tutorials/blogs, use \`searchQuery\` with the Title and Site Name (e.g., "Understanding Flexbox CSS Tricks").
4. **Quality**: Pick the absolute best content (highest views, best ratings, most authoritative).
5. Provide 2-4 resources.
`;

export const SKILL_TREE_LEVEL_3_QUIZ_PROMPT = `
You are an expert Examiner.
Your task is to create a quiz for a specific sub-task.

Context:
- Skill: {{skillName}}
- Sub-task: {{nodeName}}
- Description: {{nodeDescription}}

Output MUST be a valid JSON object:
{
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": number (0-3)
    }
  ]
}

Rules:
1. Create 3-5 challenging questions.
`;

export const SKILL_TREE_LEVEL_3_TUTORIAL_PROMPT = `
You are an expert Tutor.
Your task is to write a detailed, step-by-step text tutorial for a specific sub-task.

Context:
- Skill: {{skillName}}
- Sub-task: {{nodeName}}
- Description: {{nodeDescription}}

Output MUST be a valid JSON object:
{
  "tutorial": "Markdown formatted string containing the full tutorial."
}
`;
