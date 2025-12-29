import { Club } from '@/data/clubs';
import { X, Users, MessageSquare, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClubModalProps {
    club: Club | null;
    isOpen: boolean;
    onClose: () => void;
    isJoined: boolean;
    onJoin: (id: string) => void;
    onLeave: (id: string) => void;
}

export default function ClubModal({ club, isOpen, onClose, isJoined, onJoin, onLeave }: ClubModalProps) {
    if (!club) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header Image */}
                        <div className="h-48 relative shrink-0">
                            <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-6 left-6">
                                <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-bold text-white mb-2 inline-block">
                                    {club.category}
                                </span>
                                <h2 className="text-3xl font-bold text-white">{club.name}</h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-center gap-6 text-slate-400 text-sm mb-6 border-b border-slate-800 pb-6">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {club.memberCount.toLocaleString()} Members
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Created 2024
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200 mb-2">About</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {club.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-200 mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {club.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {club.recentActivity && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-200 mb-3">Recent Activity</h3>
                                        <div className="space-y-3">
                                            {club.recentActivity.map((act, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                                        {act.user[0]}
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-bold text-slate-300">{act.user}</span>
                                                        <span className="text-slate-500"> {act.action}</span>
                                                    </div>
                                                    <span className="ml-auto text-xs text-slate-600">{act.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
                            <button
                                onClick={() => isJoined ? onLeave(club.id) : onJoin(club.id)}
                                className={cn(
                                    "w-full py-3 rounded-xl font-bold text-base transition-all",
                                    isJoined
                                        ? "bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                                )}
                            >
                                {isJoined ? 'Leave Club' : 'Join Club'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
