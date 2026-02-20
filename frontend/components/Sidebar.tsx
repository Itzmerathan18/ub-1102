'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    LayoutDashboard, Pill, FolderOpen, QrCode,
    User, Bell, Users, LogOut, Shield, Activity
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/medications', label: 'Medications', icon: Pill },
    { href: '/vault', label: 'Medical Vault', icon: FolderOpen },
    { href: '/emergency', label: 'Emergency QR', icon: QrCode },
    { href: '/profile', label: 'Health Profile', icon: User },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/caretakers', label: 'Caretakers', icon: Users },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Shield size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 16, color: '#f0f6ff', letterSpacing: '-0.3px' }}>
                            AyuRaksha
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>LifeVault</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: '12px 0', flex: 1 }}>
                <div style={{ padding: '0 12px 8px', fontSize: 11, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Navigation
                </div>
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className={`sidebar-nav-item ${pathname === href ? 'active' : ''}`}>
                        <Icon size={17} strokeWidth={pathname === href ? 2.2 : 1.8} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            {/* User info */}
            <div style={{ borderTop: '1px solid #1e2a3a', padding: '16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0
                    }}>
                        {user?.phone_number?.slice(-2) || '?'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.phone_number || 'User'}
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                </div>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 12px' }} onClick={logout}>
                    <LogOut size={15} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
