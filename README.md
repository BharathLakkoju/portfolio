# Bharath Lakkoju — Portfolio Website

A responsive, single-file portfolio with a live Supabase-powered blog.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire portfolio — open in any browser |
| `schema.sql` | Supabase table definition + 4 seed blog posts |

---

## Quick Start (no Supabase)

Just open `index.html` in your browser. The blog loads 4 built-in posts as a fallback. Everything works offline.

---

## Activating Supabase Blog

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) → New Project.

### 2. Run the schema
Open **SQL Editor** in your Supabase dashboard, paste the contents of `schema.sql`, and click **Run**. This creates the `blog_posts` table and seeds 4 sample posts.

### 3. Get your credentials
In your Supabase dashboard: **Settings → API**
- Copy **Project URL** (looks like `https://abcdef.supabase.co`)
- Copy **anon / public** key

### 4. Update `index.html`
Find these two lines near the bottom of `index.html`:

```js
const SUPABASE_URL    = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

Replace with your actual values. Save and refresh — blogs now load live from Supabase.

---

## Adding New Blog Posts

Option A — Supabase Table Editor (easiest):
1. Open your project → **Table Editor → blog_posts**
2. Click **Insert row**
3. Fill in: `title`, `excerpt`, `content` (HTML), `category`, `emoji`, `gradient`, `read_time`, `published_at`
4. Set `published = true`
5. Refresh your portfolio — the new post appears instantly.

Option B — SQL:
```sql
INSERT INTO blog_posts (title, excerpt, content, category, emoji, read_time, published_at)
VALUES ('My New Post', 'Short summary...', '<p>Full HTML content...</p>', 'Engineering', '🚀', 5, NOW());
```

---

## Deploying

**Vercel (recommended):**
```bash
npx vercel --prod
# or just drag the portfolio/ folder into vercel.com
```

**Netlify:**
Drag and drop the `portfolio/` folder at app.netlify.com.

**GitHub Pages:**
Push to a repo → Settings → Pages → deploy from `main` branch.

---

## Personalisation Checklist

- [ ] Replace `yourmail@email.com` with your actual email
- [ ] Update GitHub, LinkedIn, Portfolio links in the nav CTA and contact section
- [ ] Add your Supabase credentials
- [ ] Swap project links with real URLs
- [ ] Update the footer year if needed
