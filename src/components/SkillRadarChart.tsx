"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface SkillRadarChartProps {
    data: {
        name: string;
        total: number;
        earned: number;
        percent: number;
    }[];
}

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
    // Transform data for the chart if needed, or use directly
    // We want to show the 'percent' as the value

    // If no data, show a placeholder or empty chart
    const chartData = data.length > 0 ? data : [
        { name: 'Tech', percent: 0 },
        { name: 'Soft', percent: 0 },
        { name: 'Creative', percent: 0 },
        { name: 'Health', percent: 0 },
        { name: 'Biz', percent: 0 },
    ];

    return (
        <div className="w-full h-[300px] bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Skill Level"
                        dataKey="percent"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="#3b82f6"
                        fillOpacity={0.3}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                        itemStyle={{ color: '#60a5fa' }}
                        formatter={(value: number | undefined) => [`${value || 0}%`, 'Progress']}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
