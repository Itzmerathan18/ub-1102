'use client';
import AppLayout from '@/components/AppLayout';
export default function EmergencyPage() {
    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1>🆘 Emergency QR</h1>
                    <p>This feature is being upgraded for the Jeevaloom platform.</p>
                </div>
                <div className="empty-state">
                    <div style={{ fontSize: 14 }}>Coming soon.</div>
                </div>
            </div>
        </AppLayout>
    );
}
