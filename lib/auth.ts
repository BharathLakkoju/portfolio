import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

function getSecret() {
    const secret =
        process.env.ADMIN_JWT_SECRET ?? 'dev-secret-replace-in-production-min32chars!';
    return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
    return new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('8h')
        .setIssuedAt()
        .sign(getSecret());
}

export async function verifySessionToken(
    token: string,
): Promise<(JWTPayload & { username: string }) | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        if (typeof payload.username !== 'string') return null;
        return payload as JWTPayload & { username: string };
    } catch {
        return null;
    }
}
