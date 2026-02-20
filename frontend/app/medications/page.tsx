'use client';
import AppLayout from '@/components/AppLayout';
export default function MedicationsPage() {
    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1>💊 Medications</h1>
                    <p>This section is being upgraded. Please use the History tab for prescriptions.</p>
                </div>
                <div className="empty-state">
                    <div style={{ fontSize: 14 }}>Coming soon — this feature is being integrated into the new system.</div>
                </div>
            </div>
        </AppLayout>
    );
}
