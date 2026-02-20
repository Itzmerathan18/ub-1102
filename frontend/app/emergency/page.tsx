'use client';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import { getQrSettings, updateQrSettings, regenerateQrToken } from '@/lib/api';
import { QrCode, RefreshCw, Eye, Shield, Copy, Check } from 'lucide-react';

export default function EmergencyPage() {
    const { t } = useLang();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getQrSettings().then(res => setData(res.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const emergencyUrl = data ? `${window.location.origin}/emergency/${data.accessToken}` : '';

    const handleToggle = async (field: string, value: boolean) => {
        setSaving(true);
        await updateQrSettings({ [field]: value });
        setData({ ...data, [field]: value });
        setSaving(false);
    };

    const handleRegenerate = async () => {
        const res = await regenerateQrToken();
        setData(res.data);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(emergencyUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <AppLayout><div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div></AppLayout>;

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1><span className="gradient-text-green">{t('emergency_qr')}</span></h1>
                    <p>{t('qr_description')}</p>
                </div>

                <div className="grid-2">
                    {/* QR Card */}
                    <div className="section-card" style={{ textAlign: 'center' }}>
                        <div style={{ width: 200, height: 200, margin: '0 auto 20px', background: 'white', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Simple QR placeholder using the token */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(emergencyUrl)}`}
                                alt="Emergency QR Code"
                                style={{ width: 180, height: 180, borderRadius: 8 }}
                            />
                        </div>

                        <div style={{ marginBottom: 14 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('access_count')}: <strong style={{ color: 'var(--text-primary)' }}>{data?.accessCount || 0}</strong></span>
                        </div>

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn-primary" onClick={handleCopy}>
                                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                            </button>
                            <button className="btn-gold" onClick={handleRegenerate}><RefreshCw size={14} /> {t('regenerate')}</button>
                        </div>

                        {data?.isActive ? (
                            <span className="badge badge-green" style={{ marginTop: 12, display: 'inline-flex' }}><Eye size={12} /> Active</span>
                        ) : (
                            <span className="badge badge-rose" style={{ marginTop: 12, display: 'inline-flex' }}>Inactive</span>
                        )}
                    </div>

                    {/* Privacy Settings */}
                    <div className="section-card">
                        <h3><Shield size={18} color="#3b82f6" /> {t('privacy_settings')}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                            Control what information is visible when someone scans your emergency QR code.
                        </p>

                        {[
                            { field: 'isActive', label: 'Emergency Access Active', value: data?.isActive },
                            { field: 'showBloodGroup', label: t('show_blood_group'), value: data?.showBloodGroup },
                            { field: 'showAllergies', label: t('show_allergies'), value: data?.showAllergies },
                            { field: 'showChronicConditions', label: t('show_conditions'), value: data?.showChronicConditions },
                            { field: 'showMedications', label: t('show_medications'), value: data?.showMedications },
                        ].map(item => (
                            <div key={item.field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: 14 }}>{item.label}</span>
                                <label className="toggle">
                                    <input type="checkbox" checked={item.value ?? true} onChange={e => handleToggle(item.field, e.target.checked)} />
                                    <span className="toggle-slider" />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
