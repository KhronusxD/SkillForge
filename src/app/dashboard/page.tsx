"use client";

import { motion } from 'framer-motion';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSkillStore } from '@/store/skillStore';
import { Loader2, Sparkles, Plus, Trophy, Zap, Target, Brain, Heart, Briefcase, Palette } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CharacterDisplay from '@/components/CharacterDisplay';
import LevelUpModal from '@/components/LevelUpModal';
import SkillRadarChart from '@/components/SkillRadarChart';

export default function Dashboard() {

  const router = useRouter();
  const { skills, isLoading, getTotalXp, version, lastLevelSeen, setLastLevelSeen } = useSkillStore();

  // Calculate Global Stats
  const [earnedXp, setEarnedXp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const earned = getTotalXp();
    setEarnedXp(earned);

    const currentLevel = Math.floor(earned / 1000) + 1;

    // Check for level up
    if (currentLevel > lastLevelSeen) {
      setShowLevelUp(true);
      setLastLevelSeen(currentLevel);
    }
  }, [skills, getTotalXp, version, lastLevelSeen, setLastLevelSeen]);

  // Level 1 starts at 0 XP. Level 2 at 1000 XP.
  const globalLevel = Math.floor(earnedXp / 1000) + 1;
  const progress = ((earnedXp % 1000) / 1000) * 100;

  // Calculate Category Stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number, earned: number }> = {};

    skills.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!stats[cat]) stats[cat] = { total: 0, earned: 0 };

      // Calculate earned for this skill
      let skillEarned = 0;
      const countXp = (branches: any[]) => {
        branches.forEach(branch => {
          if (branch.status === 'completed') skillEarned += branch.xpReward;
          if (branch.branches) countXp(branch.branches);
        });
      };
      countXp(skill.branches);

      stats[cat].total += skill.totalXp;
      stats[cat].earned += skillEarned;
    });

    return Object.entries(stats).map(([name, data]) => ({
      name,
      ...data,
      percent: data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0
    }));
  }, [skills, version]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 } as any
    }
  };

  return (
    <main className="min-h-screen w-screen bg-slate-950 text-slate-100 p-6 md:p-12 overflow-y-auto">
      <LevelUpModal
        isOpen={showLevelUp}
        level={globalLevel}
        onClose={() => setShowLevelUp(false)}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header & Stats */}
        <motion.header variants={itemVariants} className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              SkillForge
            </h1>
            <p className="text-slate-400 mt-2">Master your destiny, one node at a time.</p>
          </div>

          <div className="flex gap-4">
            <Link href="/create" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:scale-105">
              <Plus className="w-5 h-5" />
              New Skill
            </Link>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* Left Column: Character & Global Level */}
          <motion.div variants={itemVariants} className="space-y-6">
            <CharacterDisplay level={globalLevel} />

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Current Level</div>
                  <div className="text-2xl font-bold text-slate-100">Level {globalLevel}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{earnedXp.toLocaleString()} XP</span>
                  <span>{(globalLevel * 1000).toLocaleString()} XP</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Middle & Right: Macro Areas & Recent Skills */}
          <div className="lg:col-span-2 space-y-8">

            {/* Macro Areas */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300">
                <Target className="w-5 h-5 text-blue-500" />
                Macro Areas
              </h2>

              {categoryStats.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
                  No data yet. Start a skill to see your breakdown!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <SkillRadarChart data={categoryStats} />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {categoryStats.map((stat) => (
                      <div key={stat.name} className="bg-slate-900/50 border border-slate-800 p-2 rounded-lg flex items-center justify-between text-xs">
                        <span className="text-slate-400">{stat.name}</span>
                        <span className="font-bold text-blue-400">{stat.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>

            {/* Skills Grid */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300">
                <Zap className="w-5 h-5 text-yellow-500" />
                Active Skills
              </h2>

              {skills.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">
                  <h3 className="text-xl font-bold text-slate-500">No skills yet</h3>
                  <p className="text-slate-600 mb-4">Start your journey by forging a new skill.</p>
                  <Link href="/create" className="text-blue-400 hover:text-blue-300 font-bold">
                    Create First Skill &rarr;
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill, idx) => (
                    <Link
                      key={idx}
                      href={`/skill/${encodeURIComponent(skill.skillName)}`}
                      className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-wider">
                          {skill.category || 'Other'}
                        </span>
                        <span className="text-xs font-bold text-blue-400">
                          {skill.totalXp.toLocaleString()} XP
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">
                        {skill.skillName}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {skill.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
