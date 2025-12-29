"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import { useSkillStore } from '@/store/skillStore';

interface LevelUpModalProps {
    isOpen: boolean;
    level: number;
    onClose: () => void;
}

export default function LevelUpModal({ isOpen, level, onClose }: LevelUpModalProps) {
    const { soundEnabled } = useSkillStore();
    const [playLevelUp] = useSound('/sounds/levelup.mp3', { volume: 0.6 });

    useEffect(() => {
        if (isOpen) {
            if (soundEnabled) playLevelUp();
            // Trigger confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#60a5fa', '#a78bfa', '#fbbf24']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#60a5fa', '#a78bfa', '#fbbf24']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: 100 }}
                        className="bg-slate-900 border border-yellow-500/50 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)]"
                    >
                        {/* Background Rays */}
                        <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-10 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(234,179,8,0.5)_20deg,transparent_40deg,rgba(234,179,8,0.5)_60deg,transparent_80deg,rgba(234,179,8,0.5)_100deg,transparent_120deg,rgba(234,179,8,0.5)_140deg,transparent_160deg,rgba(234,179,8,0.5)_180deg,transparent_200deg,rgba(234,179,8,0.5)_220deg,transparent_240deg,rgba(234,179,8,0.5)_260deg,transparent_280deg,rgba(234,179,8,0.5)_300deg,transparent_320deg,rgba(234,179,8,0.5)_340deg,transparent_360deg)]" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                                className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
                            >
                                <Trophy className="w-12 h-12 text-white" />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold text-yellow-400 mb-2"
                            >
                                LEVEL UP!
                            </motion.h2>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-6xl font-black text-white mb-6 drop-shadow-lg"
                            >
                                {level}
                            </motion.div>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-slate-300 mb-8"
                            >
                                You&apos;ve reached Level {level}!estone. Keep forging your path to mastery!
                            </motion.p>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                onClick={onClose}
                                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95"
                            >
                                Continue Journey
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
