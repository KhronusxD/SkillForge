export interface Club {
    id: string;
    name: string;
    description: string;
    category: 'Coding' | 'Art' | 'Writing' | 'Music' | 'Language' | 'Other';
    memberCount: number;
    tags: string[];
    image: string; // URL or placeholder
    recentActivity?: { user: string; action: string; time: string }[];
}

export const MOCK_CLUBS: Club[] = [
    {
        id: 'c1',
        name: 'React Wizards',
        description: 'A community for React developers to share tips, tricks, and hooks.',
        category: 'Coding',
        memberCount: 1240,
        tags: ['React', 'Frontend', 'JavaScript'],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
        recentActivity: [
            { user: 'Alice', action: 'shared a snippet', time: '2h ago' },
            { user: 'Bob', action: 'joined the club', time: '5h ago' }
        ]
    },
    {
        id: 'c2',
        name: 'Pixel Art Pros',
        description: 'Discussing techniques for pixel art, animation, and game sprites.',
        category: 'Art',
        memberCount: 850,
        tags: ['Pixel Art', 'Game Dev', 'Design'],
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
        recentActivity: [
            { user: 'Charlie', action: 'posted artwork', time: '1d ago' }
        ]
    },
    {
        id: 'c3',
        name: 'Sci-Fi Writers',
        description: 'For those building worlds among the stars. Critique partners and prompts.',
        category: 'Writing',
        memberCount: 430,
        tags: ['Writing', 'Sci-Fi', 'Worldbuilding'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'c4',
        name: 'Pythonistas',
        description: 'From scripts to AI, everything Python.',
        category: 'Coding',
        memberCount: 2100,
        tags: ['Python', 'Data Science', 'Backend'],
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'c5',
        name: 'Polyglot Cafe',
        description: 'Learning multiple languages? Practice here.',
        category: 'Language',
        memberCount: 600,
        tags: ['Languages', 'Learning', 'Culture'],
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: 'c6',
        name: 'Indie Game Devs',
        description: 'Solo devs and small teams working on the next big hit.',
        category: 'Coding',
        memberCount: 1500,
        tags: ['Game Dev', 'Unity', 'Godot'],
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=60'
    }
];
