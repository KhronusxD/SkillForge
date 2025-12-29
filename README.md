# SkillForge

**SkillForge** is an AI-powered skill tree generator and project management tool designed to gamify your learning journey. By transforming broad topics into detailed, interactive roadmaps, SkillForge helps you master new skills through structured progression and visual feedback.

## 🚀 Features

- **AI-Generated Skill Trees**: Instantly generate comprehensive learning paths for any topic (e.g., "React", "Digital Marketing", "Survival Skills").
- **Interactive Visualization**: Explore your skills as dynamic, zoomable node graphs.
- **Gamification**:
  - **XP & Leveling**: Earn XP for completing nodes and level up your global profile.
  - **Streaks**: Maintain daily activity streaks.
  - **Badges**: Unlock achievements for milestones.
  - **Leaderboard**: See how you rank against others.
- **Content & Learning**:
  - **AI Tutor**: Chat with an AI assistant context-aware of the specific node you are studying.
  - **Resources**: Automatically curated YouTube videos and articles.
  - **Quizzes**: Test your knowledge with AI-generated quizzes.
- **Project Management**: Kanban board to track your learning tasks.
- **Focus Mode**: A 3D "City Builder" timer to keep you focused.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with Persistence)
- **Visualization**: [React Flow](https://reactflow.dev/) & [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI**: OpenAI API (GPT-4o)

## 📦 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/skillforge.git
    cd skillforge
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=sk-proj-...
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## 🎮 How to Play

1.  **Create a Skill**: Click "New Skill" and enter a topic (e.g., "Python").
2.  **Explore the Tree**: Click on nodes to see details, resources, and chat with the AI Tutor.
3.  **Complete Nodes**: Mark nodes as "Complete" to earn XP and unlock new branches.
4.  **Level Up**: Watch your global level rise and unlock new badges!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
