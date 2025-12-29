import { Node, Edge } from 'reactflow';
import { SkillTree, Branch } from '@/types/schema';

// Custom Organic/Radial Layout
export const transformSkillTreeToGraph = (skillTree: SkillTree) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Helper to process branches recursively with radial positioning
    const processBranch = (
        branch: Branch,
        parentId: string | null = null,
        angle: number = 0,
        depth: number = 0,
        sectorSize: number = 2 * Math.PI
    ) => {

        // Calculate position
        // Root is at 0,0
        // Others are at distance = depth * radiusStep
        const radiusStep = 350; // Distance between levels
        const radius = depth * radiusStep;

        // Add some randomness to make it look organic
        const randomOffset = depth > 0 ? (Math.random() - 0.5) * 50 : 0;

        const x = depth === 0 ? 0 : Math.cos(angle) * (radius + randomOffset);
        const y = depth === 0 ? 0 : Math.sin(angle) * (radius + randomOffset);

        nodes.push({
            id: branch.id,
            type: 'skillNode',
            position: { x, y },
            data: {
                label: branch.name,
                level: branch.level,
                xp: branch.xpReward,
                status: branch.status || 'locked', // Ensure status is passed
                description: branch.description,
                objectives: branch.objectives
            },
        });

        if (parentId) {
            edges.push({
                id: `${parentId}-${branch.id}`,
                source: parentId,
                target: branch.id,
                type: 'smoothstep', // Curvy lines look more organic
                animated: branch.status === 'available',
                style: { stroke: '#475569', strokeWidth: 2 },
            });
        }

        if (branch.branches && branch.branches.length > 0) {
            const count = branch.branches.length;
            // Distribute children within the parent's sector
            // If root, full circle (2PI). If not, limit to a cone to avoid overlap.
            const availableSector = depth === 0 ? 2 * Math.PI : sectorSize * 0.8;
            const startAngle = angle - availableSector / 2;
            const step = availableSector / count;

            branch.branches.forEach((subBranch, index) => {
                // Center the children in the sector
                const childAngle = startAngle + step * index + step / 2;
                processBranch(subBranch, branch.id, childAngle, depth + 1, step);
            });
        }
    };

    // Start processing from root (assumed first branch or create a virtual root)
    // If the tree has multiple top-level branches, we treat them as children of a virtual center 0,0
    if (skillTree.branches) {
        const count = skillTree.branches.length;
        const step = (2 * Math.PI) / count;

        skillTree.branches.forEach((branch, index) => {
            const angle = step * index;
            processBranch(branch, null, angle, 1, step);
        });

        // Add a central "Hub" node for the Skill Name
        nodes.push({
            id: 'root-hub',
            type: 'skillNode',
            position: { x: 0, y: 0 },
            data: {
                label: skillTree.skillName,
                level: 'Mastery',
                xp: 0,
                status: 'completed',
                description: skillTree.description
            }
        });

        // Connect top branches to hub
        skillTree.branches.forEach(branch => {
            edges.push({
                id: `root-${branch.id}`,
                source: 'root-hub',
                target: branch.id,
                type: 'default',
                style: { stroke: '#475569', strokeWidth: 3, opacity: 0.5 },
            });
        });
    }

    return { nodes, edges };
};
