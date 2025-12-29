"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Close mobile sidebar on path change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (isLandingPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                onCloseMobile={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center px-4 md:hidden z-30">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-400 hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="ml-4 font-bold text-lg text-white">SkillForge</span>
            </div>

            <main
                className={cn(
                    "flex-1 transition-all duration-300 pt-16 md:pt-0",
                    isCollapsed ? "md:ml-20" : "md:ml-64"
                )}
            >
                {children}
            </main>
        </div>
    );
}
