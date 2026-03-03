const skills = [
    'TypeScript', 'React.js', 'Next.js', 'React Native',
    'Node.js', 'Express.js', 'Supabase', 'PostgreSQL',
    'TailwindCSS', 'Docker', 'Zustand', 'Vercel',
];

const stack = [
    { label: 'Primary Stack', value: 'React · Next.js · Node · Supabase' },
    { label: 'Mobile', value: 'React Native (Expo) · iOS & Android' },
    { label: 'AI / ML', value: 'Custom Dataset Training · AI App Development' },
    { label: 'Currently Building', value: 'Outfit Suggestor — AI Fashion App' },
];

export default function About() {
    return (
        <section id="about">
            <div className="section-label">About Me</div>
            <div className="section-title">
                Crafting digital
                <br />
                experiences that matter
            </div>

            <div className="about-grid reveal">
                <div className="about-text">
                    <p>
                        I&apos;m a <strong>Software Engineer based in Hyderabad, India</strong> with a
                        passion for building high-performance, user-centric applications.
                        Currently at <strong>UST</strong>, I architect enterprise healthcare platforms
                        that make a real difference.
                    </p>
                    <p>
                        My sweet spot is the intersection of{' '}
                        <strong>thoughtful engineering and great UX</strong> — from building modular
                        component systems to designing analytics dashboards that drive
                        decisions. I&apos;m actively exploring{' '}
                        <strong>AI/ML integration</strong> into production apps.
                    </p>
                    <p>
                        B.Tech in Information Technology from{' '}
                        <strong>MVGR College of Engineering</strong> (2020–2024).
                    </p>
                    <div className="skill-grid">
                        {skills.map((skill) => (
                            <span key={skill} className="skill-chip">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="about-stack">
                    {stack.map((item) => (
                        <div key={item.label} className="stack-item">
                            <div className="stack-item-label">{item.label}</div>
                            <div className="stack-item-value">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
