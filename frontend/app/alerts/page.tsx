'use client';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import { getAlerts, markAlertRead, markAllAlertsRead, dismissAlert } from '@/lib/api';
import { Bell, Check, CheckCheck, X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export default function AlertsPage() {
    const { t } = useLang();
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        getAlerts().then(res => setAlerts(res.data || [])).catch(() => { }).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleMarkRead = async (id: string) => {
        await markAlertRead(id);
        setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
    };

    const handleMarkAllRead = async () => {
        await markAllAlertsRead();
        setAlerts(alerts.map(a => ({ ...a, isRead: true })));
    };

    const handleDismiss = async (id: string) => {
        await dismissAlert(id);
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const severityIcon = (s: string) => {
        if (s === 'critical') return <AlertTriangle size={18} color="#f43f5e" />;
        if (s === 'warning') return <AlertCircle size={18} color="#f59e0b" />;
        return <Info size={18} color="#3b82f6" />;
    };

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1><span className="gradient-text-blue">{t('alerts')}</span></h1>
                        <p>Health notifications and important reminders</p>
                    </div>
                    {alerts.some(a => !a.isRead) && (
                        <button className="btn-secondary" onClick={handleMarkAllRead}><CheckCheck size={16} /> Mark all read</button>
                    )}
                </div>

                {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> : alerts.length === 0 ? (
                    <div className="empty-state"><Bell size={48} /><p>{t('no_data')}</p></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {alerts.map((a: any) => (
                            <div key={a.id} className={`alert-card ${!a.isRead ? 'unread' : ''} severity-${a.severity}`}>
                                <div style={{ paddingTop: 2 }}>{severityIcon(a.severity)}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <strong style={{ fontSize: 14 }}>{a.title}</strong>
                                        <span className={`badge ${a.severity === 'critical' ? 'badge-rose' : a.severity === 'warning' ? 'badge-gold' : 'badge-blue'}`}>{a.severity}</span>
                                        {!a.isRead && <span className="badge badge-green" style={{ fontSize: 10 }}>NEW</span>}
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.message}</p>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {!a.isRead && <button className="btn-secondary" style={{ padding: '6px 8px' }} onClick={() => handleMarkRead(a.id)}><Check size={14} /></button>}
                                    <button className="btn-danger" style={{ padding: '6px 8px' }} onClick={() => handleDismiss(a.id)}><X size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
