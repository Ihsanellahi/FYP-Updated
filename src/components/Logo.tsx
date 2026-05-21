import { Link } from 'react-router-dom';

export const LOGO_SRC = '/grand-hotel-logo.png';

/** Top-left header logo only — rest of the layout stays unchanged */
export default function Logo() {
    return (
        <Link to="/" className="inline-flex shrink-0">
            <img
                src={LOGO_SRC}
                alt="Grand Hotel"
                className="h-10 w-auto object-contain"
            />
        </Link>
    );
}
