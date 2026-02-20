'use client';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import { getAyurvedaHistory, getHealthHistory, getMedications, getAlerts, getProfile } from '@/lib/api';
import Link from 'next/link';
import { Leaf, Stethoscope, Pill, FolderHeart, QrCode, Users, Activity, Droplets, Heart, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useLang();
    const [stats, setStats] = useState({ assessments: 0, meds: 0, alerts: 0 });
    const [profile, setProfile] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        Promise.allSettled([
            getAyurvedaHistory(),
            getHealthHistory(),
            getMedications(true),
            getAlerts(),
            getProfile(),
        ]).then(([ayur, health, meds, alerts, prof]) => {
            const ayurData = ayur.status === 'fulfilled' ? ayur.value.data : [];
            const healthData = health.status === 'fulfilled' ? health.value.data : [];
            const medsData = meds.status === 'fulfilled' ? meds.value.data : [];
            const alertsData = alerts.status === 'fulfilled' ? alerts.value.data : [];
            const profData = prof.status === 'fulfilled' ? prof.value.data : null;

            setStats({
                assessments: ayurData.length + healthData.length,
                meds: medsData.length,
                alerts: alertsData.filter((a: any) => !a.isRead).length,
            });
            setProfile(profData);

            const activity: any[] = [];
            ayurData.slice(0, 3).forEach((a: any) => activity.push({ type: 'ayurveda', label: `Dosha: ${a.result}`, date: a.createdAt }));
            healthData.slice(0, 3).forEach((a: any) => activity.push({ type: 'health', label: `BMI: ${a.bmi?.toFixed(1)} — ${a.riskLevel}`, date: a.createdAt }));
            activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentActivity(activity.slice(0, 5));
        });
    }, []);

    const actionCards = [
        { href: '/ayurveda', icon: Leaf, title: t('ayurveda'), desc: 'Dosha assessment & personalized Ayurvedic recommendations', color: 'green' },
        { href: '/english-medicine', icon: Stethoscope, title: t('english_medicine'), desc: 'BMI calculator, lifestyle risk analysis & wellness tips', color: 'blue' },
        { href: '/medications', icon: Pill, title: t('medications'), desc: 'Track your medicines, dosages and refill reminders', color: 'gold' },
        { href: '/vault', icon: FolderHeart, title: t('medical_records'), desc: 'Upload and manage medical reports with AI summaries', color: 'emerald' },
        { href: '/emergency', icon: QrCode, title: t('emergency'), desc: 'Generate emergency QR for instant access to vitals', color: 'rose' },
        { href: '/caretakers', icon: Users, title: t('caretakers'), desc: 'Invite family or caregivers with controlled permissions', color: 'blue' },
    ];

    const colorMap: Record<string, string> = {
        green: 'rgba(22, 163, 74, 0.12)',
        blue: 'rgba(29, 78, 216, 0.12)',
        gold: 'rgba(217, 119, 6, 0.12)',
        emerald: 'rgba(16, 185, 129, 0.12)',
        rose: 'rgba(244, 63, 94, 0.12)',
    };
    const iconColorMap: Record<string, string> = {
        green: '#22c55e', blue: '#3b82f6', gold: '#f59e0b', emerald: '#10b981', rose: '#f43f5e',
    };

    return (
        <AppLayout>
            <div className="animate-in">
                {/* Welcome */}
                <div className="page-header">
                    <h1>{t('welcome')}, <span className="gradient-text-green">{user?.name || 'User'}</span> 👋</h1>
                    <p>{t('subtitle')}</p>
                </div>

                {/* Stats Row */}
                <div className="grid-4" style={{ marginBottom: 24 }}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(22, 163, 74, 0.12)' }}>
                            <Activity size={20} color="#22c55e" />
                        </div>
                        <div>
                            <div className="stat-value" style={{ color: '#22c55e' }}>{stats.assessments}</div>
                            <div className="stat-label">{t('total_assessments')}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>
                            <Pill size={20} color="#3b82f6" />
                        </div>
                        <div>
                            <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.meds}</div>
                            <div className="stat-label">{t('active_medications')}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.12)' }}>
                            <AlertTriangle size={20} color="#f43f5e" />
                        </div>
                        <div>
                            <div className="stat-value" style={{ color: '#f43f5e' }}>{stats.alerts}</div>
                            <div className="stat-label">{t('unread_alerts')}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.12)' }}>
                            <Droplets size={20} color="#f59e0b" />
                        </div>
                        <div>
                            <div className="stat-value" style={{ color: '#f59e0b' }}>{profile?.bloodGroup || '—'}</div>
                            <div className="stat-label">{t('blood_group')}</div>
                        </div>
                    </div>
                </div>

                {/* Health Summary */}
                {profile && (profile.heightCm || profile.weightKg || profile.allergies?.length > 0) && (
                    <div className="section-card" style={{ marginBottom: 24 }}>
                        <h3><Heart size={18} color="#f43f5e" /> {t('health_summary')}</h3>
                        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: 14 }}>
                            {profile.heightCm && <div><span style={{ color: 'var(--text-muted)' }}>{t('height')}:</span> <strong>{profile.heightCm} cm</strong></div>}
                            {profile.weightKg && <div><span style={{ color: 'var(--text-muted)' }}>{t('weight')}:</span> <strong>{profile.weightKg} kg</strong></div>}
                            {profile.gender && <div><span style={{ color: 'var(--text-muted)' }}>{t('gender')}:</span> <strong>{profile.gender}</strong></div>}
                            {profile.allergies?.length > 0 && <div><span style={{ color: 'var(--text-muted)' }}>{t('allergies')}:</span> <strong>{profile.allergies.join(', ')}</strong></div>}
                        </div>
                    </div>
                )}

                {/* Action Cards */}
                <div className="grid-3" style={{ marginBottom: 28 }}>
                    {actionCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link key={card.href} href={card.href} className="action-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: colorMap[card.color], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={20} color={iconColorMap[card.color]} />
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: 15 }}>{card.title}</span>
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{card.desc}</p>
                            </Link>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="section-card">
                    <h3><Activity size={18} color="#22c55e" /> {t('recent_activity')}</h3>
                    {recentActivity.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('no_activity')}</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {recentActivity.map((a, i) => (
                                <div key={i} className="record-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span className={a.type === 'ayurveda' ? 'badge badge-green' : 'badge badge-blue'}>
                                            {a.type === 'ayurveda' ? '🌿' : '🏥'} {a.type === 'ayurveda' ? 'Ayurveda' : 'Health'}
                                        </span>
                                        <span style={{ fontSize: 14 }}>{a.label}</span>
                                    </div>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(a.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
