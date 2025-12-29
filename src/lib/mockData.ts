import { SkillTree } from '@/types/schema';

export const MOCK_SKILL_TREE: SkillTree = {
    skillName: "Full Stack Development",
    description: "Master the art of building complete web applications from frontend to backend.",
    totalXp: 12000,
    branches: [
        {
            id: "frontend_mastery",
            name: "Frontend Mastery",
            level: "Basic",
            description: "Building beautiful, interactive user interfaces.",
            xpReward: 3000,
            subSkills: [
                { id: "html_css", name: "HTML & CSS", type: "theory", status: "completed", description: "The skeleton and skin of the web." },
                { id: "js_basics", name: "JavaScript Basics", type: "practice", status: "available", description: "Making things interactive." },
                { id: "react_core", name: "React Core", type: "project", status: "locked", description: "Component-based architecture." }
            ],
            objectives: ["Build a personal portfolio", "Clone a landing page"]
        },
        {
            id: "backend_foundation",
            name: "Backend Foundation",
            level: "Intermediate",
            description: "Server-side logic and databases.",
            xpReward: 4000,
            subSkills: [
                { id: "nodejs", name: "Node.js", type: "theory", status: "locked" },
                { id: "db_design", name: "Database Design", type: "practice", status: "locked" },
                { id: "api_rest", name: "REST APIs", type: "project", status: "locked" }
            ]
        },
        {
            id: "devops_deployment",
            name: "DevOps & Deployment",
            level: "Advanced",
            description: "Shipping code to the world.",
            xpReward: 5000,
            subSkills: [
                { id: "docker", name: "Docker", type: "theory", status: "locked" },
                { id: "ci_cd", name: "CI/CD Pipelines", type: "practice", status: "locked" }
            ]
        }
    ]
};
