'use client';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { useLang, type Lang } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';
import { Bell, Sun, Moon, Loader2, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getAlerts } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { lang, setLang, t } = useLang();
    const { theme, toggleTheme } = useTheme();
    const [alertCount, setAlertCount] = useState(0);
    // Track if we've already decided to redirect, to avoid double-redirects
    const redirected = useRef(false);

    useEffect(() => {
        if (!isLoading && !user && !redirected.current) {
            redirected.current = true;
            router.replace('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            redirected.current = false; // reset on login
            getAlerts().then(res => {
                const unread = (res.data || []).filter((a: any) => !a.isRead).length;
                setAlertCount(unread);
            }).catch(() => { });
        }
    }, [user]);

    // Show spinner while loading auth state OR while waiting for user to be set
    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060d1a' }}>
                <Loader2 size={40} style={{ color: '#22c55e', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    // Not logged in — render nothing while redirect happens
    if (!user) return null;

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-panel">
                <header className="top-header">
                    <div className="header-left">
                        <h2 className="header-brand">Jeevaloom</h2>
                    </div>
                    <div className="header-right">
                        {/* Language Dropdown */}
                        <select
                            className="lang-select"
                            value={lang}
                            onChange={(e) => setLang(e.target.value as Lang)}
                        >
                            <option value="en">🌐 English</option>
                            <option value="hi">🌐 हिंदी</option>
                            <option value="kn">🌐 ಕನ್ನಡ</option>
                        </select>

                        {/* Theme Toggle */}
                        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? t('light_mode') : t('dark_mode')}>
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Alerts Bell */}
                        <a href="/alerts" className="alert-bell">
                            <Bell size={18} />
                            {alertCount > 0 && <span className="alert-badge">{alertCount}</span>}
                        </a>

                        {/* Profile Link */}
                        <Link href="/profile" className="profile-icon-link" style={{
                            width: 34, height: 34, borderRadius: '50%', background: 'rgba(34,197,94,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34,197,94,0.2)',
                            color: '#22c55e', marginLeft: 8
                        }}>
                            <User size={18} />
                        </Link>
                    </div>
                </header>
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
