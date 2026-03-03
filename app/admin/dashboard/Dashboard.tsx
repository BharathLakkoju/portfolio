'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import BlogManager from './BlogManager';
import ExperienceManager from './ExperienceManager';
import ProjectsManager from './ProjectsManager';

type Tab = 'blog' | 'experience' | 'projects';

export default function Dashboard({ username }: { username: string }) {
    const [tab, setTab] = useState<Tab>('blog');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const logout = () => {
        startTransition(async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin');
        });
    };

    return (
        <div className="admin-layout">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-brand">
                    BL<span>.</span> Admin
                </div>
                <div className="admin-header-right">
                    <span className="admin-username">@{username}</span>
                    <button
                        className="admin-logout-btn"
                        onClick={logout}
                        disabled={isPending}
                    >
                        {isPending ? 'Logging out…' : 'Logout'}
                    </button>
                </div>
            </header>

            {/* Tab nav */}
            <nav className="admin-tabs">
                {(['blog', 'experience', 'projects'] as Tab[]).map(t => (
                    <button
                        key={t}
                        className={`admin-tab${tab === t ? ' active' : ''}`}
                        onClick={() => setTab(t)}
                    >
                        {t === 'blog' && '📝 Blog Posts'}
                        {t === 'experience' && '💼 Work Experience'}
                        {t === 'projects' && '🚀 Projects'}
                    </button>
                ))}
            </nav>

            {/* Content */}
            <main className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                    <button className="btn-outline" onClick={logout} disabled={isPending}>
                        {isPending ? 'Logging out…' : 'Logout'}
                    </button>
                </div>
                {tab === 'blog' && <BlogManager />}
                {tab === 'experience' && <ExperienceManager />}
                {tab === 'projects' && <ProjectsManager />}
            </main>
        </div>
    );
}
