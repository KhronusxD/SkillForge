"use client";

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, Trophy, Brain, Star, ChevronDown, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans">
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
                        <Link href="/dashboard" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
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
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            AI-Powered Learning Paths v2.0
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                            Master Any Skill <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                                With Absolute Precision
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Stop guessing what to learn next. Generate personalized, AI-driven skill trees, track your progress with gamification, and join a community of elite learners.
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

                        <div className="mt-12 flex items-center justify-center gap-8 text-slate-500 text-sm font-medium">
                            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> No Credit Card Required</span>
                            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free Forever Plan</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to learn faster</h2>
                        <p className="text-slate-400">A complete ecosystem for self-directed education.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Brain className="w-8 h-8 text-purple-400" />}
                            title="AI Skill Trees"
                            description="Generate comprehensive learning paths for any topic instantly. From 'Python' to 'Piano', get a structured roadmap."
                        />
                        <FeatureCard
                            icon={<Trophy className="w-8 h-8 text-yellow-400" />}
                            title="Gamification"
                            description="Earn XP, unlock badges, and maintain streaks. Turn your learning journey into an addictive RPG."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-green-400" />}
                            title="Social Clubs"
                            description="Join communities of like-minded learners. Share resources, compete on leaderboards, and grow together."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How SkillForge Works</h2>
                        <p className="text-slate-400">Three simple steps to mastery.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />

                        <StepCard
                            number="01"
                            title="Choose Your Skill"
                            description="Enter any topic you want to learn. Our AI analyzes millions of resources to build the perfect curriculum."
                        />
                        <StepCard
                            number="02"
                            title="Follow the Path"
                            description="Complete bite-sized nodes, take quizzes, and watch curated tutorials. Track your progress visually."
                        />
                        <StepCard
                            number="03"
                            title="Master & Share"
                            description="Earn your certification badge, showcase your profile, and help others in the community."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Learners</h2>
                        <p className="text-slate-400">Join thousands of students achieving their goals.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="SkillForge completely changed how I learn. The skill trees are incredibly detailed and the gamification keeps me coming back every day."
                            author="Sarah J."
                            role="Frontend Developer"
                            avatar="S"
                            color="bg-pink-500"
                        />
                        <TestimonialCard
                            quote="I used to get lost in tutorials. SkillForge gave me a clear path from beginner to advanced. The AI resources are spot on."
                            author="Michael C."
                            role="Data Scientist"
                            avatar="M"
                            color="bg-blue-500"
                        />
                        <TestimonialCard
                            quote="The community features are amazing. I found a study group for Japanese and we keep each other motivated. Highly recommend!"
                            author="Elena R."
                            role="Language Enthusiast"
                            avatar="E"
                            color="bg-emerald-500"
                        />
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-400">Start for free, upgrade for power.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all">
                            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                            <div className="text-4xl font-bold text-white mb-6">$0 <span className="text-lg text-slate-500 font-normal">/ month</span></div>
                            <p className="text-slate-400 mb-8">Perfect for casual learners.</p>
                            <ul className="space-y-4 mb-8">
                                <PricingFeature text="3 Active Skill Trees" />
                                <PricingFeature text="Basic AI Generation" />
                                <PricingFeature text="Community Access" />
                                <PricingFeature text="Daily Streaks" />
                            </ul>
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                            >
                                Start Free
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-8 bg-gradient-to-b from-blue-900/20 to-slate-900/50 border border-blue-500/30 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Pro Scholar</h3>
                            <div className="text-4xl font-bold text-white mb-6">$12 <span className="text-lg text-slate-500 font-normal">/ month</span></div>
                            <p className="text-slate-400 mb-8">For serious mastery.</p>
                            <ul className="space-y-4 mb-8">
                                <PricingFeature text="Unlimited Skill Trees" highlight />
                                <PricingFeature text="Advanced AI Tutor (GPT-4)" highlight />
                                <PricingFeature text="Custom Quizzes & Projects" highlight />
                                <PricingFeature text="Priority Support" />
                            </ul>
                            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-colors">
                                Get Pro
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-slate-900/30 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        <FaqItem question="Is SkillForge really free?" answer="Yes! Our Starter plan is completely free and gives you access to all core features. We believe education should be accessible to everyone." />
                        <FaqItem question="How does the AI generation work?" answer="We use advanced Large Language Models (LLMs) to analyze your requested topic and break it down into a logical, step-by-step curriculum, complete with resources and quizzes." />
                        <FaqItem question="Can I share my progress?" answer="Absolutely. Your profile showcases your badges, streaks, and completed skills. You can also join Clubs to learn with others." />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">SkillForge</span>
                            </div>
                            <p className="text-slate-400 max-w-sm">
                                Empowering the world to learn anything, faster and better. Join the revolution of self-directed education.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="#" className="hover:text-blue-400">Features</Link></li>
                                <li><Link href="#" className="hover:text-blue-400">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-blue-400">Testimonials</Link></li>
                                <li><Link href="#" className="hover:text-blue-400">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="#" className="hover:text-blue-400">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-blue-400">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2024 SkillForge. All rights reserved.</p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Github className="w-5 h-5" />} />
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} />
                            <SocialIcon icon={<Linkedin className="w-5 h-5" />} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl hover:border-blue-500/30 transition-colors group">
            <div className="mb-6 p-4 bg-slate-900 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="relative z-10 bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl mx-auto mb-6 border border-slate-800">
                {number}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
}

function TestimonialCard({ quote, author, role, avatar, color }: { quote: string; author: string; role: string; avatar: string; color: string }) {
    return (
        <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl">
            <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">"{quote}"</p>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold`}>
                    {avatar}
                </div>
                <div>
                    <div className="font-bold text-white">{author}</div>
                    <div className="text-xs text-slate-500">{role}</div>
                </div>
            </div>
        </div>
    );
}

function PricingFeature({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <li className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlight ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <CheckCircle className="w-3 h-3" />
            </div>
            <span className={highlight ? 'text-white font-medium' : 'text-slate-400'}>{text}</span>
        </li>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-900/50 transition-colors"
            >
                <span className="font-bold text-slate-200">{question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-900 pt-4">
                    {answer}
                </div>
            )}
        </div>
    );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            {icon}
        </a>
    );
}
