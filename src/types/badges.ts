import { LucideIcon, Zap, Flame, Target, BookOpen, Trophy, Clock } from 'lucide-react';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string; // Tailwind class for text color
    bgColor: string; // Tailwind class for background
    condition: (stats: { totalXp: number; streak: number; skillsCount: number }) => boolean;
}

export const BADGES: Badge[] = [
    {
        id: 'novice',
        name: 'Novice Forger',
        description: 'Earn your first 100 XP',
        icon: Zap,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        condition: (stats) => stats.totalXp >= 100
    },
    {
        id: 'apprentice',
        name: 'Apprentice',
        description: 'Reach 1,000 XP',
        icon: BookOpen,
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        condition: (stats) => stats.totalXp >= 1000
    },
    {
        id: 'expert',
        name: 'Skill Master',
        description: 'Reach 10,000 XP',
        icon: Trophy,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        condition: (stats) => stats.totalXp >= 10000
    },
    {
        id: 'streak_3',
        name: 'Heating Up',
        description: 'Maintain a 3-day streak',
        icon: Flame,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        condition: (stats) => stats.streak >= 3
    },
    {
        id: 'streak_7',
        name: 'On Fire',
        description: 'Maintain a 7-day streak',
        icon: Flame,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        condition: (stats) => stats.streak >= 7
    },
    {
        id: 'polymath',
        name: 'Polymath',
        description: 'Start 3 different skills',
        icon: Target,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        condition: (stats) => stats.skillsCount >= 3
    }
];
