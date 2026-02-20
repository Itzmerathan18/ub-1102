'use client';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { Leaf, Stethoscope, ArrowRight, Clock, Activity } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAyurvedaHistory, getHealthHistory } from '@/lib/api';

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useLang();
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const [ayurRes, healthRes] = await Promise.all([
                    getAyurvedaHistory(),
                    getHealthHistory(),
                ]);
                const combined = [
                    ...(ayurRes.data || []).map((r: any) => ({ ...r, _type: 'ayurveda' })),
                    ...(healthRes.data || []).map((r: any) => ({ ...r, _type: 'health' })),
                ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecentActivity(combined.slice(0, 5));
            } catch { }
        }
        load();
    }, []);

    const greeting = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';

    return (
        <AppLayout>
            <div className="animate-in">
                {/* Greeting */}
                <div className="page-header">
                    <h1>{t('welcome')}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
                    <p>Good {greeting} — your integrative health summary</p>
                </div>

                {/* Action cards */}
                <div className="grid-2" style={{ marginBottom: 28 }}>
                    {/* Ayurveda Card */}
                    <Link href="/ayurveda" style={{ textDecoration: 'none' }}>
                        <div className="action-card-ayurveda">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Leaf size={24} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0f7ff', marginBottom: 2 }}>🌿 {t('ayurveda')}</h3>
                                    <p style={{ fontSize: 13, color: '#94aec8' }}>{t('dosha_subtitle')}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontWeight: 600, fontSize: 14 }}>
                                {t('start_ayurveda')} <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>

                    {/* English Medicine Card */}
                    <Link href="/english-medicine" style={{ textDecoration: 'none' }}>
                        <div className="action-card-medicine">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Stethoscope size={24} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0f7ff', marginBottom: 2 }}>🏥 {t('english_medicine')}</h3>
                                    <p style={{ fontSize: 13, color: '#94aec8' }}>{t('health_subtitle')}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3b82f6', fontWeight: 600, fontSize: 14 }}>
                                {t('start_health')} <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="glass-card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0f7ff' }}>📋 {t('recent_activity')}</h3>
                        <Link href="/history" style={{ fontSize: 13, color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>
                            {t('history')} →
                        </Link>
                    </div>

                    {recentActivity.length === 0 && (
                        <div className="empty-state" style={{ padding: '40px 20px' }}>
                            <Activity size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                            <div style={{ fontSize: 14, color: '#4a6480' }}>{t('no_activity')}</div>
                        </div>
                    )}

                    {recentActivity.map((item, idx) => (
                        <div key={item.id} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '14px 0',
                            borderBottom: idx < recentActivity.length - 1 ? '1px solid #1a2d45' : 'none'
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: item._type === 'ayurveda' ? 'rgba(22,163,74,0.12)' : 'rgba(29,78,216,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                {item._type === 'ayurveda'
                                    ? <Leaf size={18} color="#22c55e" />
                                    : <Stethoscope size={18} color="#3b82f6" />
                                }
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f7ff' }}>
                                    {item._type === 'ayurveda' ? `Dosha: ${item.result}` : `BMI: ${item.bmi?.toFixed(1) || '—'} · Risk: ${item.riskLevel || '—'}`}
                                </div>
                                <div style={{ fontSize: 12, color: '#4a6480', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                    <Clock size={11} />
                                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                            <span className={item._type === 'ayurveda' ? 'badge badge-green' : 'badge badge-blue'} style={{ fontSize: 11 }}>
                                {item._type === 'ayurveda' ? t('ayurveda') : t('english_medicine')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
