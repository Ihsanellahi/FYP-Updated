import Link from 'next/link';
import { LOGO_NO_BG_SRC } from '@/constants/logos';

/** Navbar top-left logo — uses the transparent background version */
export default function Logo() {
    return (
        <Link href="/" className="inline-flex shrink-0 items-center">
            <img
                src={LOGO_NO_BG_SRC}
                alt="Grand Hotel"
                className="h-[96px] w-auto object-contain"
            />
        </Link>
    );
}
