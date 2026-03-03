-- ─────────────────────────────────────────────────────────────
--  Bharath Lakkoju — Portfolio Schema
--  Run this in Supabase SQL Editor (supabase.com → SQL Editor)
--  Safe to run multiple times (uses IF NOT EXISTS / OR REPLACE)
-- ─────────────────────────────────────────────────────────────

-- ══════════════════════════════════════════════════════════════
--  1. blog_posts
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS blog_posts (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT        NOT NULL,
  excerpt       TEXT        NOT NULL,
  content       TEXT        NOT NULL,
  category      TEXT        NOT NULL DEFAULT 'Engineering',
  emoji         TEXT        NOT NULL DEFAULT '📝',
  gradient      TEXT        NOT NULL DEFAULT 'linear-gradient(135deg,#e0e7ff,#ddd6fe)',
  read_time     INT         NOT NULL DEFAULT 5,
  published     BOOLEAN     NOT NULL DEFAULT TRUE,
  published_at  DATE        NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = TRUE);

-- Admin writes (auth enforced at app layer by JWT middleware)
DROP POLICY IF EXISTS "Anon can insert blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can update blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can delete blog_posts" ON blog_posts;
CREATE POLICY "Anon can insert blog_posts" ON blog_posts FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Anon can update blog_posts" ON blog_posts FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Anon can delete blog_posts" ON blog_posts FOR DELETE TO anon USING (TRUE);

-- ══════════════════════════════════════════════════════════════
--  2. work_experience
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS work_experience (
  id            BIGSERIAL PRIMARY KEY,
  role          TEXT        NOT NULL,
  company       TEXT        NOT NULL,
  location      TEXT        NOT NULL DEFAULT '',
  period        TEXT        NOT NULL,
  bullets       TEXT[]      NOT NULL DEFAULT '{}',
  display_order INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read work_experience" ON work_experience;
CREATE POLICY "Public can read work_experience"
  ON work_experience FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Anon can insert work_experience" ON work_experience;
DROP POLICY IF EXISTS "Anon can update work_experience" ON work_experience;
DROP POLICY IF EXISTS "Anon can delete work_experience" ON work_experience;
CREATE POLICY "Anon can insert work_experience" ON work_experience FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Anon can update work_experience" ON work_experience FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Anon can delete work_experience" ON work_experience FOR DELETE TO anon USING (TRUE);

-- ══════════════════════════════════════════════════════════════
--  3. projects
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
  id            BIGSERIAL PRIMARY KEY,
  icon          TEXT        NOT NULL DEFAULT '🔷',
  image_path    TEXT        DEFAULT NULL,
  active        BOOLEAN     NOT NULL DEFAULT FALSE,
  status_label  TEXT        NOT NULL DEFAULT 'Live',
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  display_order INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read projects" ON projects;
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Anon can insert projects" ON projects;
DROP POLICY IF EXISTS "Anon can update projects" ON projects;
DROP POLICY IF EXISTS "Anon can delete projects" ON projects;
CREATE POLICY "Anon can insert projects" ON projects FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Anon can update projects" ON projects FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Anon can delete projects" ON projects FOR DELETE TO anon USING (TRUE);

-- ══════════════════════════════════════════════════════════════
--  4. Shared updated_at trigger
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at    ON blog_posts;
DROP TRIGGER IF EXISTS work_experience_updated_at ON work_experience;
DROP TRIGGER IF EXISTS projects_updated_at       ON projects;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER work_experience_updated_at
  BEFORE UPDATE ON work_experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════════
--  5. Unique constraint — enables idempotent seed inserts
-- ══════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'blog_posts_title_key'
      AND table_name = 'blog_posts'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_title_key UNIQUE (title);
  END IF;
END $$;

-- ══════════════════════════════════════════════════════════════
--  6. Seed — blog_posts (6 posts by Bharath Lakkoju)
--     ON CONFLICT (title) DO NOTHING makes this safe to re-run
-- ══════════════════════════════════════════════════════════════
INSERT INTO blog_posts (title, excerpt, content, category, emoji, gradient, read_time, published_at)
VALUES
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
  'Engineering', '🏗️', 'linear-gradient(135deg,#667eea22,#764ba222)', 6, '2025-01-15'::DATE
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
  'Backend', '⚡', 'linear-gradient(135deg,#f093fb22,#f5576c22)', 5, '2025-02-08'::DATE
),
(
  'Building My First AI Mobile App: Lessons from the Trenches',
  'What nobody tells you about training a custom fashion dataset, managing model size on mobile, and the UX challenges of AI-powered recommendations.',
  '<h3>The Idea</h3>
<p>Outfit Suggestor started as a weekend experiment: what if your phone could look at your wardrobe and suggest outfits? Simple enough — until you start building it.</p>
<h3>The Dataset Problem</h3>
<p>Public fashion datasets (DeepFashion, Polyvore) are large but messy. I spent two weeks normalising labels before any training. Lesson: <strong>data quality beats model complexity every time.</strong></p>
<h3>Mobile Constraints</h3>
<p>Running inference on-device requires aggressive quantisation. I went from a 200MB model to a 12MB TFLite model with &lt;3% accuracy drop — acceptable for recommendations.</p>
<h3>UX Is the Real Challenge</h3>
<p>Users do not care about your model. They care about how fast suggestions appear and how delightful the animation is. I ended up spending 40% of the project on <code>react-native-reanimated</code> transitions and skeleton loaders.</p>',
  'AI / ML', '🤖', 'linear-gradient(135deg,#4facfe22,#00f2fe22)', 8, '2025-03-01'::DATE
),
(
  'Next.js App Router: What Changed and What Broke My Code',
  'A pragmatic guide to migrating from Pages Router to App Router — including the gotchas with data fetching, layouts, and server components.',
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
  'Frontend', '⚙️', 'linear-gradient(135deg,#43e97b22,#38f9d722)', 7, '2025-03-20'::DATE
),
(
  'TypeScript Patterns Every Full-Stack Developer Should Know',
  'From discriminated unions to generic fetch wrappers — the TypeScript patterns that cut bugs, accelerate onboarding, and cover your entire stack end-to-end.',
  '<h3>Why TypeScript Changed How I Build</h3>
<p>When I first adopted TypeScript on a large codebase at UST, I was skeptical — seemed like overhead. Six months later, I can''t imagine going back.</p>
<h3>The Patterns That Actually Matter</h3>
<ul>
  <li><strong>Define domain types first.</strong> Before writing a single component or API route, define <code>User</code>, <code>BlogPost</code>, <code>APIResponse&lt;T&gt;</code>. Everything flows from there.</li>
  <li><strong>Discriminated unions for state machines.</strong> Instead of three separate booleans (<code>isLoading</code>, <code>error</code>, <code>data</code>), use <code>type State = { status: ''idle'' } | { status: ''loading'' } | { status: ''error''; message: string } | { status: ''success''; data: T }</code>. No more impossible states.</li>
  <li><strong>Generic fetch wrappers.</strong> A single <code>fetchData&lt;T&gt;(url: string): Promise&lt;Result&lt;T&gt;&gt;</code> utility eliminates a whole category of runtime bugs across the codebase.</li>
  <li><strong>Strict mode always.</strong> <code>"strict": true</code> in <code>tsconfig.json</code> is non-negotiable on any project I start.</li>
</ul>
<h3>The Full-Stack Bonus</h3>
<p>With Next.js App Router and Supabase-generated types, TypeScript covers the entire vertical: DB schema → API route → server component → client component. A column rename in Postgres surfaces as a compile error all the way up the stack.</p>
<p><strong>Type safety is not a developer luxury — it is a product quality investment.</strong></p>',
  'Engineering', '🔷', 'linear-gradient(135deg,#a8edea22,#fed6e322)', 6, '2025-04-10'::DATE
),
(
  'Shipping 5 Side Projects: What I Learned',
  'CalCalorie, SwiftMedia, Faviconverter, SalaryWise, Task Manager — five shipped projects and the honest lessons behind each one.',
  '<h3>The Side-Project Theory</h3>
<p>Building side projects is how I learn fastest. No stakeholder pressure, no legacy constraints — just an idea, a self-imposed deadline, and the discipline to ship.</p>
<h3>Ship Small, Ship Often</h3>
<p><strong>SwiftMedia</strong> started as a weekend experiment: can I merge PDFs entirely in the browser? The first version had no UI polish — just working functionality. I shipped it on Sunday. Feedback came Monday. Iteration started Tuesday.</p>
<p><strong>Faviconverter</strong> was built in a single evening. The scope was ruthlessly small: one input (SVG file), one output (downloadable ICO). No feature creep, no settings screens. Scope discipline is a superpower.</p>
<h3>The SEO Lesson from CalCalorie</h3>
<p>CalCalorie is my most product-minded project. I spent as much time on structured data, sitemap generation, and Core Web Vitals as on the calculator logic itself. The result: organic traffic from month one, zero paid acquisition.</p>
<h3>What I Tell Myself Before Starting</h3>
<ul>
  <li>Define the MVP in one sentence. If you can''t, shrink the idea.</li>
  <li>Set a hard shipping deadline — I use weekends.</li>
  <li>Launch imperfect if needed. You can polish later, but you can''t learn from something that isn''t out there.</li>
</ul>
<p>The real value of side projects isn''t the projects themselves — it''s the compounding reps of going from zero to shipped.</p>',
  'Product', '🚀', 'linear-gradient(135deg,#ffecd222,#fcb69f22)', 5, '2025-05-02'::DATE
)
ON CONFLICT (title) DO NOTHING;

-- ══════════════════════════════════════════════════════════════
--  7. Seed — work_experience
-- ══════════════════════════════════════════════════════════════
INSERT INTO work_experience (role, company, location, period, bullets, display_order)
SELECT * FROM (VALUES

(
  'Software Engineer',
  'UST',
  'Hyderabad, India',
  'Sep 2024 – Present',
  ARRAY[
    'Developed <strong>modular health engagement components</strong> delivering personalised action plans and habit-building task systems for enterprise healthcare clients.',
    'Improved <strong>user engagement metrics by 85%</strong> through incentive-based behavioural tracking and data-driven UX optimisations.',
    'Built comprehensive <strong>analytics modules</strong> tracking user activity, communication flow, incentive distribution, and workflow statistics in real time.',
    'Engineered a <strong>stakeholder dashboard</strong> visualising incentive metrics, communication statistics, workflow efficiency, and insurance member tracking — boosting stakeholder value impact by <strong>90%</strong>.',
    'Reduced <strong>member discrepancies by 98%</strong> through structured monitoring and real-time metric visibility across the platform.',
    'Collaborated in <strong>Agile/Scrum teams</strong> to deliver scalable, healthcare-focused enterprise solutions on tight delivery cycles.'
  ],
  0
)
) AS v(role, company, location, period, bullets, display_order)
WHERE NOT EXISTS (SELECT 1 FROM work_experience LIMIT 1);

-- ══════════════════════════════════════════════════════════════
--  8. Seed — projects
-- ══════════════════════════════════════════════════════════════
INSERT INTO projects (icon, image_path, active, status_label, title, description, tags, display_order)
VALUES
('👗', '/projectImages/stylista-ai-logo.ico', TRUE, 'In Progress', 'Outfit Suggestor', 'Cross-platform AI-powered outfit recommendation app for Android & iOS with custom-trained fashion dataset integration and smooth animations.', ARRAY['React Native','Expo','AI/ML'], 0),
('🥗', '/projectImages/calcalorie-logo.ico', FALSE, 'Live', 'CalCalorie', 'Smart calorie calculator with SEO-optimised architecture, personalised computation, and a fast-loading responsive UI.', ARRAY['Next.js','TailwindCSS','SEO'], 1),
('📄', '/projectImages/swiftmedai-logo.ico', FALSE, 'Live', 'SwiftMedia', 'Fully client-side PDF tools (merge, compress, image-to-PDF). Zero backend costs, maximum privacy — runs entirely in the browser.', ARRAY['JavaScript','Browser APIs','PDF'], 2),
('🔷', '/projectImages/faviconverter-logo.ico', FALSE, 'Live', 'Faviconverter', 'Developer-focused SVG to ICO conversion tool generating favicon-ready formats, optimised for performance and SEO discoverability.', ARRAY['JavaScript','Node.js','Dev Tool'], 3),
('💰', '/projectImages/salarywise-logo.ico', FALSE, 'Live', 'SalaryWise', 'In-hand salary calculator with structured breakdown, tax estimation, and intuitive UI to improve financial clarity.', ARRAY['React.js','TailwindCSS'], 4),
('✅', '/projectImages/doit-io-logo.png', FALSE, 'Live', 'Task Manager', 'Scalable task and goal tracking web app with secure authentication and persistent state management via Supabase.', ARRAY['Next.js','Supabase','Zustand'], 5)
ON CONFLICT (title) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
--  Verify
-- ─────────────────────────────────────────────────────────────
SELECT 'blog_posts'    AS tbl, COUNT(*) FROM blog_posts
UNION ALL
SELECT 'work_experience', COUNT(*) FROM work_experience
UNION ALL
SELECT 'projects',        COUNT(*) FROM projects;
