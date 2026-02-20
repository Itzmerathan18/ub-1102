'use client';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { useLang, type Lang } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';
import { Bell, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAlerts } from '@/lib/api';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { lang, setLang, t } = useLang();
    const { theme, toggleTheme } = useTheme();
    const [alertCount, setAlertCount] = useState(0);

    useEffect(() => {
        getAlerts().then(res => {
            const unread = (res.data || []).filter((a: any) => !a.isRead).length;
            setAlertCount(unread);
        }).catch(() => { });
    }, []);

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
                    </div>
                </header>
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
