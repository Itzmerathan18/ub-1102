// Jeevaloom SVG Logo Component
export default function JeevaloomLogo({ size = 44 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Dark rounded square background */}
            <rect width="44" height="44" rx="12" fill="url(#bgGrad)" />

            {/* Leaf shape (Ayurveda - green) */}
            <path
                d="M14 28 C14 20 20 12 22 12 C24 12 30 20 30 28 C30 28 26 24 22 26 C18 24 14 28 14 28Z"
                fill="url(#leafGrad)"
                opacity="0.95"
            />

            {/* Medical cross (Modern medicine - blue) */}
            <rect x="19" y="18" width="6" height="14" rx="2" fill="url(#crossGrad)" opacity="0.92" />
            <rect x="15" y="22" width="14" height="6" rx="2" fill="url(#crossGrad)" opacity="0.92" />

            {/* Neural arc (AI/connection - gold) */}
            <path
                d="M10 34 Q22 30 34 34"
                stroke="url(#goldGrad)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.85"
            />
            <circle cx="10" cy="34" r="1.5" fill="#d97706" opacity="0.9" />
            <circle cx="34" cy="34" r="1.5" fill="#d97706" opacity="0.9" />

            <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="44" y2="44">
                    <stop offset="0%" stopColor="#0f2518" />
                    <stop offset="100%" stopColor="#0c1a30" />
                </linearGradient>
                <linearGradient id="leafGrad" x1="14" y1="12" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="crossGrad" x1="15" y1="18" x2="29" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="10" y1="34" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
            </defs>
        </svg>
    );
}
