'use client';
import AppLayout from '@/components/AppLayout';
export default function AlertsPage() {
    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1>🔔 Alerts</h1>
                    <p>Notifications will appear here as you use the platform.</p>
                </div>
                <div className="empty-state">
                    <div style={{ fontSize: 14 }}>No alerts at this time.</div>
                </div>
            </div>
        </AppLayout>
    );
}
