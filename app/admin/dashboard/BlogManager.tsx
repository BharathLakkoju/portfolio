'use client';

import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types';

const EMPTY: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    excerpt: '',
    content: '',
    category: 'Engineering',
    emoji: '📝',
    gradient: 'linear-gradient(135deg,#e0e7ff,#ddd6fe)',
    read_time: 5,
    published: true,
    published_at: new Date().toISOString().split('T')[0],
};

export default function BlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/blog');
        const data = await res.json();
        setLoading(false);
        if (Array.isArray(data)) setPosts(data);
        else setError(data.error ?? 'Failed to load');
    };

    useEffect(() => { fetchPosts(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm(EMPTY);
        setIsFormOpen(true);
    };
    const openEdit = (p: BlogPost) => {
        setEditing(p);
        const { id: _id, created_at: _c, updated_at: _u, ...rest } = p;
        setForm(rest);
        setIsFormOpen(true);
    };
    const closeForm = () => {
        setEditing(null);
        setForm(EMPTY);
        setIsFormOpen(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
        const method = editing ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, read_time: Number(form.read_time) }),
        });
        setSaving(false);
        if (res.ok) { closeForm(); fetchPosts(); }
        else { const d = await res.json(); setError(d.error ?? 'Save failed'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this post?')) return;
        const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
        if (res.ok) fetchPosts();
        else setError('Delete failed');
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Blog Posts</h2>
                <button className="btn-primary admin-add-btn" onClick={openNew}>
                    + New Post
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}

            {/* ── Form ── */}
            {isFormOpen && (
                <div className="admin-form-card">
                    <h3>{editing ? 'Edit Post' : 'New Post'}</h3>
                    <div className="admin-form-grid">
                        <div className="admin-field admin-col-2">
                            <label>Title *</label>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="admin-field admin-col-2">
                            <label>Excerpt *</label>
                            <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                        </div>
                        <div className="admin-field admin-col-2">
                            <label>Content (HTML) *</label>
                            <textarea rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Category</label>
                            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Emoji</label>
                            <input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Gradient CSS</label>
                            <input value={form.gradient} onChange={e => setForm({ ...form, gradient: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Read Time (min)</label>
                            <input type="number" min={1} value={form.read_time} onChange={e => setForm({ ...form, read_time: Number(e.target.value) })} />
                        </div>
                        <div className="admin-field">
                            <label>Published Date</label>
                            <input type="date" value={form.published_at} onChange={e => setForm({ ...form, published_at: e.target.value })} />
                        </div>
                        <div className="admin-field admin-checkbox-field">
                            <label>
                                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                                Published
                            </label>
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button className="btn-outline" onClick={closeForm} disabled={saving}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save Post'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            {loading ? (
                <div className="admin-loading">Loading…</div>
            ) : posts.length === 0 ? (
                <p className="admin-empty">No posts yet. Create the first one.</p>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Emoji</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Published</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(p => (
                                <tr key={p.id}>
                                    <td>{p.emoji}</td>
                                    <td className="admin-td-title">{p.title}</td>
                                    <td><span className="admin-badge">{p.category}</span></td>
                                    <td>{p.published_at}</td>
                                    <td>
                                        <span className={`admin-status ${p.published ? 'active' : ''}`}>
                                            {p.published ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="admin-action-btn" onClick={() => openEdit(p)}>✏ Edit</button>
                                        <button className="admin-action-btn danger" onClick={() => handleDelete(p.id)}>🗑 Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
