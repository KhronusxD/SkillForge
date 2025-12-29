"use client";

import Link from 'next/link';
import { useSkillStore } from '@/store/skillStore';
import { Plus, Zap } from 'lucide-react';

export default function SkillsPage() {
    const { skills } = useSkillStore();

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                        My Skills
                    </h1>
                    <p className="text-slate-400">Manage your active learning paths.</p>
                </div>

                <Link
                    href="/"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                    <Plus className="w-5 h-5" />
                    New Skill
                </Link>
            </header>

            {skills.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                    <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
                        <Zap className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-500">No skills yet</h3>
                    <p className="text-slate-600 mb-6">Start your journey by forging a new skill.</p>
                    <Link
                        href="/"
                        className="text-blue-500 hover:underline"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, idx) => (
                        <Link
                            key={idx}
                            href={`/skill/${encodeURIComponent(skill.skillName)}`}
                            className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-400">
                                    {skill.totalXp.toLocaleString()} XP
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                {skill.skillName}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                {skill.description}
                            </p>

                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[10%]"></div> {/* Mock progress */}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
