'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { getAlerts, markAlertRead, markAllAlertsRead, dismissAlert } from '@/lib/api';
import { Bell, CheckCheck, X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const SEVERITY_ICON = { critical: AlertCircle, warning: AlertTriangle, info: Info };
const SEVERITY_COLOR = { critical: '#f43f5e', warning: '#f59e0b', info: '#22d3ee' };

export default function AlertsPage() {
    const qc = useQueryClient();
    const { data: alerts = [], isLoading } = useQuery({ queryKey: ['alerts'], queryFn: () => getAlerts().then(r => r.data) });

    const readMut = useMutation({ mutationFn: markAlertRead, onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }) });
    const readAllMut = useMutation({ mutationFn: markAllAlertsRead, onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }) });
    const dismissMut = useMutation({ mutationFn: dismissAlert, onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }) });

    const unread = alerts.filter((a: any) => !a.isRead).length;

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>Health Alerts</h1>
                        <p>{unread > 0 ? `${unread} unread alert${unread > 1 ? 's' : ''}` : 'All alerts read'}</p>
                    </div>
                    {unread > 0 && (
                        <button className="btn-secondary" onClick={() => readAllMut.mutate()}>
                            <CheckCheck size={15} /> Mark all read
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
                ) : alerts.length === 0 ? (
                    <div className="glass-card empty-state" style={{ padding: '60px 40px' }}>
                        <Bell size={40} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginTop: 8 }}>No active alerts</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>You're all caught up! ✓</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {alerts.map((alert: any) => {
                            const sev = alert.severity as keyof typeof SEVERITY_ICON;
                            const Icon = SEVERITY_ICON[sev] || Info;
                            const color = SEVERITY_COLOR[sev] || '#22d3ee';
                            return (
                                <div key={alert.id} className="glass-card" style={{
                                    padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start',
                                    opacity: alert.isRead ? 0.6 : 1, transition: 'opacity 0.3s',
                                    borderLeft: `3px solid ${color}`,
                                }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={18} color={color} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>{alert.title}</span>
                                            <span className={`badge severity-${sev}`} style={{ fontSize: 10 }}>{sev}</span>
                                            {!alert.isRead && <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />}
                                        </div>
                                        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{alert.message}</p>
                                        <div style={{ fontSize: 11, color: '#334155', marginTop: 6 }}>
                                            {new Date(alert.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                        {!alert.isRead && (
                                            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => readMut.mutate(alert.id)}>
                                                <CheckCheck size={13} />
                                            </button>
                                        )}
                                        <button className="btn-danger" onClick={() => dismissMut.mutate(alert.id)} style={{ padding: '6px 10px' }}>
                                            <X size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
