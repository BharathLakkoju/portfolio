import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth';
import LoginForm from './LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Portfolio' };

export default async function AdminPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token && (await verifySessionToken(token))) {
        redirect('/admin/dashboard');
    }
    return <LoginForm />;
}
