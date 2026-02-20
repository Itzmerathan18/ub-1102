'use client';
import AppLayout from '@/components/AppLayout';
export default function VaultPage() {
    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1>📂 Medical Vault</h1>
                    <p>This section is being upgraded. Please use the History → Prescriptions tab.</p>
                </div>
                <div className="empty-state">
                    <div style={{ fontSize: 14 }}>Coming soon — prescriptions are now managed in the History section.</div>
                </div>
            </div>
        </AppLayout>
    );
}
