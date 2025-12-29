import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Lock, Star, BookOpen, Youtube, MessageSquare, HelpCircle, PenTool } from 'lucide-react';
import { useSkillStore } from '@/store/skillStore';
import { cn } from '@/lib/utils';
import { Branch } from '@/types/schema';

interface NodeDetailsPanelProps {
    skillName: string;
    node: Branch | null;
    depth: number;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (nodeId: string) => void;
}

type Tab = 'overview' | 'resources' | 'tutor' | 'quiz' | 'notes' | 'generate';

export default function NodeDetailsPanel({ skillName, node, depth, isOpen, onClose, onComplete }: NodeDetailsPanelProps) {
    const { skills, completeNode, updateNodeNotes, updateNodeData } = useSkillStore(); // Added updateNodeNotes
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isGenerating, setIsGenerating] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!chatInput.trim() || !node) return;

        const userMsg = { role: 'user' as const, content: chatInput };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const res = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    nodeContext: {
                        name: node.name,
                        description: node.description,
                        objectives: node.objectives
                    }
                }),
            });

            const data = await res.json();
            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsChatLoading(false);
        }
    };

    // Quiz State
    const [quizData, setQuizData] = useState<any>(null);
    const [isQuizLoading, setIsQuizLoading] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

    const handleGenerateQuiz = async () => {
        if (!node) return;
        setIsQuizLoading(true);
        try {
            const res = await fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nodeContext: {
                        name: node.name,
                        description: node.description
                    }
                }),
            });
            const data = await res.json();
            setQuizData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsQuizLoading(false);
        }
    };

    const handleQuizAnswer = (qIdx: number, aIdx: number) => {
        if (quizAnswers[qIdx] !== undefined) return; // Prevent changing answer
        setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
    };

    // Notes State
    const [notes, setNotes] = useState(node?.notes || '');


    const handleNotesChange = (value: string) => {
        setNotes(value);
        if (node) {
            updateNodeNotes(skillName, node.id, value);
        }
    };

    const handleGenerateSubTasks = async () => {
        if (!node) return;
        setIsGenerating(true);
        try {
            const res = await fetch('/api/generate-skill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skill: skillName,
                    level: 2,
                    nodeContext: {
                        name: node.name,
                        description: node.description
                    }
                }),
            });
            const data = await res.json();
            if (data.branches) {
                updateNodeData(skillName, node.id, { branches: data.branches });
                // Maybe switch tab or show success?
            }
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateContent = async (type: 'resources' | 'quiz' | 'tutorial') => {
        if (!node) return;
        setIsGenerating(true);
        try {
            const res = await fetch('/api/generate-skill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skill: skillName,
                    level: 3,
                    generationType: type,
                    nodeContext: {
                        name: node.name,
                        description: node.description
                    }
                }),
            });
            const data = await res.json();

            if (type === 'resources' && data.resources) {
                updateNodeData(skillName, node.id, { resources: data.resources });
                setActiveTab('resources');
            } else if (type === 'quiz' && data.quiz) {
                updateNodeData(skillName, node.id, { quiz: data.quiz });
                setActiveTab('quiz');
            } else if (type === 'tutorial' && data.tutorial) {
                // Append tutorial to description or notes? Or a new field?
                // For now, let's append to description as a "Mini-Guide"
                const newDesc = (node.description || '') + "\n\n## Tutorial\n" + data.tutorial;
                updateNodeData(skillName, node.id, { description: newDesc });
                setActiveTab('overview');
            }
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Update local notes if node changes
    useEffect(() => {
        if (node) setNotes(node.notes || '');
    }, [node]);

    if (!node) return null;

    const isLocked = node.status === 'locked';
    const isCompleted = node.status === 'completed';

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'resources', label: 'Resources', icon: Youtube },
        { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
        { id: 'quiz', label: 'Quiz', icon: HelpCircle },
        { id: 'notes', label: 'Notes', icon: PenTool },
    ];



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-slate-900 border-l border-slate-800 z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50 backdrop-blur-md">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-1 rounded uppercase tracking-wider",
                                        isLocked ? "bg-slate-800 text-slate-500" :
                                            isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                                    )}>
                                        {node.status}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">XP: {node.xpReward}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100">{node.name}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-800 overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-400 bg-blue-500/5"
                                            : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">

                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="prose prose-invert max-w-none">
                                        <h3 className="text-lg font-bold text-slate-200 mb-2">Description</h3>
                                        <p className="text-slate-400 leading-relaxed">{node.description}</p>
                                    </div>

                                    {node.objectives && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-3">Objectives</h3>
                                            <ul className="space-y-2">
                                                {node.objectives.map((obj, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-slate-400 bg-slate-800/50 p-3 rounded-xl">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                        <span className="text-sm">{obj}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Generation Actions */}
                                    <div className="mt-8 space-y-4">
                                        <h4 className="text-lg font-bold text-slate-200 border-t border-slate-800 pt-4">Actions</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Generate Sub-tasks (Only for nodes without children) */}
                                            {(!node.branches || node.branches.length === 0) && (
                                                <button
                                                    onClick={handleGenerateSubTasks}
                                                    disabled={isGenerating}
                                                    className="p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 rounded-xl text-left flex items-center gap-3 transition-all group"
                                                >
                                                    <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                                        <Star className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-blue-400">Generate Sub-tasks</h4>
                                                        <p className="text-xs text-slate-500">Expand this into detailed steps</p>
                                                    </div>
                                                </button>
                                            )}

                                            {/* Generate Content */}
                                            <button
                                                onClick={() => handleGenerateContent('resources')}
                                                disabled={isGenerating}
                                                className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left flex items-center gap-3 transition-all group"
                                            >
                                                <div className="p-2 bg-slate-900 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                                                    <Youtube className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-200">Generate Resources</h4>
                                                    <p className="text-xs text-slate-500">Find videos and articles</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleGenerateContent('quiz')}
                                                disabled={isGenerating}
                                                className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left flex items-center gap-3 transition-all group"
                                            >
                                                <div className="p-2 bg-slate-900 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                                                    <HelpCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-200">Generate Quiz</h4>
                                                    <p className="text-xs text-slate-500">Create a knowledge check</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleGenerateContent('tutorial')}
                                                disabled={isGenerating}
                                                className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left flex items-center gap-3 transition-all group"
                                            >
                                                <div className="p-2 bg-slate-900 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-200">Generate Tutorial</h4>
                                                    <p className="text-xs text-slate-500">Write a step-by-step guide</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'resources' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-200">Learning Resources</h3>
                                    {node.resources && node.resources.length > 0 ? (
                                        <div className="grid gap-3">
                                            {node.resources.map((res, idx) => {
                                                const linkUrl = res.url
                                                    ? res.url
                                                    : (res.type === 'video'
                                                        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(res.searchQuery || res.title)}`
                                                        : `https://www.google.com/search?q=${encodeURIComponent(res.searchQuery || res.title)}`);

                                                return (
                                                    <a
                                                        key={idx}
                                                        href={linkUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all group"
                                                    >
                                                        <div className="p-3 bg-slate-900 rounded-lg text-slate-400 group-hover:text-blue-400 transition-colors">
                                                            {res.type === 'video' ? <Youtube className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{res.title}</h4>
                                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                                {res.url ? (
                                                                    <span className="text-emerald-400 flex items-center gap-1">
                                                                        Direct Link
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-blue-400 flex items-center gap-1">
                                                                        {res.type === 'video' ? 'Find on YouTube' : 'Find on Google'}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                                            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                            <p className="text-slate-500">No resources available for this node.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'tutor' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                                        {messages.length === 0 && (
                                            <div className="text-center text-slate-500 mt-8">
                                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>Ask me anything about <strong>{node.name}</strong>!</p>
                                            </div>
                                        )}
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                                {msg.role === 'assistant' && (
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                                        <MessageSquare className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                                <div className={cn(
                                                    "p-3 rounded-2xl max-w-[80%] text-sm",
                                                    msg.role === 'user'
                                                        ? "bg-blue-600 text-white rounded-tr-none"
                                                        : "bg-slate-800 text-slate-200 rounded-tl-none"
                                                )}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isChatLoading && (
                                            <div className="flex gap-3 justify-start">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                                    <MessageSquare className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Ask a question..."
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={isChatLoading || !chatInput.trim()}
                                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'quiz' && (
                                <div className="space-y-6">
                                    {!quizData ? (
                                        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                                            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-slate-200 mb-2">Test Your Knowledge</h3>
                                            <p className="text-slate-500 mb-6">Take a quick quiz to verify your understanding.</p>
                                            <button
                                                onClick={handleGenerateQuiz}
                                                disabled={isQuizLoading}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                                            >
                                                {isQuizLoading ? 'Generating...' : 'Start Quiz'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {quizData.questions.map((q: { question: string; options: string[]; correctIndex: number }, qIdx: number) => (
                                                <div key={qIdx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                                                    <h4 className="font-bold text-lg text-slate-200 mb-4">{qIdx + 1}. {q.question}</h4>
                                                    <div className="space-y-2">
                                                        {q.options.map((opt: string, oIdx: number) => (
                                                            <button
                                                                key={oIdx}
                                                                onClick={() => handleQuizAnswer(qIdx, oIdx)}
                                                                className={cn(
                                                                    "w-full text-left p-4 rounded-xl border transition-all",
                                                                    quizAnswers[qIdx] === oIdx
                                                                        ? (oIdx === q.correctIndex ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-red-500/20 border-red-500 text-red-300")
                                                                        : "bg-slate-900 border-slate-700 hover:border-blue-500/50 text-slate-400"
                                                                )}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            {Object.keys(quizAnswers).length === quizData.questions.length && (
                                                <div className="p-4 bg-slate-800 rounded-xl text-center animate-in fade-in slide-in-from-bottom-4">
                                                    <p className="text-slate-400 mb-2">Quiz Completed!</p>
                                                    <p className="text-2xl font-bold text-white">
                                                        Score: {Object.keys(quizAnswers).filter(k => quizAnswers[Number(k)] === quizData.questions[Number(k)].correctIndex).length} / {quizData.questions.length}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div className="h-full flex flex-col">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-4 flex items-start gap-3">
                                        <PenTool className="w-5 h-5 text-yellow-500 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-yellow-500 text-sm">Personal Notes</h4>
                                            <p className="text-yellow-500/80 text-xs">Notes are saved automatically to your browser.</p>
                                        </div>
                                    </div>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => handleNotesChange(e.target.value)}
                                        placeholder="Write your learnings here..."
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none font-mono text-sm leading-relaxed"
                                    />
                                </div>

                            )}

                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
                            {isCompleted ? (
                                <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-2 text-emerald-400 font-bold">
                                    <CheckCircle className="w-5 h-5" />
                                    Completed
                                </div>
                            ) : isLocked ? (
                                <div className="w-full py-4 bg-slate-800 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-bold cursor-not-allowed">
                                    <Lock className="w-5 h-5" />
                                    Locked - Complete previous nodes first
                                </div>
                            ) : (
                                <button
                                    onClick={() => onComplete(node.id)}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Complete Node (+{node.xpReward} XP)
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
