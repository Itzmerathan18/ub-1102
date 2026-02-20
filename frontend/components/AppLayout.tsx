'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !token) router.push('/login');
    }, [token, isLoading]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0f1e' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px', borderWidth: 3 }} />
                    <div style={{ color: '#475569', fontSize: 14 }}>Loading AyuRaksha...</div>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                            <input
                                placeholder="Search anything..."
                                className="input-field"
                                style={{ paddingLeft: 36, width: 240, background: 'rgba(15,23,42,0.6)' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link href="/alerts" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: 'rgba(15,23,42,0.6)', border: '1px solid #1e2a3a', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' }}>
                            <Bell size={17} />
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
