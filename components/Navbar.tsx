'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav
            id="navbar"
            className={[scrolled ? 'scrolled' : '', menuOpen ? 'menu-open' : '']
                .filter(Boolean)
                .join(' ')}
        >
            <div className="nav-logo">
                BL<span>.</span>
            </div>

            <div className="nav-links">
                <a href="#about" onClick={closeMenu}>About</a>
                <a href="#experience" onClick={closeMenu}>Experience</a>
                <a href="#projects" onClick={closeMenu}>Projects</a>
                <a href="#blog" onClick={closeMenu}>Blog</a>
                <a href="#contact" className="nav-cta" onClick={closeMenu}>Hire Me</a>
            </div>

            <button
                className="hamburger"
                aria-label="Toggle navigation menu"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <span />
                <span />
                <span />
            </button>
        </nav>
    );
}
