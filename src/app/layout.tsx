import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import '../index.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'Grand Hotel Management System',
    description: 'AI-Powered Multi-Agent Hotel Management System - FYP Project',
    icons: {
        icon: '/grand-hotel-logo.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
