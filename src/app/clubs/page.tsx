"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { MOCK_CLUBS, Club } from '@/data/clubs';
import { useSkillStore } from '@/store/skillStore';
import ClubCard from '@/components/ClubCard';
import ClubModal from '@/components/ClubModal';

export default function ClubsPage() {
    const { joinedClubs, joinClub, leaveClub } = useSkillStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);

    const categories = ['All', 'Coding', 'Art', 'Writing', 'Music', 'Language'];

    const filteredClubs = MOCK_CLUBS.filter(club => {
        const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const myClubs = MOCK_CLUBS.filter(club => joinedClubs.includes(club.id));

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pb-32">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Users className="w-10 h-10 text-blue-500" />
                            Social Clubs
                        </h1>
                        <p className="text-slate-400">Find your tribe. Learn together.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search clubs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* My Clubs Section */}
                {myClubs.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">My Clubs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myClubs.map(club => (
                                <ClubCard
                                    key={club.id}
                                    club={club}
                                    isJoined={true}
                                    onJoin={joinClub}
                                    onLeave={leaveClub}
                                    onClick={setSelectedClub}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* All Clubs Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Explore Communities</h2>
                    {filteredClubs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClubs.map(club => (
                                <ClubCard
                                    key={club.id}
                                    club={club}
                                    isJoined={joinedClubs.includes(club.id)}
                                    onJoin={joinClub}
                                    onLeave={leaveClub}
                                    onClick={setSelectedClub}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-500">No clubs found matching your criteria.</p>
                        </div>
                    )}
                </motion.section>

                <ClubModal
                    club={selectedClub}
                    isOpen={!!selectedClub}
                    onClose={() => setSelectedClub(null)}
                    isJoined={selectedClub ? joinedClubs.includes(selectedClub.id) : false}
                    onJoin={joinClub}
                    onLeave={leaveClub}
                />
            </div>
        </div>
    );
}
