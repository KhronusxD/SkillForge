"use client";

import { useState } from 'react';
import { useSkillStore } from '@/store/skillStore';
import { ArrowLeft, Save, User, Shield, Zap, Crown, Lock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BADGES } from '@/types/badges';

const AVATARS = [
    { id: 'warrior', name: 'Warrior', icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50' },
    { id: 'mage', name: 'Mage', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/50' },
    { id: 'rogue', name: 'Rogue', icon: User, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50' },
    { id: 'paladin', name: 'Paladin', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
];

export default function ProfilePage() {
    const { userProfile, updateUserProfile, unlockedBadges } = useSkillStore();
    const [name, setName] = useState(userProfile.name);
    const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatar);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateUserProfile({ name, avatar: selectedAvatar });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <main className="min-h-screen w-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col items-center overflow-y-auto">

            <div className="w-full max-w-4xl">
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-8">
                    Your Profile
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Settings */}
                    <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8 h-fit">
                        <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-6 py-4 text-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Avatar Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Choose Avatar Class</label>
                            <div className="grid grid-cols-2 gap-4">
                                {AVATARS.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        onClick={() => setSelectedAvatar(avatar.id)}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group",
                                            selectedAvatar === avatar.id
                                                ? `${avatar.bg} ${avatar.border} shadow-lg`
                                                : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                        )}
                                    >
                                        <div className={cn("p-3 rounded-xl transition-colors", selectedAvatar === avatar.id ? "bg-slate-900" : "bg-slate-900 group-hover:bg-slate-800")}>
                                            <avatar.icon className={cn("w-8 h-8", avatar.color)} />
                                        </div>
                                        <span className={cn("font-bold text-sm", selectedAvatar === avatar.id ? "text-white" : "text-slate-500")}>
                                            {avatar.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            {saved ? (
                                <>
                                    <Save className="w-6 h-6" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="w-6 h-6" />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Column: Badges */}
                    <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl h-fit">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Crown className="w-6 h-6 text-yellow-500" />
                            Badges & Achievements
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {BADGES.map((badge) => {
                                const isUnlocked = unlockedBadges.includes(badge.id);
                                const Icon = badge.icon;

                                return (
                                    <div
                                        key={badge.id}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                                            isUnlocked
                                                ? "bg-slate-800/50 border-slate-700"
                                                : "bg-slate-950/50 border-slate-800 opacity-60"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                            isUnlocked ? badge.bgColor : "bg-slate-800"
                                        )}>
                                            {isUnlocked ? (
                                                <Icon className={cn("w-6 h-6", badge.color)} />
                                            ) : (
                                                <Lock className="w-5 h-5 text-slate-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={cn("font-bold", isUnlocked ? "text-slate-200" : "text-slate-500")}>
                                                {badge.name}
                                            </h3>
                                            <p className="text-xs text-slate-500">{badge.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
