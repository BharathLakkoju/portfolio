-- ─────────────────────────────────────────────────────────────
--  Bharath Lakkoju — Portfolio Blog Schema
--  Run this in your Supabase SQL Editor (supabase.com → SQL Editor)
-- ─────────────────────────────────────────────────────────────

-- 1. Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT        NOT NULL,
  excerpt       TEXT        NOT NULL,
  content       TEXT        NOT NULL,
  category      TEXT        NOT NULL DEFAULT 'Engineering',
  emoji         TEXT        NOT NULL DEFAULT '📝',
  gradient      TEXT        NOT NULL DEFAULT 'linear-gradient(135deg,#e0e7ff,#ddd6fe)',
  read_time     INT         NOT NULL DEFAULT 5,   -- minutes
  published     BOOLEAN     NOT NULL DEFAULT TRUE,
  published_at  DATE        NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to read published posts (no auth required for portfolio)
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = TRUE);

-- 4. Optional: Only authenticated users (you) can insert/update/delete
-- CREATE POLICY "Authenticated can manage posts"
--   ON blog_posts FOR ALL
--   USING (auth.role() = 'authenticated');

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
--  SEED DATA — 4 sample blog posts
-- ─────────────────────────────────────────────────────────────

INSERT INTO blog_posts (title, excerpt, content, category, emoji, gradient, read_time, published_at) VALUES

(
  'Building Modular React Architectures for Enterprise Scale',
  'Lessons from architecting a health engagement platform — how to structure components, state, and data flows so teams can move fast without breaking things.',
  '<h3>The Problem with "Just Make It Work"</h3>
<p>When I joined UST and started working on the healthcare engagement platform, the codebase was a tangle of tightly-coupled components. Every change risked breaking something unexpected. Sound familiar?</p>
<h3>The Modular Approach</h3>
<p>We adopted a feature-based folder structure — each "feature" (e.g., <code>incentives</code>, <code>analytics</code>, <code>tasks</code>) owns its own components, hooks, API calls, and types. Nothing leaks out without an explicit export.</p>
<ul>
  <li>Components are dumb — they only render what they''re given.</li>
  <li>Hooks own all async logic and local state.</li>
  <li>Context/Zustand handles only truly global state (auth, user preferences).</li>
</ul>
<h3>The Result</h3>
<p>Engineers can now pick up any feature independently. Onboarding time dropped, PR sizes shrank, and that terrifying 98% reduction in member discrepancies? Partly attributable to isolated, testable data-flow modules.</p>
<p>The key insight: <strong>modularity is not an architecture decision, it is a team-speed decision.</strong></p>',
  'Engineering',
  '🏗️',
  'linear-gradient(135deg,#667eea22,#764ba222)',
  6,
  '2025-01-15'
),

(
  'Why I Chose Supabase Over Firebase for My Projects',
  'An honest comparison after using both in production — auth, real-time, storage, and the postgres advantage that tipped the scales for me.',
  '<h3>The Firebase Era</h3>
<p>Firebase is incredible for prototyping. You get auth, real-time database, and hosting in under an hour. I used it for three side projects before running into the wall: NoSQL data modeling for relational data is <em>painful</em>.</p>
<h3>Enter Supabase</h3>
<p>Supabase gives you a real <strong>PostgreSQL database</strong> with a REST and GraphQL API auto-generated from your schema, plus auth, storage, and real-time out of the box.</p>
<ul>
  <li><strong>Auth</strong>: Email/password, magic links, OAuth — all configurable in the dashboard.</li>
  <li><strong>Real-time</strong>: Postgres logical replication means you subscribe to actual DB changes.</li>
  <li><strong>Row Level Security</strong>: Policies in SQL that enforce data access at the DB layer.</li>
</ul>
<h3>When Firebase Still Wins</h3>
<p>If you need offline-first mobile with complex sync, Firestore still has an edge. But for anything relational — and most apps are — Supabase is the clear choice in 2025.</p>',
  'Backend',
  '⚡',
  'linear-gradient(135deg,#f093fb22,#f5576c22)',
  5,
  '2025-02-08'
),

(
  'Building My First AI Mobile App: Lessons from the Trenches',
  'What nobody tells you about training a custom fashion dataset, managing model size on mobile, and the UX challenges of AI-powered recommendations.',
  '<h3>The Idea</h3>
<p>Outfit Suggestor started as a weekend experiment: what if your phone could look at your wardrobe and suggest outfits? Simple enough — until you start building it.</p>
<h3>The Dataset Problem</h3>
<p>Public fashion datasets (DeepFashion, Polyvore) are large but messy. I spent two weeks cleaning and normalising labels before any training. Lesson: <strong>data quality beats model complexity every time.</strong></p>
<h3>Mobile Constraints</h3>
<p>Running inference on-device requires aggressive quantisation. I went from a 200MB model to a 12MB TFLite model with less than 3% accuracy drop — acceptable for recommendations. React Native + Expo does not support TFLite natively, so I bridged via a lightweight API endpoint instead.</p>
<h3>UX Is the Real Challenge</h3>
<p>Users do not care about your model. They care about how fast suggestions appear and how delightful the animation is. I ended up spending 40% of the project on <code>react-native-reanimated</code> transitions and skeleton loaders.</p>',
  'AI / ML',
  '🤖',
  'linear-gradient(135deg,#4facfe22,#00f2fe22)',
  8,
  '2025-03-01'
),

(
  'Next.js App Router: What Changed and What Broke My Code',
  'A pragmatic guide to migrating from Pages Router to App Router — including the gotchas with data fetching, layouts, and server components that caught me off guard.',
  '<h3>Why Migrate?</h3>
<p>App Router enables React Server Components, nested layouts, and streaming — the performance gains are real. But the mental model shift is significant.</p>
<h3>The Biggest Gotchas</h3>
<ul>
  <li><strong>Everything is a Server Component by default.</strong> Add <code>use client</code> only when you need hooks or browser APIs.</li>
  <li><strong>Data fetching moves to the component.</strong> <code>getServerSideProps</code> is gone. Fetch directly in async Server Components with native deduplication.</li>
  <li><strong>Layouts do not re-render on navigation.</strong> Great for persistent sidebars; confusing when you expect state to reset.</li>
</ul>
<h3>What I Recommend</h3>
<p>Start new projects on App Router. For migrations, convert route by route. Next.js supports both routers simultaneously for a reason — use that grace period wisely.</p>',
  'Frontend',
  '⚙️',
  'linear-gradient(135deg,#43e97b22,#38f9d722)',
  7,
  '2025-03-20'
);

-- ─────────────────────────────────────────────────────────────
--  Verify
-- ─────────────────────────────────────────────────────────────
SELECT id, title, category, published_at FROM blog_posts ORDER BY published_at DESC;
