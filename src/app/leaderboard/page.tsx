"use client";

import { useSkillStore } from '@/store/skillStore';
import { Trophy, Medal, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data
interface LeaderboardUser {
    id: string;
    name: string;
    level: number;
    xp: number;
    avatar: string;
    isCurrentUser?: boolean;
}

const MOCK_USERS: LeaderboardUser[] = [
    { id: '1', name: 'CodeWizard', level: 12, xp: 12500, avatar: 'mage' },
    { id: '2', name: 'DevNinja', level: 10, xp: 10200, avatar: 'rogue' },
    { id: '3', name: 'PixelArtist', level: 9, xp: 9800, avatar: 'paladin' },
    { id: '4', name: 'Rustacean', level: 8, xp: 8500, avatar: 'warrior' },
    { id: '5', name: 'Pythonista', level: 7, xp: 7200, avatar: 'mage' },
];

export default function LeaderboardPage() {
    const { userProfile, getTotalXp } = useSkillStore();
    const userXp = getTotalXp();
    const userLevel = Math.floor(userXp / 1000) + 1;

    // Combine mock users with current user and sort
    const allUsers: LeaderboardUser[] = [
        ...MOCK_USERS,
        {
            id: 'current-user',
            name: userProfile.name,
            level: userLevel,
            xp: userXp,
            avatar: userProfile.avatar,
            isCurrentUser: true
        }
    ].sort((a, b) => b.xp - a.xp);

    return (
        <main className="min-h-screen w-screen bg-slate-950 text-slate-100 p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">

                <header className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full mb-6">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                        Global Leaderboard
                    </h1>
                    <p className="text-slate-400">See where you stand among the greatest SkillForgers.</p>
                </header>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-6 bg-slate-800/50 text-slate-400 font-bold text-sm uppercase tracking-wider border-b border-slate-800">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">Forger</div>
                        <div className="col-span-2 text-center">Level</div>
                        <div className="col-span-2 text-right">XP</div>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-slate-800">
                        {allUsers.map((user, index) => {
                            const rank = index + 1;
                            const isTop3 = rank <= 3;

                            return (
                                <div
                                    key={user.id}
                                    className={cn(
                                        "grid grid-cols-12 gap-4 p-6 items-center transition-colors",
                                        user.isCurrentUser ? "bg-blue-500/10 hover:bg-blue-500/20" : "hover:bg-slate-800/30"
                                    )}
                                >
                                    {/* Rank */}
                                    <div className="col-span-2 flex justify-center">
                                        {rank === 1 ? (
                                            <Medal className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                        ) : rank === 2 ? (
                                            <Medal className="w-8 h-8 text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.5)]" />
                                        ) : rank === 3 ? (
                                            <Medal className="w-8 h-8 text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]" />
                                        ) : (
                                            <span className="text-xl font-bold text-slate-500">#{rank}</span>
                                        )}
                                    </div>

                                    {/* User */}
                                    <div className="col-span-6 flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg",
                                            user.isCurrentUser ? "bg-blue-600" : "bg-slate-700"
                                        )}>
                                            {user.avatar === 'mage' ? <User className="w-5 h-5" /> : user.name[0]}
                                        </div>
                                        <div>
                                            <p className={cn("font-bold", user.isCurrentUser ? "text-blue-400" : "text-slate-200")}>
                                                {user.name} {user.isCurrentUser && "(You)"}
                                            </p>
                                            <p className="text-xs text-slate-500 capitalize">{user.avatar}</p>
                                        </div>
                                    </div>

                                    {/* Level */}
                                    <div className="col-span-2 text-center">
                                        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300 border border-slate-700">
                                            Lvl {user.level}
                                        </span>
                                    </div>

                                    {/* XP */}
                                    <div className="col-span-2 text-right font-mono font-bold text-slate-300">
                                        {user.xp.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </main>
    );
}
