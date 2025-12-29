"use client";

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, Trophy, Brain } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            SkillForge
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Demo Dashboard
                        </Link>
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="px-5 py-2 bg-white text-slate-950 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            AI-Powered Learning Paths
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
                            Master Any Skill <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                With Precision
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Generate personalized skill trees, track your progress with gamification, and join communities of learners. The future of self-education is here.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all hover:scale-105 shadow-xl shadow-blue-600/20 flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all hover:text-white"
                            >
                                View Demo
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Brain className="w-8 h-8 text-purple-400" />}
                            title="AI Skill Trees"
                            description="Generate comprehensive learning paths for any topic instantly. From 'Python' to 'Piano'."
                        />
                        <FeatureCard
                            icon={<Trophy className="w-8 h-8 text-yellow-400" />}
                            title="Gamification"
                            description="Earn XP, unlock badges, and maintain streaks. Learning has never been this addictive."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-green-400" />}
                            title="Social Clubs"
                            description="Join communities of like-minded learners. Share resources and compete on leaderboards."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl hover:border-blue-500/30 transition-colors">
            <div className="mb-6 p-4 bg-slate-900 rounded-2xl w-fit">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
