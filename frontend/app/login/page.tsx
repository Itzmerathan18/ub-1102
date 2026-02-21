'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { Mail, Lock, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { login as apiLogin } from '@/lib/api';
import JeevaloomLogo from '@/components/JeevaloomLogo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login, user, isLoading } = useAuth();
    const router = useRouter();
    const { t, lang, setLang } = useLang();

    // If already logged in, go straight to dashboard
    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/dashboard');
        }
    }, [user, isLoading, router]);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await apiLogin({ name, password });
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Show spinner while checking auth or if already logged in (redirecting)
    if (isLoading || user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060d1a' }}>
                <Loader2 size={40} style={{ color: '#22c55e', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at 20% 10%, rgba(22,163,74,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(29,78,216,0.07) 0%, transparent 50%), #060d1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
            {/* Ambient bg */}
            <div style={{ position: 'fixed', top: '5%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.05), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '5%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,78,216,0.05), transparent)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 14 }}>
                        <JeevaloomLogo size={52} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 28, fontWeight: 900, color: '#f0f7ff', letterSpacing: '-0.5px' }}>Jeevaloom</div>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#d97706', textTransform: 'uppercase' }}>{t('tagline')}</div>
                        </div>
                    </div>
                    <p style={{ color: '#4a6480', fontSize: 14 }}>{t('subtitle')}</p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: 32 }}>
                    {/* Lang switcher */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                        <div className="lang-switcher">
                            {(['en', 'hi', 'kn'] as const).map(l => (
                                <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                                    {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'ಕ'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f7ff', marginBottom: 6 }}>{t('login')}</h2>
                    <p style={{ fontSize: 13, color: '#4a6480', marginBottom: 24 }}>
                        {t('no_account')} <Link href="/register" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>{t('sign_up')}</Link>
                    </p>

                    <form onSubmit={handleLogin}>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#94aec8', display: 'block', marginBottom: 6 }}>{t('name')}</label>
                        <div style={{ position: 'relative', marginBottom: 16 }}>
                            <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6480' }} />
                            <input
                                className="input-field"
                                style={{ paddingLeft: 38 }}
                                type="text"
                                placeholder="Your full name"
                                contentEditable={true}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                        </div>

                        <label style={{ fontSize: 13, fontWeight: 500, color: '#94aec8', display: 'block', marginBottom: 6 }}>{t('password')}</label>
                        <div style={{ position: 'relative', marginBottom: 20 }}>
                            <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6480' }} />
                            <input
                                className="input-field"
                                style={{ paddingLeft: 38 }}
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f43f5e', marginBottom: 16 }}>
                                {error}
                            </div>
                        )}

                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} type="submit" disabled={loading}>
                            {loading
                                ? <span className="spinner" style={{ width: 18, height: 18 }} />
                                : <><span>{t('sign_in')}</span><ArrowRight size={15} /></>
                            }
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: '#1a2d45', fontSize: 12, marginTop: 20 }}>
                    Jeevaloom · Secured with end-to-end encryption
                </p>
            </div>
        </div>
    );
}
