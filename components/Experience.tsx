import { getSupabaseClient } from '@/lib/supabase';
import type { WorkExperience } from '@/types';

// Fallback in case Supabase isn't yet configured
const STATIC_EXPERIENCE: WorkExperience[] = [
    {
        id: 0,
        role: 'Software Engineer',
        company: 'UST',
        location: 'Hyderabad, India',
        period: 'Sep 2024 – Present',
        bullets: [
            'Developed <strong>modular health engagement components</strong> delivering personalised action plans and habit-building task systems for enterprise healthcare clients.',
            'Improved <strong>user engagement metrics by 85%</strong> through incentive-based behavioural tracking and data-driven UX optimisations.',
            'Built comprehensive <strong>analytics modules</strong> tracking user activity, communication flow, incentive distribution, and workflow statistics in real time.',
            'Engineered a <strong>stakeholder dashboard</strong> visualising incentive metrics, communication statistics, workflow efficiency, and insurance member tracking — boosting stakeholder value impact by <strong>90%</strong>.',
            'Reduced <strong>member discrepancies by 98%</strong> through structured monitoring and real-time metric visibility across the platform.',
            'Collaborated in <strong>Agile/Scrum teams</strong> to deliver scalable, healthcare-focused enterprise solutions on tight delivery cycles.',
        ],
        display_order: 0,
    },
];

async function fetchExperience(): Promise<WorkExperience[]> {
    const sb = getSupabaseClient();
    if (!sb) return STATIC_EXPERIENCE;
    const { data, error } = await sb
        .from('work_experience')
        .select('*')
        .order('display_order', { ascending: true });
    if (error || !data || data.length === 0) return STATIC_EXPERIENCE;
    return data as WorkExperience[];
}

export default async function Experience() {
    const experiences = await fetchExperience();

    return (
        <section id="experience">
            <div className="section-label">Experience</div>
            <div className="section-title">Where I&apos;ve shipped</div>

            {experiences.map((exp) => (
                <div key={exp.id} className="exp-card reveal">
                    <div className="exp-header">
                        <div>
                            <div className="exp-role">{exp.role}</div>
                            <div className="exp-company">
                                {exp.company}
                                {exp.location ? ` — ${exp.location}` : ''}
                            </div>
                        </div>
                        <div className="exp-period">{exp.period}</div>
                    </div>
                    <ul className="exp-bullets">
                        {exp.bullets.map((bullet, i) => (
                            /* Content is admin-authored HTML — safe to render */
                            <li
                                key={i}
                                dangerouslySetInnerHTML={{ __html: bullet }}
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}
