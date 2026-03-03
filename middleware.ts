import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret() {
    const secret =
        process.env.ADMIN_JWT_SECRET ?? 'dev-secret-replace-in-production-min32chars!';
    return new TextEncoder().encode(secret);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) return false;
    try {
        await jwtVerify(token, getSecret());
        return true;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authed = await isAuthenticated(request);

    // Protect the admin dashboard UI
    if (pathname.startsWith('/admin/dashboard')) {
        if (!authed) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    // Protect admin API endpoints (all except /api/admin/login)
    if (
        pathname.startsWith('/api/admin') &&
        pathname !== '/api/admin/login'
    ) {
        if (!authed) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/dashboard/:path*',
        '/api/admin/logout',
        '/api/admin/blog/:path*',
        '/api/admin/experience/:path*',
        '/api/admin/projects/:path*',
    ],
};
