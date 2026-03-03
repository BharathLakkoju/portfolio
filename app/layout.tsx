import type { Metadata } from 'next';
import { Syne, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-syne',
    display: 'swap',
});

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    style: ['normal', 'italic'],
    variable: '--font-dm-sans',
    display: 'swap',
});

const dmMono = DM_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    variable: '--font-dm-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Bharath Lakkoju — Full Stack & AI Engineer',
    description:
        'Full Stack Engineer building scalable web & mobile apps and AI-driven products. Turning complex problems into clean, fast, delightful experiences.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
        >
            <body>{children}</body>
        </html>
    );
}
