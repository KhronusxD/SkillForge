import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SkillTree, Branch } from '@/types/schema';
import { Node, Edge } from 'reactflow';
import { BADGES } from '@/types/badges';

interface SkillState {
    skills: SkillTree[];
    activeSkillId: string | null;

    // Graph state (ephemeral, for the active view)
    nodes: Node[];
    edges: Edge[];
    isLoading: boolean;

    // Actions
    addSkill: (skill: SkillTree) => void;
    importSkill: (skill: SkillTree) => boolean; // Returns success/failure
    setActiveSkill: (id: string) => void;
    completeNode: (skillId: string, nodeId: string) => void;
    updateNodeNotes: (skillId: string, nodeId: string, notes: string) => void;
    setGraph: (nodes: Node[], edges: Edge[]) => void;
    setLoading: (loading: boolean) => void;

    version: number; // For forcing re-renders

    // Computed
    getTotalXp: () => number;

    // Level Up Logic
    lastLevelSeen: number;
    setLastLevelSeen: (level: number) => void;

    // User Profile
    userProfile: {
        name: string;
        avatar: string; // e.g., 'warrior', 'mage', 'rogue'
    };
    updateUserProfile: (profile: { name?: string; avatar?: string }) => void;

    // Gamification 2.0
    streak: number;
    lastLoginDate: string | null; // ISO Date string
    unlockedBadges: string[]; // Badge IDs

    checkStreak: () => void;
    checkBadges: () => void;

    // Settings
    soundEnabled: boolean;
    toggleSound: () => void;

    // Clubs
    joinedClubs: string[]; // Club IDs
    joinClub: (clubId: string) => void;
    leaveClub: (clubId: string) => void;
}

export const useSkillStore = create<SkillState>()(
    persist(
        (set, get) => ({
            skills: [],
            activeSkillId: null,
            nodes: [],
            edges: [],
            isLoading: false,
            version: 0,
            lastLevelSeen: 1, // Default to level 1
            userProfile: {
                name: 'SkillForger',
                avatar: 'warrior'
            },
            streak: 0,
            lastLoginDate: null,
            unlockedBadges: [],
            soundEnabled: true,
            joinedClubs: [],

            joinClub: (clubId) => set((state) => {
                if (state.joinedClubs.includes(clubId)) return state;
                return { joinedClubs: [...state.joinedClubs, clubId] };
            }),

            leaveClub: (clubId) => set((state) => ({
                joinedClubs: state.joinedClubs.filter(id => id !== clubId)
            })),

            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

            addSkill: (skill) => set((state) => {
                // Prevent duplicates by name (simple check)
                const exists = state.skills.find(s => s.skillName === skill.skillName);
                if (exists) return state;
                return { skills: [...state.skills, skill], version: state.version + 1 };
            }),

            importSkill: (skill) => {
                try {
                    // Basic validation
                    if (!skill.skillName || !skill.branches || !Array.isArray(skill.branches)) {
                        console.error("Invalid skill data");
                        return false;
                    }

                    set((state) => {
                        // Check if skill already exists, if so, replace it (or merge? for now replace)
                        const existingIndex = state.skills.findIndex(s => s.skillName === skill.skillName);
                        const newSkills = [...state.skills];

                        if (existingIndex >= 0) {
                            newSkills[existingIndex] = skill;
                        } else {
                            newSkills.push(skill);
                        }

                        return { skills: newSkills, version: state.version + 1 };
                    });
                    return true;
                } catch (e) {
                    console.error("Import failed", e);
                    return false;
                }
            },

            setActiveSkill: (id) => set({ activeSkillId: id }),

            setLastLevelSeen: (level) => set({ lastLevelSeen: level }),

            updateUserProfile: (profile) => set((state) => ({
                userProfile: { ...state.userProfile, ...profile }
            })),

            checkStreak: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const lastLogin = state.lastLoginDate ? state.lastLoginDate.split('T')[0] : null;

                if (lastLogin === today) {
                    return state; // Already logged in today
                }

                if (lastLogin) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    if (lastLogin === yesterdayStr) {
                        // Streak continues
                        return { streak: state.streak + 1, lastLoginDate: new Date().toISOString() };
                    } else {
                        // Streak broken
                        return { streak: 1, lastLoginDate: new Date().toISOString() };
                    }
                } else {
                    // First login
                    return { streak: 1, lastLoginDate: new Date().toISOString() };
                }
            }),

            checkBadges: () => set((state) => {
                const totalXp = state.getTotalXp();
                const streak = state.streak;
                const skillsCount = state.skills.length;

                const newUnlocked = [...state.unlockedBadges];
                let changed = false;

                BADGES.forEach(badge => {
                    if (!newUnlocked.includes(badge.id)) {
                        if (badge.condition({ totalXp, streak, skillsCount })) {
                            newUnlocked.push(badge.id);
                            changed = true;
                        }
                    }
                });

                if (changed) {
                    return { unlockedBadges: newUnlocked };
                }
                return state;
            }),

            updateNodeNotes: (skillId, nodeId, notes) => set((state) => {
                const newSkills = [...state.skills];
                const skillIndex = newSkills.findIndex(s => s.skillName === skillId);
                if (skillIndex === -1) return state;

                const skill = { ...newSkills[skillIndex] };
                let updated = false;

                const updateRecursive = (branches: Branch[]) => {
                    for (const branch of branches) {
                        if (branch.id === nodeId) {
                            branch.notes = notes;
                            updated = true;
                            return;
                        }
                        if (branch.branches) updateRecursive(branch.branches);
                    }
                };

                if (skill.branches) updateRecursive(skill.branches);

                if (updated) {
                    newSkills[skillIndex] = skill;
                    return { skills: newSkills };
                }

                return state;
            }),

            setGraph: (nodes, edges) => set({ nodes, edges }),
            setLoading: (loading) => set({ isLoading: loading }),

            completeNode: (skillId: string, nodeId: string) => set((state) => {
                const skillIndex = state.skills.findIndex(s => s.skillName === skillId);
                if (skillIndex === -1) return state;

                const newSkills = [...state.skills];
                const skill = { ...newSkills[skillIndex] };

                // Recursive function to update node status
                // Returns true if the node was found and updated
                const updateNodeStatus = (branches: Branch[]): boolean => {
                    let changed = false;

                    for (let i = 0; i < branches.length; i++) {
                        const branch = branches[i];

                        // 1. Check if this is the target node
                        if (branch.id === nodeId) {
                            if (branch.status !== 'completed') {
                                branch.status = 'completed';
                                changed = true;

                                // Unlock children
                                if (branch.branches) {
                                    branch.branches.forEach(child => {
                                        if (child.status === 'locked') child.status = 'available';
                                    });
                                }

                                // Unlock next sibling
                                if (i + 1 < branches.length) {
                                    if (branches[i + 1].status === 'locked') {
                                        branches[i + 1].status = 'available';
                                    }
                                }
                            }
                        }
                        // 2. Recursively check children
                        else if (branch.branches) {
                            if (updateNodeStatus(branch.branches)) {
                                changed = true;

                                // Check if ALL children are now completed
                                const allChildrenComplete = branch.branches.every(b => b.status === 'completed');
                                if (allChildrenComplete && branch.status !== 'completed') {
                                    branch.status = 'completed';

                                    // Unlock next sibling of the PARENT (which is branches[i+1] relative to the parent's array, 
                                    // but we are inside the parent's loop? No, we are inside the grandparent's loop iterating over parents)
                                    // Wait, we are iterating over 'branches'. 'branch' is the parent.
                                    // We need to unlock 'branch's' sibling. 
                                    // But we are inside the loop for 'branches'. 
                                    // So if 'branch' completes, we unlock 'branches[i+1]'.

                                    if (i + 1 < branches.length) {
                                        if (branches[i + 1].status === 'locked') {
                                            branches[i + 1].status = 'available';
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return changed;
                };

                const updated = updateNodeStatus(skill.branches);

                if (updated) {
                    newSkills[skillIndex] = skill;
                    return { skills: newSkills, version: state.version + 1 };
                }

                return state;
            }),

            getTotalXp: () => {
                let total = 0;
                get().skills.forEach(skill => { // Use get() to access current state
                    const countXp = (branches: any[]) => {
                        branches.forEach(branch => {
                            if (branch.status === 'completed') total += branch.xpReward;
                            if (branch.branches) countXp(branch.branches);
                        });
                    };
                    countXp(skill.branches);
                });
                return total;
            }
        }),
        {
            name: 'skillforge-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                skills: state.skills,
                lastLevelSeen: state.lastLevelSeen,
                userProfile: state.userProfile,
                streak: state.streak,
                lastLoginDate: state.lastLoginDate,
                unlockedBadges: state.unlockedBadges,
                soundEnabled: state.soundEnabled,
                joinedClubs: state.joinedClubs
            }),
        }
    )
);
