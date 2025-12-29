import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Lock, CheckCircle, Star } from 'lucide-react';

const SkillNode = ({ data, selected }: NodeProps) => {
    const isLocked = data.status === 'locked';
    const isCompleted = data.status === 'completed';
    const isAvailable = data.status === 'available';

    return (
        <div
            className={cn(
                "px-4 py-3 rounded-xl shadow-lg border-2 w-[250px] transition-all duration-300",
                "bg-slate-800 border-slate-700", // Default
                isLocked && "opacity-70 grayscale",
                isCompleted && "border-emerald-500 shadow-emerald-500/20",
                isAvailable && "border-blue-500 shadow-blue-500/20",
                selected && "ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-400 scale-105"
            )}
        >
            <Handle type="target" position={Position.Top} className="!bg-slate-500" />

            <div className="flex items-center justify-between mb-2">
                <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    isLocked ? "bg-slate-700 text-slate-400" : "bg-blue-900/50 text-blue-300"
                )}>
                    {data.level || 'Skill'}
                </span>
                {isLocked && <Lock className="w-4 h-4 text-slate-500" />}
                {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {isAvailable && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />}
            </div>

            <div className="font-bold text-slate-100 text-lg leading-tight mb-1">
                {data.label}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1">
                <span>{data.xp} XP</span>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-slate-500" />
        </div>
    );
};

export default memo(SkillNode);
