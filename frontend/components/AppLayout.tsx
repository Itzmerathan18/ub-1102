'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { token, isLoading } = useAuth();
    const { lang, setLang } = useLang();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !token) router.push('/login');
    }, [token, isLoading]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#060d1a' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px', borderWidth: 3 }} />
                    <div style={{ color: '#475569', fontSize: 14 }}>Loading Jeevaloom...</div>
                </div>
            </div>
        );
    }

    if (!token) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div className="main-layout">
                {/* Header */}
                <header className="top-header">
                    <div style={{ fontSize: 13, color: '#4a6480', fontWeight: 500 }}>
                        🌿 Jeevaloom — Your Integrative Health Platform
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="lang-switcher">
                            {(['en', 'hi', 'kn'] as const).map(l => (
                                <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                                    {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'ಕ'}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
