'use client';
import { useEffect, useState } from 'react';
import { getEmergencyData } from '@/lib/api';
import { Shield, Droplets, AlertTriangle, Activity, Phone, Pill } from 'lucide-react';

export default function PublicEmergencyPage({ params }: { params: { token: string } }) {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEmergencyData(params.token)
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.error || 'Not found'))
            .finally(() => setLoading(false));
    }, [params.token]);

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <AlertTriangle size={40} color="#f43f5e" />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f6ff' }}>Access Not Found</div>
            <div style={{ fontSize: 14, color: '#475569' }}>{error}</div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: 20 }}>
            {/* Header */}
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', padding: '32px 0 28px', borderBottom: '1px solid #1e2a3a', marginBottom: 28 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 16px 48px rgba(244,63,94,0.25)' }}>
                        <Shield size={28} color="white" />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#f43f5e', textTransform: 'uppercase', marginBottom: 8 }}>🚨 Medical Emergency</div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f0f6ff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{data?.name || 'Patient'}</h1>
                    <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>AyuRaksha LifeVault · Emergency Information</p>
                </div>

                {/* Blood Group */}
                {data?.bloodGroup && (
                    <div style={{ padding: '20px 24px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Droplets size={24} color="#f43f5e" />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: 1 }}>Blood Group</div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: '#f0f6ff', fontFamily: 'Plus Jakarta Sans', lineHeight: 1.1 }}>{data.bloodGroup}</div>
                        </div>
                    </div>
                )}

                {/* Allergies */}
                {data?.allergies && data.allergies.length > 0 && (
                    <div style={{ padding: '20px 24px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 16, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <AlertTriangle size={16} color="#f59e0b" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 1 }}>⚠️ Allergies</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {data.allergies.map((a: string, i: number) => (
                                <span key={i} style={{ padding: '5px 14px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>{a}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chronic Conditions */}
                {data?.chronicConditions && data.chronicConditions.length > 0 && (
                    <div style={{ padding: '20px 24px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Activity size={16} color="#8b5cf6" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1 }}>Chronic Conditions</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {data.chronicConditions.map((c: string, i: number) => (
                                <span key={i} style={{ padding: '5px 14px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#8b5cf6' }}>{c}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Medications */}
                {data?.medications && data.medications.length > 0 && (
                    <div style={{ padding: '20px 24px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Pill size={16} color="#3b82f6" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 1 }}>Current Medications</span>
                        </div>
                        {data.medications.map((m: any, i: number) => (
                            <div key={i} style={{ padding: '10px 14px', background: 'rgba(15,23,42,0.5)', borderRadius: 10, marginBottom: 8 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{m.name}</div>
                                <div style={{ fontSize: 12, color: '#475569' }}>{m.dosage && `${m.dosage} ·`} {m.frequency} · {m.system}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Emergency Contacts */}
                {data?.emergencyContacts && data.emergencyContacts.length > 0 && (
                    <div style={{ padding: '20px 24px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Phone size={16} color="#10b981" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: 1 }}>Emergency Contacts</span>
                        </div>
                        {data.emergencyContacts.map((c: any, i: number) => (
                            <div key={i} style={{ padding: '10px 14px', background: 'rgba(15,23,42,0.5)', borderRadius: 10, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{c.name}</div>
                                    <div style={{ fontSize: 12, color: '#475569' }}>{c.relation}</div>
                                </div>
                                {c.phones?.map((p: string) => (
                                    <a key={p} href={`tel:${p}`} style={{ fontSize: 14, fontWeight: 700, color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Phone size={14} /> {p}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 28, padding: '16px', color: '#334155', fontSize: 12 }}>
                    Powered by AyuRaksha LifeVault · Emergency Access System
                </div>
            </div>
        </div>
    );
}
