export default function Contact() {
    return (
        <section id="contact">
            <div className="section-label">Contact</div>
            <div className="section-title">
                Let&apos;s build something
                <br />
                great together
            </div>
            <p>
                Open to Full Stack, AI Engineer, SDE-1/SDE-2 opportunities. I respond
                within 24 hours.
            </p>
            <div className="contact-links">
                <a href="mailto:yourmail@email.com" className="contact-link primary">
                    ✉ Send Email
                </a>
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                >
                    in LinkedIn
                </a>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                >
                    ⌥ GitHub
                </a>
                <a href="#" className="contact-link">
                    🌐 Portfolio
                </a>
            </div>
        </section>
    );
}
