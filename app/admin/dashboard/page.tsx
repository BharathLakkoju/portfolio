import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth';
import Dashboard from './Dashboard';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    const payload = token ? await verifySessionToken(token) : null;

    if (!payload) {
        redirect('/admin');
    }

    return <Dashboard username={payload.username} />;
}
