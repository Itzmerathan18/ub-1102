'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEmergencyData } from '@/lib/api';
import { Heart, Droplets, AlertTriangle, Pill, Phone } from 'lucide-react';

export default function EmergencyViewPage() {
    const params = useParams();
    const token = params.token as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getEmergencyData(token)
            .then(res => setData(res.data))
            .catch(() => setError('Emergency access not found or inactive'))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><div className="spinner" /></div>;
    if (error) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 12 }}><AlertTriangle size={48} color="#f43f5e" /><p style={{ color: '#f43f5e', fontSize: 18 }}>{error}</p></div>;

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <span style={{ fontSize: 40 }}>🚨</span>
                <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 8 }}>Emergency Health Info</h1>
                {data?.name && <p style={{ fontSize: 18, color: 'var(--green-light)', fontWeight: 600, marginTop: 4 }}>{data.name}</p>}
                {(data?.age || data?.gender) && (
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                        {data.age && <span>{data.age} yrs</span>}
                        {data.age && data.gender && <span> • </span>}
                        {data.gender && <span>{data.gender}</span>}
                    </div>
                )}
            </div>

            {data?.bloodGroup && (
                <div className="section-card">
                    <h3><Droplets size={18} color="#f43f5e" /> Blood Group</h3>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#f43f5e' }}>{data.bloodGroup}</span>
                </div>
            )}

            {data?.allergies && data.allergies.length > 0 && (
                <div className="section-card">
                    <h3><AlertTriangle size={18} color="#f59e0b" /> Allergies</h3>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {data.allergies.map((a: string, i: number) => <span key={i} className="badge badge-rose">{a}</span>)}
                    </div>
                </div>
            )}

            {data?.chronicConditions && data.chronicConditions.length > 0 && (
                <div className="section-card">
                    <h3><Heart size={18} color="#3b82f6" /> Chronic Conditions</h3>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {data.chronicConditions.map((c: string, i: number) => <span key={i} className="badge badge-gold">{c}</span>)}
                    </div>
                </div>
            )}

            {data?.medications && data.medications.length > 0 && (
                <div className="section-card">
                    <h3><Pill size={18} color="#22c55e" /> Current Medications</h3>
                    {data.medications.map((m: any, i: number) => (
                        <div key={i} style={{ padding: '8px 0', borderBottom: i < data.medications.length - 1 ? '1px solid var(--border-color)' : 'none', fontSize: 14 }}>
                            <strong>{m.name}</strong> — {m.dosage} ({m.frequency})
                            <span className="badge badge-blue" style={{ marginLeft: 8, fontSize: 11 }}>{m.system}</span>
                        </div>
                    ))}
                </div>
            )}

            {data?.emergencyContacts && data.emergencyContacts.length > 0 && (
                <div className="section-card">
                    <h3><Phone size={18} color="#f59e0b" /> Emergency Contacts</h3>
                    {data.emergencyContacts.map((c: any, i: number) => (
                        <div key={i} style={{ padding: '8px 0', borderBottom: i < data.emergencyContacts.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                            <strong>{c.name}</strong> {c.relation && `(${c.relation})`}
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.phones?.join(', ')}</div>
                        </div>
                    ))}
                </div>
            )}

            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 20 }}>Powered by Jeevaloom 🌿</p>
        </div>
    );
}
