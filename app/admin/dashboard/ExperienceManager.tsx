'use client';

import { useState, useEffect } from 'react';
import type { WorkExperience } from '@/types';

const EMPTY: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'> = {
    role: '',
    company: '',
    location: '',
    period: '',
    bullets: [],
    display_order: 0,
};

export default function ExperienceManager() {
    const [items, setItems] = useState<WorkExperience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState<WorkExperience | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [bulletsText, setBulletsText] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/experience');
        const data = await res.json();
        setLoading(false);
        if (Array.isArray(data)) setItems(data);
        else setError(data.error ?? 'Failed to load');
    };

    useEffect(() => { fetchItems(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm(EMPTY);
        setBulletsText('');
    };

    const openEdit = (item: WorkExperience) => {
        setEditing(item);
        const { id: _id, created_at: _c, updated_at: _u, bullets, ...rest } = item;
        setForm({ ...rest, bullets });
        setBulletsText(bullets.join('\n'));
    };

    const closeForm = () => {
        setEditing(null);
        setForm(EMPTY);
        setBulletsText('');
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        const parsedBullets = bulletsText
            .split('\n')
            .map(b => b.trim())
            .filter(Boolean);
        const payload = {
            ...form,
            bullets: parsedBullets,
            display_order: Number(form.display_order),
        };
        const url = editing
            ? `/api/admin/experience/${editing.id}`
            : '/api/admin/experience';
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
        if (!confirm('Delete this experience entry?')) return;
        const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
        if (res.ok) fetchItems();
        else setError('Delete failed');
    };

    const isFormOpen = editing !== null || form.role !== '';

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Work Experience</h2>
                <button className="btn-primary admin-add-btn" onClick={openNew}>
                    + Add Experience
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}

            {/* ── Form ── */}
            {isFormOpen && (
                <div className="admin-form-card">
                    <h3>{editing ? 'Edit Experience' : 'New Experience'}</h3>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Role / Title *</label>
                            <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Company *</label>
                            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Location</label>
                            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Period *</label>
                            <input placeholder="e.g. Jan 2024 – Present" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
                        </div>
                        <div className="admin-field admin-col-2">
                            <label>Bullets (one per line — HTML allowed)</label>
                            <textarea
                                rows={8}
                                placeholder={'Developed <strong>modular components</strong>…\nImproved performance by 85%…'}
                                value={bulletsText}
                                onChange={e => setBulletsText(e.target.value)}
                            />
                        </div>
                        <div className="admin-field">
                            <label>Display Order</label>
                            <input type="number" min={0} value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} />
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button className="btn-outline" onClick={closeForm} disabled={saving}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            {loading ? (
                <div className="admin-loading">Loading…</div>
            ) : items.length === 0 ? (
                <p className="admin-empty">No experience entries yet.</p>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Company</th>
                                <th>Period</th>
                                <th>Bullets</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td><strong>{item.role}</strong></td>
                                    <td>{item.company}</td>
                                    <td><span className="admin-badge">{item.period}</span></td>
                                    <td>{item.bullets.length} bullet{item.bullets.length !== 1 ? 's' : ''}</td>
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
