"use client";

import { useState, useMemo } from 'react';
import { useSkillStore } from '@/store/skillStore';
import { Branch } from '@/types/schema';
import { CheckCircle, Lock, Circle, Trello } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KanbanPage() {
    const { skills, completeNode } = useSkillStore();
    const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.skillName || '');

    const selectedSkill = skills.find(s => s.skillName === selectedSkillId);

    // Flatten the tree to get all nodes
    const allNodes = useMemo(() => {
        if (!selectedSkill) return [];
        const nodes: Branch[] = [];
        const traverse = (branches: Branch[]) => {
            branches.forEach(branch => {
                nodes.push(branch);
                if (branch.branches) traverse(branch.branches);
            });
        };
        traverse(selectedSkill.branches);
        return nodes;
    }, [selectedSkill]);

    const columns = {
        todo: allNodes.filter(n => n.status === 'available'),
        done: allNodes.filter(n => n.status === 'completed'),
        locked: allNodes.filter(n => n.status === 'locked'),
    };

    if (skills.length === 0) {
        return (
            <div className="p-12 text-center text-slate-500">
                <Trello className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-bold">No skills found</h2>
                <p>Create a skill to view the Kanban board.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 h-screen flex flex-col overflow-hidden">
            {/* Header & Selector */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                        Kanban Board
                    </h1>
                    <p className="text-slate-400">Track your progress task by task.</p>
                </div>

                <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                >
                    {skills.map(s => (
                        <option key={s.skillName} value={s.skillName}>{s.skillName}</option>
                    ))}
                </select>
            </header>

            {/* Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-6 h-full min-w-[1000px]">

                    {/* To Do Column */}
                    <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                            <Circle className="w-5 h-5 text-blue-400" />
                            <h3 className="font-bold text-slate-300">Available (To Do)</h3>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500">{columns.todo.length}</span>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1">
                            {columns.todo.map(node => (
                                <div key={node.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm hover:border-blue-500/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold bg-blue-900/30 text-blue-300 px-2 py-1 rounded uppercase tracking-wider">
                                            {node.level}
                                        </span>
                                        <span className="text-xs text-slate-500">{node.xpReward} XP</span>
                                    </div>
                                    <h4 className="font-bold text-slate-200 mb-2">{node.name}</h4>
                                    <button
                                        onClick={() => completeNode(selectedSkillId, node.id)}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        Complete
                                    </button>
                                </div>
                            ))}
                            {columns.todo.length === 0 && (
                                <div className="text-center py-8 text-slate-600 text-sm">
                                    No available tasks. Unlock more by completing current ones!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Done Column */}
                    <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-bold text-slate-300">Completed</h3>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500">{columns.done.length}</span>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1">
                            {columns.done.map(node => (
                                <div key={node.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 opacity-75">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded uppercase tracking-wider">
                                            {node.level}
                                        </span>
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <h4 className="font-bold text-slate-400 line-through">{node.name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Locked Column */}
                    <div className="flex-1 bg-slate-900/20 border border-slate-800/50 rounded-2xl flex flex-col">
                        <div className="p-4 border-b border-slate-800/50 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-slate-600" />
                            <h3 className="font-bold text-slate-500">Locked</h3>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-600">{columns.locked.length}</span>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1">
                            {columns.locked.map(node => (
                                <div key={node.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 border-dashed">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold bg-slate-800 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">
                                            {node.level}
                                        </span>
                                        <Lock className="w-3 h-3 text-slate-700" />
                                    </div>
                                    <h4 className="font-bold text-slate-600">{node.name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
