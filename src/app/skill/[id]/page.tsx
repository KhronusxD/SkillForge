"use client";

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSkillStore } from '@/store/skillStore';
import { transformSkillTreeToGraph } from '@/lib/layout';
import SkillNode from '@/components/SkillNode';
import NodeDetailsPanel from '@/components/NodeDetailsPanel';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ShareMenu from '@/components/ShareMenu';
import useSound from 'use-sound';

const nodeTypes: NodeTypes = {
    skillNode: SkillNode,
};

export default function SkillView() {
    const params = useParams();
    const router = useRouter();
    const { skills, version, completeNode, soundEnabled } = useSkillStore();
    const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });

    const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
    const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);

    // Find the skill based on the URL param (assuming ID = skillName for now)
    const skillId = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';

    const skill = useMemo(() =>
        skills.find(s => s.skillName === skillId),
        [skills, skillId, version]); // Re-compute if version changes

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // Helper to find node recursively
    const findNodeWithDepth = useCallback((branches: any[], id: string, currentDepth: number = 1): { node: any, depth: number } | null => {
        for (const branch of branches) {
            if (branch.id === id) return { node: branch, depth: currentDepth };
            if (branch.branches) {
                const found = findNodeWithDepth(branch.branches, id, currentDepth + 1);
                if (found) return found;
            }
        }
        return null;
    }, []);

    const selectedNodeData = useMemo(() => {
        if (!skill || !selectedNodeId) return null;
        return findNodeWithDepth(skill.branches, selectedNodeId);
    }, [skill, selectedNodeId, findNodeWithDepth]);

    const onNodeClick = useCallback((_: any, node: any) => {
        setSelectedNodeId(node.id);
    }, []);

    const handleCompleteNode = useCallback((nodeId: string) => {
        if (skill) {
            completeNode(skill.skillName, nodeId);
            if (soundEnabled) playSuccess();
        }
    }, [skill, completeNode, soundEnabled, playSuccess]);

    useEffect(() => {
        if (skill) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = transformSkillTreeToGraph(skill);
            setRfNodes(layoutedNodes);
            setRfEdges(layoutedEdges);
        }
    }, [skill, setRfNodes, setRfEdges, version]); // Force update on version change

    if (!skill) {
        return (
            <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Skill Not Found</h1>
                    <Link href="/" className="text-blue-500 hover:underline">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="h-screen w-screen bg-slate-950 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start pointer-events-none">
                <Link
                    href="/"
                    className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all pointer-events-auto flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold">Dashboard</span>
                </Link>

                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-xl border border-slate-800 shadow-lg">
                        <h1 className="text-xl font-bold text-slate-100">{skill.skillName}</h1>
                        <div className="text-xs text-slate-400 text-center">{skill.totalXp} XP Total</div>
                    </div>
                    <ShareMenu skill={skill} />
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 w-full h-full">
                <ReactFlow
                    nodes={rfNodes}
                    edges={rfEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-slate-950"
                    minZoom={0.1}
                    maxZoom={2}
                >
                    <Background color="#334155" gap={20} size={1} />
                    <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-400" />
                    <MiniMap
                        className="!bg-slate-900 !border-slate-800"
                        nodeColor="#3b82f6"
                        maskColor="rgba(15, 23, 42, 0.8)"
                    />
                </ReactFlow>
            </div>

            {/* Details Panel */}
            <NodeDetailsPanel
                skillName={skill.skillName}
                node={selectedNodeData?.node || null}
                depth={selectedNodeData?.depth || 0}
                isOpen={!!selectedNodeData}
                onClose={() => setSelectedNodeId(null)}
                onComplete={handleCompleteNode}
            />
        </main>
    );
}
