'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        startTransition(async () => {
            try {
                const res = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                if (res.ok) {
                    router.push('/admin/dashboard');
                } else {
                    const data = await res.json();
                    setError(data.error ?? 'Login failed');
                }
            } catch {
                setError('Network error. Please try again.');
            }
        });
    };

    return (
        <div className="admin-login-wrap">
            <form className="admin-login-card" onSubmit={handleSubmit} noValidate>
                <div className="admin-login-logo">
                    BL<span>.</span>
                </div>
                <h1 className="admin-login-title">Admin Access</h1>
                <p className="admin-login-sub">Enter your credentials to continue</p>

                {error && <div className="admin-error">{error}</div>}

                <div className="admin-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                        disabled={isPending}
                    />
                </div>

                <div className="admin-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        disabled={isPending}
                    />
                </div>

                <button
                    type="submit"
                    className="admin-login-btn"
                    disabled={isPending}
                >
                    {isPending ? 'Signing in…' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
