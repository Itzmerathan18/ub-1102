'use client';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { User, Mail, Globe } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const { t, lang, setLang } = useLang();

    return (
        <AppLayout>
            <div className="animate-in" style={{ maxWidth: 600, margin: '0 auto' }}>
                <div className="page-header">
                    <h1>👤 {t('profile')}</h1>
                </div>

                <div className="glass-card" style={{ padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #16a34a, #1d4ed8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 24, fontWeight: 800, color: 'white',
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#f0f7ff' }}>{user?.name}</div>
                            <div style={{ fontSize: 14, color: '#4a6480' }}>{user?.role}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', borderBottom: '1px solid #1a2d45' }}>
                            <Mail size={16} color="#94aec8" />
                            <div>
                                <div style={{ fontSize: 12, color: '#4a6480' }}>{t('email')}</div>
                                <div style={{ fontSize: 15, color: '#f0f7ff', fontWeight: 500 }}>{user?.email}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0' }}>
                            <Globe size={16} color="#94aec8" />
                            <div>
                                <div style={{ fontSize: 12, color: '#4a6480' }}>{t('language')}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                    {(['en', 'hi', 'kn'] as const).map(l => (
                                        <button key={l}
                                            className={`lang-btn ${lang === l ? 'active' : ''}`}
                                            onClick={() => setLang(l)}
                                            style={{ padding: '6px 16px', fontSize: 13 }}
                                        >
                                            {l === 'en' ? t('english') : l === 'hi' ? t('hindi') : t('kannada')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
