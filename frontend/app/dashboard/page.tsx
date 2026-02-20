'use client';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { getProfile, getMedications, getAlerts, getReports } from '@/lib/api';
import { Activity, Pill, FileText, AlertTriangle, Heart, Droplets, Wind, Flame, TrendingUp, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function HealthScoreRing({ score }: { score: number }) {
    const r = 52, c = 2 * Math.PI * r;
    const dash = (score / 100) * c;
    return (
        <div style={{ position: 'relative', width: 130, height: 130 }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="65" cy="65" r={r} fill="none" stroke="#1e2a3a" strokeWidth="10" />
                <circle cx="65" cy="65" r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                    strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                />
                <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f0f6ff', lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{score}</div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>Health Score</div>
            </div>
        </div>
    );
}

function DoshaBar({ label, value, color, icon: Icon }: any) {
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={14} color={color} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
            </div>
            <div style={{ height: 6, background: '#1e2a3a', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }} />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => getProfile().then(r => r.data) });
    const { data: medications } = useQuery({ queryKey: ['medications'], queryFn: () => getMedications(true).then(r => r.data) });
    const { data: alerts } = useQuery({ queryKey: ['alerts'], queryFn: () => getAlerts().then(r => r.data) });
    const { data: reports } = useQuery({ queryKey: ['reports'], queryFn: () => getReports().then(r => r.data) });

    const activeMeds = medications?.length || 0;
    const unreadAlerts = alerts?.filter((a: any) => !a.isRead)?.length || 0;
    const healthScore = Math.max(40, 100 - (unreadAlerts * 5) - (activeMeds > 10 ? 10 : 0));

    return (
        <AppLayout>
            <div className="animate-in">
                {/* Greeting */}
                <div className="page-header">
                    <h1>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {profile?.fullName?.split(' ')[0] || 'there'} 👋</h1>
                    <p>Your integrative health summary for today</p>
                </div>

                {/* Metric cards */}
                <div className="grid-4" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Active Medications', value: activeMeds, icon: Pill, color: '#3b82f6', hint: 'Currently active' },
                        { label: 'Unread Alerts', value: unreadAlerts, icon: AlertTriangle, color: '#f59e0b', hint: 'Need attention' },
                        { label: 'Medical Reports', value: reports?.length || 0, icon: FileText, color: '#8b5cf6', hint: 'In your vault' },
                        { label: 'Blood Group', value: profile?.bloodGroup || '—', icon: Droplets, color: '#f43f5e', hint: 'Blood type' },
                    ].map(({ label, value, icon: Icon, color, hint }) => (
                        <div className="metric-card" key={label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={18} color={color} />
                                </div>
                                <TrendingUp size={14} color="#334155" />
                            </div>
                            <div style={{ fontSize: 30, fontWeight: 800, color: '#f0f6ff', fontFamily: 'Plus Jakarta Sans', lineHeight: 1 }}>{value}</div>
                            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{label}</div>
                            <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>{hint}</div>
                        </div>
                    ))}
                </div>

                {/* Main grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
                    {/* Health Score + Dosha */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
                            <div style={{ flexShrink: 0 }}>
                                <HealthScoreRing score={healthScore} />
                                <div style={{ textAlign: 'center', marginTop: 10 }}>
                                    <span className="badge severity-info">{healthScore >= 80 ? '✓ Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}</span>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>Ayurvedic Dosha Profile</h3>
                                <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Your constitution balance</p>
                                <DoshaBar label="Vata" value={profile?.doshaVata || 33} color="#22d3ee" icon={Wind} />
                                <DoshaBar label="Pitta" value={profile?.doshaPitta || 33} color="#f59e0b" icon={Flame} />
                                <DoshaBar label="Kapha" value={profile?.doshaKapha || 34} color="#10b981" icon={Droplets} />
                                {profile?.primaryDosha && (
                                    <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 8, fontSize: 13, color: '#94a3b8' }}>
                                        Primary dosha: <strong style={{ color: '#22d3ee' }}>{profile.primaryDosha}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Alerts panel */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>Active Alerts</h3>
                            <Link href="/alerts" style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>View all <ChevronRight size={13} /></Link>
                        </div>
                        {alerts?.slice(0, 4).map((alert: any) => (
                            <div key={alert.id} style={{ padding: '10px 12px', borderRadius: 10, marginBottom: 8, background: 'rgba(15,23,42,0.6)', border: '1px solid #1e2a3a' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className={`badge severity-${alert.severity}`} style={{ fontSize: 10 }}>{alert.severity}</span>
                                    <span style={{ fontSize: 13, color: '#f0f6ff', fontWeight: 500, flex: 1 }}>{alert.title}</span>
                                </div>
                            </div>
                        ))}
                        {(!alerts || alerts.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#334155' }}>
                                <ShieldCheck size={28} style={{ margin: '0 auto 8px', display: 'block', color: '#10b981' }} />
                                <div style={{ fontSize: 13 }}>All clear! No active alerts.</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lower grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Active medications */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>Active Medications</h3>
                            <Link href="/medications" style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>View all <ChevronRight size={13} /></Link>
                        </div>
                        {medications?.slice(0, 5).map((med: any) => (
                            <div key={med.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e2a3a' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Pill size={16} color="#3b82f6" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{med.medicineName}</div>
                                    <div style={{ fontSize: 12, color: '#475569' }}>{med.dosage} · {med.frequency}</div>
                                </div>
                                <span className={`badge system-${med.medicineSystem}`} style={{ fontSize: 11 }}>{med.medicineSystem}</span>
                            </div>
                        ))}
                        {(!medications || medications.length === 0) && (
                            <div className="empty-state" style={{ padding: '24px 0' }}>
                                <Pill size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
                                <div style={{ fontSize: 13 }}>No active medications</div>
                            </div>
                        )}
                    </div>

                    {/* Recent reports */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>Recent Reports</h3>
                            <Link href="/vault" style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>View vault <ChevronRight size={13} /></Link>
                        </div>
                        {reports?.slice(0, 4).map((rep: any) => (
                            <div key={rep.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e2a3a' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: rep.isCritical ? 'rgba(244,63,94,0.12)' : 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={16} color={rep.isCritical ? '#f43f5e' : '#8b5cf6'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{rep.reportName}</div>
                                    <div style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={11} />{rep.reportDate || 'No date'}
                                    </div>
                                </div>
                                {rep.isCritical && <span className="badge severity-critical" style={{ fontSize: 10 }}>Critical</span>}
                            </div>
                        ))}
                        {(!reports || reports.length === 0) && (
                            <div className="empty-state" style={{ padding: '24px 0' }}>
                                <FileText size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
                                <div style={{ fontSize: 13 }}>No reports yet</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
