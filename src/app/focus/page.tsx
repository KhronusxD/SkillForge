"use client";

import { useState, useEffect, useRef } from 'react';
import { useSkillStore } from '@/store/skillStore';
import { Play, Pause, RotateCcw, ArrowLeft, Building2, Trophy } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// CSS 3D City Component
const CityMap = ({ buildings }: { buildings: number[] }) => {
    return (
        <div className="w-full h-[400px] relative perspective-[1000px] overflow-hidden bg-slate-900/50 rounded-3xl border border-slate-800">
            <div className="absolute inset-0 flex items-center justify-center transform-style-3d rotate-x-[60deg] rotate-z-[45deg] scale-75">
                <div className="grid grid-cols-6 gap-4 p-10 bg-slate-800/50 rounded-xl shadow-2xl transform-style-3d">
                    {/* Grid Plots */}
                    {Array.from({ length: 36 }).map((_, i) => {
                        const height = buildings[i] || 0;
                        return (
                            <div key={i} className="w-12 h-12 bg-slate-700/30 rounded-sm relative transform-style-3d transition-all duration-1000">
                                {height > 0 && (
                                    <div
                                        className="absolute bottom-0 left-0 w-full bg-blue-500 shadow-lg transition-all duration-1000"
                                        style={{
                                            height: `${height * 10}px`,
                                            transform: `translateZ(${height * 5}px)`,
                                            backgroundColor: `hsl(${210 + (height * 10)}, 70%, 60%)`
                                        }}
                                    >
                                        {/* Roof */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-full bg-blue-400 origin-top transform rotate-x-90"
                                            style={{ backgroundColor: `hsl(${210 + (height * 10)}, 70%, 70%)` }}
                                        />
                                        {/* Side */}
                                        <div
                                            className="absolute top-0 right-0 w-full h-[100%] bg-blue-600 origin-right transform rotate-y-90"
                                            style={{ backgroundColor: `hsl(${210 + (height * 10)}, 70%, 50%)` }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>{buildings.filter(h => h > 0).length} Buildings Constructed</span>
                </div>
            </div>
        </div>
    );
};

export default function FocusPage() {
    const { skills } = useSkillStore();
    const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.skillName || '');
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);

    // Mock buildings state (in real app, persist this)
    const [buildings, setBuildings] = useState<number[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            handleSessionComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleSessionComplete = () => {
        setSessionCount(prev => prev + 1);
        // Add a new building or grow an existing one
        setBuildings(prev => {
            const newBuildings = [...prev];
            // Find first empty slot or grow random
            const emptyIndex = newBuildings.findIndex(h => !h);
            if (emptyIndex !== -1) {
                newBuildings[emptyIndex] = 1; // Start height
            } else {
                // Grow random building
                const rand = Math.floor(Math.random() * newBuildings.length);
                newBuildings[rand] = (newBuildings[rand] || 0) + 1;
            }
            return newBuildings;
        });

        // Play sound?
        alert("Session Complete! A new structure has been added to your city.");
        setTimeLeft(25 * 60);
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <main className="min-h-screen w-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col">

            <header className="max-w-4xl mx-auto w-full mb-8 flex items-center justify-between">
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-slate-200">Focus Mode</h1>
            </header>

            <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Timer Control */}
                <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center">

                    <div className="mb-8 w-full">
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">Select Skill to Practice</label>
                        <select
                            value={selectedSkillId}
                            onChange={(e) => setSelectedSkillId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="" disabled>Select a skill...</option>
                            {skills.map(s => (
                                <option key={s.skillName} value={s.skillName}>{s.skillName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-8xl font-mono font-bold text-slate-100 mb-8 tracking-tighter tabular-nums">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={toggleTimer}
                            className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95",
                                isActive ? "bg-amber-500 hover:bg-amber-400 text-slate-900" : "bg-blue-600 hover:bg-blue-500 text-white"
                            )}
                        >
                            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </button>

                        <button
                            onClick={resetTimer}
                            className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-8 text-slate-500 text-sm">
                        {sessionCount} sessions completed today
                    </div>
                </div>

                {/* City Visualization */}
                <div className="flex flex-col gap-4">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-bold text-slate-300 mb-2 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Your Skill City
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Every focus session builds a new structure. Keep focusing to grow your metropolis!
                        </p>
                        <CityMap buildings={buildings} />
                    </div>
                </div>

            </div>
        </main>
    );
}
