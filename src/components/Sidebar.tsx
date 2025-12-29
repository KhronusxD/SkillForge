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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Skills', path: '/skills', icon: BookOpen },
    { name: 'Create New', path: '/create', icon: PlusCircle },
    { name: 'Focus Mode', path: '/focus', icon: Target },
    { name: 'Kanban', path: '/kanban', icon: Kanban },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Clubs', path: '/clubs', icon: Users }, // Added Clubs
    { name: 'Settings', path: '/settings', icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
}

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onCloseMobile }: SidebarProps) {
    const pathname = usePathname();
    const { userProfile, streak, checkStreak, checkBadges, soundEnabled } = useSkillStore();
    const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });

    useEffect(() => {
        checkStreak();
        checkBadges();
    }, [checkStreak, checkBadges]);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onCloseMobile}
            />

            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-all duration-300",
                    isCollapsed ? "w-20" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className={cn("p-6 flex items-center gap-3", isCollapsed && "justify-center px-2")}>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
                            SkillForge
                        </span>
                    )}
                </div>

                {/* Streak Display */}
                {!isCollapsed && (
                    <div className="px-6 mb-2">
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
                )}

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => {
                                    if (soundEnabled) playClick();
                                    onCloseMobile();
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group whitespace-nowrap",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100")} />
                                {!isCollapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    {/* Profile */}
                    <Link
                        href="/profile"
                        onClick={onCloseMobile}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors group",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform shrink-0">
                            {userProfile?.name?.[0] || 'S'}
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-200 truncate">{userProfile?.name || 'SkillForger'}</p>
                                    <p className="text-xs text-slate-500 truncate capitalize">{userProfile?.avatar || 'Warrior'}</p>
                                </div>
                                <Settings className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                            </>
                        )}
                    </Link>

                    {/* Sign Out */}
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group whitespace-nowrap",
                            isCollapsed && "justify-center px-2"
                        )}
                        title={isCollapsed ? "Sign Out" : undefined}
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
                        {!isCollapsed && <span className="font-medium">Sign Out</span>}
                    </button>

                    {/* Collapse Toggle (Desktop Only) */}
                    <button
                        onClick={onToggleCollapse}
                        className="hidden md:flex w-full items-center justify-center p-2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <div className={cn("w-1 h-4 bg-slate-700 rounded-full transition-all", isCollapsed ? "h-4" : "h-1 w-12")} />
                    </button>
                </div>
            </aside>
        </>
    );
}
