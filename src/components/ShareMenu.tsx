"use client";

import { useState, useRef } from 'react';
import { Download, Upload, Image as ImageIcon, Share2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillStore } from '@/store/skillStore';
import { SkillTree } from '@/types/schema';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

interface ShareMenuProps {
    skill: SkillTree;
}

export default function ShareMenu({ skill }: ShareMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const { importSkill } = useSkillStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportJSON = () => {
        const blob = new Blob([JSON.stringify(skill, null, 2)], { type: 'application/json' });
        saveAs(blob, `${skill.skillName.replace(/\s+/g, '_')}_skillforge.json`);
        setIsOpen(false);
    };

    const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                const success = importSkill(json);
                if (success) {
                    alert('Skill imported successfully!');
                } else {
                    alert('Failed to import skill. Invalid format.');
                }
            } catch (err) {
                console.error(err);
                alert('Error reading file.');
            }
            setIsOpen(false);
        };
        reader.readAsText(file);
    };

    const handleDownloadImage = async () => {
        setIsExporting(true);
        try {
            // We need to target the React Flow viewport. 
            // Since this component is inside the page, we'll look for the class 'react-flow'
            const node = document.querySelector('.react-flow') as HTMLElement;

            if (node) {
                const dataUrl = await toPng(node, {
                    backgroundColor: '#020617', // slate-950
                    style: {
                        transform: 'scale(1)', // Ensure no weird scaling
                    }
                });
                saveAs(dataUrl, `${skill.skillName.replace(/\s+/g, '_')}_map.png`);
            } else {
                alert('Could not find map to capture.');
            }
        } catch (err) {
            console.error('Image capture failed', err);
            alert('Failed to generate image.');
        } finally {
            setIsExporting(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg transition-colors border border-slate-700"
                title="Share & Export"
            >
                <Share2 className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="p-1">
                            <button
                                onClick={handleExportJSON}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left"
                            >
                                <Download className="w-4 h-4 text-blue-400" />
                                Export JSON
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left"
                            >
                                <Upload className="w-4 h-4 text-green-400" />
                                Import JSON
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImportJSON}
                                accept=".json"
                                className="hidden"
                            />

                            <button
                                onClick={handleDownloadImage}
                                disabled={isExporting}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                {isExporting ? (
                                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                ) : (
                                    <ImageIcon className="w-4 h-4 text-purple-400" />
                                )}
                                {isExporting ? 'Generating...' : 'Download Image'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
