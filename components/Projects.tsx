import { getSupabaseClient } from '@/lib/supabase';
import Image from 'next/image';
import type { Project } from '@/types';

const STATIC_PROJECTS: Project[] = [
    { id: 0, icon: '👗', image_path: '/projectImages/stylista-ai-logo.ico', active: true, status_label: 'In Progress', title: 'Outfit Suggestor', description: 'Cross-platform AI-powered outfit recommendation app for Android & iOS with custom-trained fashion dataset integration and smooth animations.', tags: ['React Native', 'Expo', 'AI/ML'], display_order: 0 },
    { id: 1, icon: '🥗', image_path: '/projectImages/calcalorie-logo.ico', active: false, status_label: 'Live', title: 'CalCalorie', description: 'Smart calorie calculator with SEO-optimised architecture, personalised computation, and a fast-loading responsive UI.', tags: ['Next.js', 'TailwindCSS', 'SEO'], display_order: 1 },
    { id: 2, icon: '📄', image_path: '/projectImages/swiftmedai-logo.ico', active: false, status_label: 'Live', title: 'SwiftMedia', description: 'Fully client-side PDF tools (merge, compress, image-to-PDF). Zero backend costs, maximum privacy — runs entirely in the browser.', tags: ['JavaScript', 'Browser APIs', 'PDF'], display_order: 2 },
    { id: 3, icon: '🔷', image_path: '/projectImages/faviconverter-logo.ico', active: false, status_label: 'Live', title: 'Faviconverter', description: 'Developer-focused SVG to ICO conversion tool generating favicon-ready formats, optimised for performance and SEO discoverability.', tags: ['JavaScript', 'Node.js', 'Dev Tool'], display_order: 3 },
    { id: 4, icon: '💰', image_path: '/projectImages/salarywise-logo.ico', active: false, status_label: 'Live', title: 'SalaryWise', description: 'In-hand salary calculator with structured breakdown, tax estimation, and intuitive UI to improve financial clarity.', tags: ['React.js', 'TailwindCSS'], display_order: 4 },
    { id: 5, icon: '✅', image_path: '/projectImages/doit-io-logo.png', active: false, status_label: 'Live', title: 'Task Manager', description: 'Scalable task and goal tracking web app with secure authentication and persistent state management via Supabase.', tags: ['Next.js', 'Supabase', 'Zustand'], display_order: 5 },
];

async function fetchProjects(): Promise<Project[]> {
    const sb = getSupabaseClient();
    if (!sb) return STATIC_PROJECTS;
    const { data, error } = await sb
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
    if (error || !data || data.length === 0) return STATIC_PROJECTS;
    return data as Project[];
}

export default async function Projects() {
    const projects = await fetchProjects();

    return (
        <section id="projects">
            <div className="section-label">Projects</div>
            <div className="section-title">Things I&apos;ve built</div>

            <div className="projects-grid" id="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card reveal">
                        <div className="project-arrow">↗</div>
                        <div className="project-icon">
                            {project.image_path ? (
                                <Image
                                    src={project.image_path}
                                    alt={project.title}
                                    width={48}
                                    height={48}
                                    className="project-image"
                                    priority={false}
                                />
                            ) : (
                                project.icon
                            )}
                        </div>
                        <div
                            className={`project-status${project.active ? ' active' : ''
                                }`}
                        >
                            {project.status_label}
                        </div>
                        <div className="project-title">{project.title}</div>
                        <div className="project-desc">{project.description}</div>
                        <div className="project-tags">
                            {project.tags.map((tag) => (
                                <span key={tag} className="project-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
