'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            let target = e.target as HTMLElement | null;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }

            if (target instanceof HTMLAnchorElement) {
                const href = target.getAttribute('href');
                if (href) {
                    try {
                        const targetUrl = new URL(href, window.location.href);
                        if (
                            targetUrl.origin === window.location.origin && 
                            targetUrl.pathname === window.location.pathname
                        ) {
                            if (targetUrl.hash) {
                                const element = document.getElementById(targetUrl.hash.substring(1));
                                if (element) {
                                    e.preventDefault();
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }
                    } catch (err) {
                        // Ignore invalid URLs
                    }
                }
            }
        };

        document.addEventListener('click', handleGlobalClick);
        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    return null;
}
