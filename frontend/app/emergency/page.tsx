'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { getQrSettings, updateQrSettings, regenerateQrToken } from '@/lib/api';
import { QrCode, RefreshCw, Eye, EyeOff, Shield, Activity, Clock, Hash } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function EmergencyPage() {
    const qc = useQueryClient();
    const [regenerating, setRegenerating] = useState(false);
    const { data: qr, isLoading } = useQuery({ queryKey: ['qr'], queryFn: () => getQrSettings().then(r => r.data) });

    const updateMut = useMutation({
        mutationFn: updateQrSettings,
        onMutate: async (newData) => {
            await qc.cancelQueries({ queryKey: ['qr'] });
            const prev = qc.getQueryData(['qr']);
            qc.setQueryData(['qr'], (old: any) => ({ ...old, ...newData }));
            return { prev };
        },
        onError: (_e, _v, ctx) => qc.setQueryData(['qr'], ctx?.prev),
        onSettled: () => qc.invalidateQueries({ queryKey: ['qr'] }),
    });

    const handleRegenerate = async () => {
        if (!confirm('Regenerate QR token? The old QR code will stop working.')) return;
        setRegenerating(true);
        try { await regenerateQrToken(); qc.invalidateQueries({ queryKey: ['qr'] }); }
        finally { setRegenerating(false); }
    };

    const emergencyUrl = typeof window !== 'undefined' && qr?.accessToken
        ? `${window.location.origin}/emergency/${qr.accessToken}`
        : '';

    const toggleField = (field: string, value: boolean) => updateMut.mutate({ [field]: value });

    const privacyToggles = [
        { key: 'showBloodGroup', label: 'Blood Group', icon: '🩸' },
        { key: 'showAllergies', label: 'Allergies', icon: '⚠️' },
        { key: 'showChronicConditions', label: 'Chronic Conditions', icon: '📋' },
        { key: 'showMedications', label: 'Active Medications', icon: '💊' },
    ];

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1>Emergency QR</h1>
                    <p>Allow first responders to access your critical health info via QR scan</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
                    {/* QR Card */}
                    <div>
                        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                                <Shield size={18} color="#22d3ee" />
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>Emergency Access QR</span>
                            </div>

                            {isLoading ? (
                                <div className="spinner" style={{ margin: '40px auto' }} />
                            ) : qr?.isActive && emergencyUrl ? (
                                <div className="qr-container" style={{ display: 'inline-flex', padding: 20, borderRadius: 16 }}>
                                    <QRCodeSVG value={emergencyUrl} size={200} level="H" includeMargin />
                                </div>
                            ) : (
                                <div style={{ width: 240, height: 240, margin: '0 auto', background: '#1e2a3a', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <EyeOff size={32} color="#334155" style={{ margin: '0 auto 8px', display: 'block' }} />
                                        <div style={{ fontSize: 13, color: '#334155' }}>QR Disabled</div>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                                    <label className="toggle">
                                        <input type="checkbox" checked={qr?.isActive || false} onChange={e => toggleField('isActive', e.target.checked)} />
                                        <span className="toggle-slider" />
                                    </label>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: qr?.isActive ? '#22d3ee' : '#475569' }}>
                                        {qr?.isActive ? '✓ QR Active' : 'QR Disabled'}
                                    </span>
                                </div>

                                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRegenerate} disabled={regenerating}>
                                    <RefreshCw size={14} style={{ animation: regenerating ? 'spin 1s linear infinite' : 'none' }} />
                                    {regenerating ? 'Regenerating...' : 'Regenerate Token'}
                                </button>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
                                <div style={{ padding: '12px', background: 'rgba(15,23,42,0.6)', borderRadius: 10, border: '1px solid #1e2a3a' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <Activity size={12} color="#22d3ee" />
                                        <span style={{ fontSize: 11, color: '#475569' }}>Scanned</span>
                                    </div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f6ff' }}>{qr?.accessCount || 0}</div>
                                </div>
                                <div style={{ padding: '12px', background: 'rgba(15,23,42,0.6)', borderRadius: 10, border: '1px solid #1e2a3a' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <Clock size={12} color="#8b5cf6" />
                                        <span style={{ fontSize: 11, color: '#475569' }}>Last Scan</span>
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
                                        {qr?.lastAccessed ? new Date(qr.lastAccessed).toLocaleDateString() : 'Never'}
                                    </div>
                                </div>
                            </div>

                            {qr?.accessToken && (
                                <div style={{ marginTop: 16, padding: '10px', background: 'rgba(15,23,42,0.6)', borderRadius: 10, border: '1px solid #1e2a3a' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <Hash size={11} color="#475569" />
                                        <span style={{ fontSize: 11, color: '#475569' }}>Token</span>
                                    </div>
                                    <code style={{ fontSize: 11, color: '#334155', wordBreak: 'break-all' }}>{qr.accessToken}</code>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                        <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f6ff', marginBottom: 6 }}>Privacy Controls</h3>
                            <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Choose what information is visible when your QR is scanned</p>

                            {privacyToggles.map(({ key, label, icon }) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #1e2a3a' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 20 }}>{icon}</span>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{label}</div>
                                            <div style={{ fontSize: 12, color: '#475569' }}>Show {label.toLowerCase()} to first responders</div>
                                        </div>
                                    </div>
                                    <label className="toggle">
                                        <input type="checkbox" checked={qr?.[key] || false} onChange={e => toggleField(key, e.target.checked)} />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Emergency URL preview */}
                        {emergencyUrl && (
                            <div className="glass-card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Eye size={16} color="#22d3ee" /> Public Emergency URL
                                </h3>
                                <div style={{ padding: '12px 16px', background: 'rgba(15,23,42,0.6)', borderRadius: 10, border: '1px solid #1e2a3a', wordBreak: 'break-all' }}>
                                    <a href={emergencyUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#22d3ee', textDecoration: 'none' }}>
                                        {emergencyUrl}
                                    </a>
                                </div>
                                <p style={{ fontSize: 12, color: '#475569', marginTop: 10 }}>
                                    This page is publicly accessible. Anyone who scans your QR code will see the information you've enabled above.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
