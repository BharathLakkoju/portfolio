import { getSupabaseClient } from '@/lib/supabase';
import type { BlogPost } from '@/types';
import BlogClient from './BlogClient';

async function fetchPosts(): Promise<BlogPost[]> {
    const sb = getSupabaseClient();
    if (!sb) return [];
    const { data, error } = await sb
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(12);
    if (error || !data) return [];
    return data as BlogPost[];
}

export default async function Blog() {
    const posts = await fetchPosts();

    return (
        <section id="blog">
            <div className="section-label">Blog</div>
            <div className="section-title">Thoughts &amp; learnings</div>
            <p style={{ color: 'var(--muted)', marginTop: '12px', fontSize: '0.95rem' }}>
                Writing about full-stack engineering, AI, and building in public.
            </p>
            <BlogClient posts={posts} />
        </section>
    );
}
