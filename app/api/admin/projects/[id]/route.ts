import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const sb = getSupabaseAdmin();
        const { data, error } = await sb
            .from('projects')
            .update(body)
            .eq('id', id)
            .select()
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Server error' },
            { status: 500 },
        );
    }
}

export async function DELETE(_: Request, { params }: Params) {
    try {
        const { id } = await params;
        const sb = getSupabaseAdmin();
        const { error } = await sb.from('projects').delete().eq('id', id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Server error' },
            { status: 500 },
        );
    }
}
