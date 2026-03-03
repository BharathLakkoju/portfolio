import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSessionToken } from '@/lib/auth';

function timingSafeEqual(a: string, b: string): boolean {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body as {
            username?: string;
            password?: string;
        };

        const adminUser = process.env.ADMIN_USERNAME ?? '';
        const adminPass = process.env.ADMIN_PASSWORD ?? '';

        if (
            !username ||
            !password ||
            !timingSafeEqual(username, adminUser) ||
            !timingSafeEqual(password, adminPass)
        ) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 },
            );
        }

        const token = await createSessionToken(username);
        const response = NextResponse.json({ ok: true });
        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60, // 8 hours
            path: '/',
        });
        return response;
    } catch {
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
}
