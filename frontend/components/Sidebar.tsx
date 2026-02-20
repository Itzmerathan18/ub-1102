'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { LayoutDashboard, Leaf, Stethoscope, Pill, FolderHeart, History, QrCode, Users, User, LogOut } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { t } = useLang();

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
        { href: '/ayurveda', icon: Leaf, label: t('ayurveda') },
        { href: '/english-medicine', icon: Stethoscope, label: t('english_medicine') },
        { href: '/medications', icon: Pill, label: t('medications') },
        { href: '/vault', icon: FolderHeart, label: t('medical_records') },
        { href: '/history', icon: History, label: t('history') },
        { href: '/emergency', icon: QrCode, label: t('emergency') },
        { href: '/caretakers', icon: Users, label: t('caretakers') },
        { href: '/profile', icon: User, label: t('profile') },
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="logo-icon">🌿</span>
                    <div>
                        <h1 className="logo-title">Jeevaloom</h1>
                        <p className="logo-subtitle">{t('tagline')}</p>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{user?.name?.[0] || 'U'}</div>
                    <div className="user-details">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-email">{user?.email || ''}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={16} />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </aside>
    );
}
