'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { sendOtp, verifyOtp } from '@/lib/api';
import { Shield, Phone, Key, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    async function handleSendOtp(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await sendOtp(phone);
            setSent(true);
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally { setLoading(false); }
    }

    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await verifyOtp(phone, otp);
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid OTP');
        } finally { setLoading(false); }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at 20% 20%, rgba(34,211,238,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.07) 0%, transparent 50%), #0a0f1e',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
            {/* Decorative bg circles */}
            <div style={{ position: 'fixed', top: '15%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.06), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '10%', right: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07), transparent)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 68, height: 68, borderRadius: 20,
                        background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 16px 48px rgba(34,211,238,0.25)'
                    }}>
                        <Shield size={32} color="white" />
                    </div>
                    <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 30, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.5px' }}>
                        AyuRaksha
                    </h1>
                    <p style={{ color: '#22d3ee', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
                        LifeVault
                    </p>
                    <p style={{ color: '#475569', fontSize: 14, marginTop: 10 }}>
                        Your integrative health command center
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: 32 }}>
                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6ff', marginBottom: 6 }}>Sign In</h2>
                            <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Enter your phone number to receive a one-time password</p>

                            <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Phone Number</label>
                            <div style={{ position: 'relative', marginBottom: 20 }}>
                                <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    className="input-field"
                                    style={{ paddingLeft: 38 }}
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f43f5e', marginBottom: 16 }}>{error}</div>}

                            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} type="submit" disabled={loading}>
                                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Send OTP</span><ArrowRight size={16} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6ff', marginBottom: 6 }}>Verify OTP</h2>
                            <p style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>OTP sent to <strong style={{ color: '#94a3b8' }}>{phone}</strong></p>
                            <p style={{ fontSize: 12, color: '#334155', marginBottom: 24 }}>Use <code style={{ background: '#1e2a3a', padding: '2px 6px', borderRadius: 4, color: '#22d3ee' }}>123456</code> for local development</p>

                            <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Enter OTP</label>
                            <div style={{ position: 'relative', marginBottom: 20 }}>
                                <Key size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    className="input-field"
                                    style={{ paddingLeft: 38, letterSpacing: 6, fontSize: 18, fontWeight: 700 }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="● ● ● ● ● ●"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </div>

                            {error && <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f43f5e', marginBottom: 16 }}>{error}</div>}

                            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginBottom: 12 }} type="submit" disabled={loading}>
                                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Verify & Sign In</span><ArrowRight size={16} /></>}
                            </button>
                            <button type="button" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep('phone')}>
                                ← Change number
                            </button>
                        </form>
                    )}
                </div>

                <p style={{ textAlign: 'center', color: '#1e3a5f', fontSize: 12, marginTop: 24 }}>
                    Secured with end-to-end encryption · AyuRaksha LifeVault
                </p>
            </div>
        </div>
    );
}
