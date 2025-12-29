"use client";

import { useSkillStore } from '@/store/skillStore';
import { Trash2, Settings as SettingsIcon, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const { skills, addSkill, soundEnabled, toggleSound } = useSkillStore();
    const [apiKey, setApiKey] = useState('');

    const handleReset = () => {
        if (confirm('Are you sure you want to delete all your progress? This cannot be undone.')) {
            localStorage.removeItem('skillforge-storage');
            window.location.reload();
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                    Settings
                </h1>
                <p className="text-slate-400">Configure your SkillForge experience.</p>
            </header>

            <div className="space-y-8">

                {/* API Key Section (Optional Future Feature) */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                            <SettingsIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">General Configuration</h2>
                            <p className="text-sm text-slate-500">Manage your API keys and preferences.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">OpenAI API Key (Optional Override)</label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="sk-..."
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 rounded-xl font-bold transition-colors">
                                    <Save className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-600 mt-2">
                                By default, the app uses the key from .env.local. You can override it here (stored locally).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Audio Settings */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                            <SettingsIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">Audio & Immersion</h2>
                            <p className="text-sm text-slate-500">Customize your sensory experience.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div>
                            <h3 className="font-bold text-slate-300">Sound Effects</h3>
                            <p className="text-sm text-slate-500">Play sounds for clicks, level ups, and completion.</p>
                        </div>
                        <button
                            onClick={toggleSound}
                            className={`w-14 h-8 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-red-900/20 rounded-xl text-red-500">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
                            <p className="text-sm text-red-400/60">Irreversible actions.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-red-950/20 p-4 rounded-xl border border-red-900/20">
                        <div>
                            <h3 className="font-bold text-red-400">Reset All Data</h3>
                            <p className="text-sm text-red-400/60">Delete all skills, XP, and progress.</p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/10"
                        >
                            Reset Everything
                        </button>
                    </div>
                </section>

            </div >
        </div >
    );
}
