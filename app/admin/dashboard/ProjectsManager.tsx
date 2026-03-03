'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/types';

const EMPTY: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
    icon: '🔷',
    image_path: '',
    active: false,
    status_label: 'Live',
    title: '',
    description: '',
    tags: [],
    display_order: 0,
};

export default function ProjectsManager() {
    const [items, setItems] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState<Project | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [tagsText, setTagsText] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        setLoading(false);
        if (Array.isArray(data)) setItems(data);
        else setError(data.error ?? 'Failed to load');
    };

    useEffect(() => { fetchItems(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm(EMPTY);
        setTagsText('');
        setIsFormOpen(true);
    };

    const openEdit = (item: Project) => {
        setEditing(item);
        const { id: _id, created_at: _c, updated_at: _u, tags, ...rest } = item;
        setForm({ ...rest, tags });
        setTagsText(tags.join(', '));
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setEditing(null);
        setForm(EMPTY);
        setTagsText('');
        setIsFormOpen(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        const parsedTags = tagsText
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
        const payload = {
            ...form,
            tags: parsedTags,
            display_order: Number(form.display_order),
        };
        const url = editing
            ? `/api/admin/projects/${editing.id}`
            : '/api/admin/projects';
        const method = editing ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        setSaving(false);
        if (res.ok) { closeForm(); fetchItems(); }
        else { const d = await res.json(); setError(d.error ?? 'Save failed'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this project?')) return;
        const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
        if (res.ok) fetchItems();
        else setError('Delete failed');
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Projects</h2>
                <button className="btn-primary admin-add-btn" onClick={openNew}>
                    + Add Project
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}

            {/* ── Form ── */}
            {isFormOpen && (
                <div className="admin-form-card">
                    <h3>{editing ? 'Edit Project' : 'New Project'}</h3>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Icon (emoji) *</label>
                            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Image Path (e.g., /projectImages/logo.png)</label>
                            <input placeholder="/projectImages/logo.png" value={form.image_path || ''} onChange={e => setForm({ ...form, image_path: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Title *</label>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="admin-field admin-col-2">
                            <label>Description *</label>
                            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Status Label</label>
                            <select value={form.status_label} onChange={e => setForm({ ...form, status_label: e.target.value })}>
                                <option>Live</option>
                                <option>In Progress</option>
                                <option>Coming Soon</option>
                                <option>Archived</option>
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Tags (comma-separated)</label>
                            <input
                                placeholder="React, Next.js, Supabase"
                                value={tagsText}
                                onChange={e => setTagsText(e.target.value)}
                            />
                        </div>
                        <div className="admin-field">
                            <label>Display Order</label>
                            <input type="number" min={0} value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} />
                        </div>
                        <div className="admin-field admin-checkbox-field">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.active}
                                    onChange={e => setForm({ ...form, active: e.target.checked })}
                                />
                                Mark as Active / In Progress
                            </label>
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button className="btn-outline" onClick={closeForm} disabled={saving}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save Project'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            {loading ? (
                <div className="admin-loading">Loading…</div>
            ) : items.length === 0 ? (
                <p className="admin-empty">No projects yet.</p>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Tags</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td style={{ fontSize: '1.4rem', textAlign: 'center' }}>
                                        {item.image_path ? (
                                            <img src={item.image_path} alt={item.title} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                        ) : (
                                            item.icon
                                        )}
                                    </td>
                                    <td><strong>{item.title}</strong></td>
                                    <td>
                                        <span className={`admin-status ${item.active ? 'active' : ''}`}>
                                            {item.status_label}
                                        </span>
                                    </td>
                                    <td>{item.tags.join(', ')}</td>
                                    <td>{item.display_order}</td>
                                    <td>
                                        <button className="admin-action-btn" onClick={() => openEdit(item)}>✏ Edit</button>
                                        <button className="admin-action-btn danger" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
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
