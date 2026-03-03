export default function Hero() {
    return (
        <section id="hero">
            <div className="hero-bg-blob" />

            <div className="hero-left">
                <div className="hero-tag">Open to SDE-1 / SDE-2 / AI Roles</div>
                <h1 className="hero-name">
                    Bharath
                    <br />
                    <span className="line2">Lakkoju</span>
                </h1>
                <p className="hero-sub">
                    Full Stack Engineer building{' '}
                    <strong>scalable web &amp; mobile apps</strong> and AI-driven
                    products. Turning complex problems into clean, fast, delightful
                    experiences.
                </p>
                <div className="hero-metrics">
                    <div className="metric">
                        <div className="metric-num">
                            85<span>%</span>
                        </div>
                        <div className="metric-label">Engagement Lift</div>
                    </div>
                    <div
                        className="metric"
                        style={{ borderLeft: '1px solid var(--border)', paddingLeft: '28px' }}
                    >
                        <div className="metric-num">
                            90<span>%</span>
                        </div>
                        <div className="metric-label">Stakeholder Value</div>
                    </div>
                    <div
                        className="metric"
                        style={{ borderLeft: '1px solid var(--border)', paddingLeft: '28px' }}
                    >
                        <div className="metric-num">
                            98<span>%</span>
                        </div>
                        <div className="metric-label">Error Reduction</div>
                    </div>
                </div>
                <div className="hero-actions">
                    <a href="#projects" className="btn-primary">
                        View My Work ↓
                    </a>
                    <a href="#contact" className="btn-outline">
                        Get In Touch
                    </a>
                </div>
            </div>

            <div className="hero-right">
                <div className="avatar-wrap">
                    <div className="avatar-frame">BL</div>
                    <div className="avatar-badge">
                        <div className="badge-dot" />
                        <div className="badge-text">Available for Work</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
