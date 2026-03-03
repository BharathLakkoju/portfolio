'use client';

import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types';

function formatDate(str: string) {
    return new Date(str).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const openModal = (post: BlogPost) => {
        setSelectedPost(post);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedPost(null);
        document.body.style.overflow = '';
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            <div id="blog-grid" className="blog-grid">
                {posts.length === 0 ? (
                    <div className="blog-loading">
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                            No posts yet. Add some from the admin panel.
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="blog-card reveal"
                            onClick={() => openModal(post)}
                        >
                            <div
                                className="blog-thumb"
                                style={{
                                    background:
                                        post.gradient ||
                                        'linear-gradient(135deg,#e0e7ff,#ddd6fe)',
                                }}
                            >
                                <span style={{ fontSize: '3rem' }}>
                                    {post.emoji || '📝'}
                                </span>
                            </div>
                            <div className="blog-body">
                                <div className="blog-meta">
                                    <span className="blog-tag">{post.category}</span>
                                    <span className="blog-date">
                                        {formatDate(post.published_at)} ·{' '}
                                        {post.read_time} min read
                                    </span>
                                </div>
                                <div className="blog-title">{post.title}</div>
                                <div className="blog-excerpt">{post.excerpt}</div>
                                <span className="blog-read-more">Read article →</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Blog Post Modal */}
            <div
                className={`modal-overlay${selectedPost ? ' open' : ''}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeModal();
                }}
            >
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="modal-close"
                        onClick={closeModal}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    {selectedPost && (
                        <>
                            <div className="modal-tag">{selectedPost.category}</div>
                            <div className="modal-title">{selectedPost.title}</div>
                            <div className="modal-date">
                                {formatDate(selectedPost.published_at)} ·{' '}
                                {selectedPost.read_time} min read
                            </div>
                            {/* Content is authored by the site admin — safe to render as HTML */}
                            <div
                                className="modal-content"
                                dangerouslySetInnerHTML={{
                                    __html: selectedPost.content,
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
