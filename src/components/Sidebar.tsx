"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Zap, Settings, LogOut, Flame, Trophy, BookOpen, PlusCircle, Target, Kanban, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSkillStore } from '@/store/skillStore';
import useSound from 'use-sound';
import { signOut } from 'next-auth/react';

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Skills', path: '/skills', icon: BookOpen },
    { name: 'Create New', path: '/create', icon: PlusCircle },
    { name: 'Focus Mode', path: '/focus', icon: Target },
    { name: 'Kanban', path: '/kanban', icon: Kanban },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Clubs', path: '/clubs', icon: Users }, // Added Clubs
    { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { userProfile, streak, checkStreak, checkBadges, soundEnabled } = useSkillStore();
    const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });

    useEffect(() => {
        checkStreak();
        checkBadges();
    }, [checkStreak, checkBadges]);

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center font-bold text-white">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent hidden md:block">
                    SkillForge
                </span>
            </div>

            {/* Streak Display */}
            <div className="px-6 mb-2 hidden md:block">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                        <Flame className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div>
                        <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">Daily Streak</div>
                        <div className="text-lg font-bold text-white">{streak} Days</div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => soundEnabled && playClick()}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100")} />
                            <span className="font-medium hidden md:block">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Link href="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                        {userProfile?.name?.[0] || 'S'}
                    </div>
                    <div className="flex-1 min-w-0 hidden md:block">
                        <p className="text-sm font-bold text-slate-200 truncate">{userProfile?.name || 'SkillForger'}</p>
                        <p className="text-xs text-slate-500 truncate capitalize">{userProfile?.avatar || 'Warrior'}</p>
                    </div>
                    <Settings className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors hidden md:block" />
                </Link>
            </div>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
