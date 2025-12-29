import { Club } from '@/data/clubs';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClubCardProps {
    club: Club;
    isJoined: boolean;
    onJoin: (id: string) => void;
    onLeave: (id: string) => void;
    onClick: (club: Club) => void;
}

export default function ClubCard({ club, isJoined, onJoin, onLeave, onClick }: ClubCardProps) {
    return (
        <div
            onClick={() => onClick(club)}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-500/10"
        >
            {/* Image Header */}
            <div className="h-32 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 z-20">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-slate-300 border border-white/10">
                        {club.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">{club.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                    <Users className="w-3 h-3" />
                    <span>{club.memberCount.toLocaleString()} members</span>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                    {club.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {club.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 bg-slate-800 rounded-full text-slate-400">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Action Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        isJoined ? onLeave(club.id) : onJoin(club.id);
                    }}
                    className={cn(
                        "w-full py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                        isJoined
                            ? "bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                    )}
                >
                    {isJoined ? (
                        <>
                            <UserMinus className="w-4 h-4" />
                            Leave Club
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-4 h-4" />
                            Join Club
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
