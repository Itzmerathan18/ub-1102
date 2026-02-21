'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { login as apiLogin } from '@/lib/api';
import { Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import JeevaloomLogo from '@/components/JeevaloomLogo';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const { t, lang, setLang } = useLang();
    const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload =
                loginMode === 'phone'
                    ? { phone: phone.replace(/[\s\-]/g, ''), password }
                    : { email, password };
            const res = await apiLogin(payload);
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
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

                    {/* Email / Phone toggle */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
                        <button
                            type="button"
                            onClick={() => { setLoginMode('email'); setError(''); }}
                            style={{
                                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                                background: loginMode === 'email' ? 'rgba(34,197,94,0.15)' : 'transparent',
                                color: loginMode === 'email' ? '#22c55e' : '#4a6480',
                            }}
                        >
                            <Mail size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            {t('login_with_email')}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setLoginMode('phone'); setError(''); }}
                            style={{
                                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                                background: loginMode === 'phone' ? 'rgba(34,197,94,0.15)' : 'transparent',
                                color: loginMode === 'phone' ? '#22c55e' : '#4a6480',
                            }}
                        >
                            <Phone size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            {t('login_with_phone')}
                        </button>
                    </div>

                    <form onSubmit={handleLogin}>
                        {loginMode === 'email' ? (
                            <>
                                <label style={{ fontSize: 13, fontWeight: 500, color: '#94aec8', display: 'block', marginBottom: 6 }}>{t('email')}</label>
                                <div style={{ position: 'relative', marginBottom: 16 }}>
                                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6480' }} />
                                    <input
                                        className="input-field"
                                        style={{ paddingLeft: 38 }}
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <label style={{ fontSize: 13, fontWeight: 500, color: '#94aec8', display: 'block', marginBottom: 6 }}>{t('mobile_number')}</label>
                                <div style={{ position: 'relative', marginBottom: 16 }}>
                                    <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6480' }} />
                                    <input
                                        className="input-field"
                                        style={{ paddingLeft: 38 }}
                                        type="tel"
                                        placeholder={t('phone_placeholder')}
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required
                                        autoComplete="tel"
                                    />
                                </div>
                            </>
                        )}

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
