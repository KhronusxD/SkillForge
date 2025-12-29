"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CharacterDisplayProps {
    level: number;
}

export default function CharacterDisplay({ level }: CharacterDisplayProps) {
    // Determine character stage based on level
    const getStage = (lvl: number) => {
        if (lvl >= 20) return 'master';
        if (lvl >= 10) return 'warrior';
        if (lvl >= 5) return 'apprentice';
        return 'novice';
    };

    const stage = getStage(level);

    // Pixel Art placeholders (CSS-based for now, can be replaced with images)
    const renderCharacter = () => {
        switch (stage) {
            case 'master':
                return (
                    <div className="relative w-32 h-32">
                        {/* Crown */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-400 animate-pulse" style={{ clipPath: 'polygon(0% 100%, 20% 0%, 40% 100%, 60% 0%, 80% 100%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                        {/* Body */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-violet-600 rounded-t-xl border-4 border-yellow-500 shadow-[0_0_30px_rgba(167,139,250,0.6)]"></div>
                        {/* Eyes */}
                        <div className="absolute top-12 left-10 w-4 h-4 bg-white animate-bounce"></div>
                        <div className="absolute top-12 right-10 w-4 h-4 bg-white animate-bounce"></div>
                    </div>
                );
            case 'warrior':
                return (
                    <div className="relative w-32 h-32">
                        {/* Helmet */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-10 bg-slate-400 rounded-t-lg"></div>
                        {/* Body */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-700 rounded-t-lg border-4 border-slate-500"></div>
                        {/* Sword */}
                        <div className="absolute right-0 bottom-4 w-4 h-24 bg-slate-300 rotate-45 border-2 border-slate-600 origin-bottom"></div>
                    </div>
                );
            case 'apprentice':
                return (
                    <div className="relative w-32 h-32">
                        {/* Hat */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-blue-500"></div>
                        {/* Body */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-900 rounded-t-lg"></div>
                        {/* Wand */}
                        <div className="absolute right-2 bottom-8 w-2 h-16 bg-amber-700 rotate-12"></div>
                    </div>
                );
            default: // Novice
                return (
                    <div className="relative w-32 h-32 grayscale opacity-80">
                        {/* Head */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-200 rounded-sm"></div>
                        {/* Body */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-800 rounded-t-sm"></div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-3xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,transparent)]" />

            <div className="relative z-10 scale-150 mb-6 transition-transform group-hover:scale-[1.6]">
                {renderCharacter()}
            </div>

            <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-slate-100 uppercase tracking-widest font-mono">
                    {stage}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Lvl {level}</p>
            </div>
        </div>
    );
}
