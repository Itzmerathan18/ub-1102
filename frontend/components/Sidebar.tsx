'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import JeevaloomLogo from './JeevaloomLogo';
import {
    LayoutDashboard, Leaf, Stethoscope, History,
    User, LogOut
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { t } = useLang();

    const navItems = [
        { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/ayurveda', label: t('ayurveda'), icon: Leaf, activeClass: 'ayurveda-active' },
        { href: '/english-medicine', label: t('english_medicine'), icon: Stethoscope, activeClass: 'medicine-active' },
        { href: '/history', label: t('history'), icon: History },
        { href: '/profile', label: t('profile'), icon: User },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <JeevaloomLogo size={36} />
                    <div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 16, color: '#f0f7ff', letterSpacing: '-0.3px' }}>
                            Jeevaloom
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#d97706', textTransform: 'uppercase' }}>
                            {t('tagline')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: '12px 0', flex: 1 }}>
                <div className="sidebar-section-label">Navigation</div>
                {navItems.map(({ href, label, icon: Icon, activeClass }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`sidebar-nav-item ${isActive(href) ? (activeClass || 'active') : ''}`}
                    >
                        <Icon size={17} strokeWidth={isActive(href) ? 2.2 : 1.8} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            {/* User info */}
            <div style={{ borderTop: '1px solid #1a2d45', padding: '16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #16a34a, #1d4ed8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0
                    }}>
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f7ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'User'}
                        </div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{user?.email}</div>
                    </div>
                </div>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 12px' }} onClick={logout}>
                    <LogOut size={15} />
                    {t('logout')}
                </button>
            </div>
        </aside>
    );
}
