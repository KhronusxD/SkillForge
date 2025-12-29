"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSkillStore } from '@/store/skillStore';
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
    "Technical Skills",
    "Soft Skills",
    "Languages",
    "Creative Arts",
    "Health & Fitness",
    "Business & Finance",
    "Other"
];

export default function CreateSkillPage() {
    const router = useRouter();
    const { addSkill, isLoading, setLoading, skills } = useSkillStore();
    const [inputSkill, setInputSkill] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

    const handleGenerate = async () => {
        if (!inputSkill.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/generate-skill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skill: inputSkill, category: selectedCategory, level: 1 }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Ensure category is set (API might not return it if not prompted, but we can override/merge)
            const finalSkill = { ...data, category: selectedCategory };

            addSkill(finalSkill);
            router.push(`/skill/${encodeURIComponent(finalSkill.skillName)}`);
        } catch (error) {
            console.error(error);
            alert('Failed to generate skill tree. Check API Key.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        const { MOCK_SKILL_TREE } = await import('@/lib/mockData');

        const demoSkill = {
            ...MOCK_SKILL_TREE,
            skillName: `${MOCK_SKILL_TREE.skillName} ${skills.length + 1}`,
            category: "Technical Skills"
        };

        addSkill(demoSkill);
        router.push(`/skill/${encodeURIComponent(demoSkill.skillName)}`);
        setLoading(false);
    };

    return (
        <main className="min-h-screen w-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-2xl">
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
                        Forge a New Skill
                    </h1>
                    <p className="text-slate-400 text-lg">
                        What do you want to master today?
                    </p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl">

                    {/* Category Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Category</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Skill Name</label>
                        <input
                            type="text"
                            value={inputSkill}
                            onChange={(e) => setInputSkill(e.target.value)}
                            placeholder="e.g. React, Public Speaking, Piano..."
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-6 py-4 text-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !inputSkill.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Forging Path...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6" />
                                Generate Skill Tree
                            </>
                        )}
                    </button>

                    <div className="text-center mt-6">
                        <button onClick={handleDemo} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                            Or try a demo skill
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
