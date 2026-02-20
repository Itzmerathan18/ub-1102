'use client';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import { getMedications, addMedication, deleteMedication } from '@/lib/api';
import { Pill, Plus, Trash2, X } from 'lucide-react';

export default function MedicationsPage() {
    const { t } = useLang();
    const [tab, setTab] = useState<'active' | 'inactive'>('active');
    const [meds, setMeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ medicineName: '', medicineSystem: 'allopathy', dosage: '', frequency: '', startDate: '', endDate: '', prescribedBy: '', hospitalClinic: '', purpose: '', quantityRemaining: '' });

    const load = () => {
        setLoading(true);
        getMedications(tab === 'active').then(res => setMeds(res.data || [])).catch(() => setMeds([])).finally(() => setLoading(false));
    };
    useEffect(load, [tab]);

    const handleAdd = async () => {
        if (!form.medicineName) return;
        await addMedication({ ...form, quantityRemaining: form.quantityRemaining ? parseInt(form.quantityRemaining) : undefined, isActive: true });
        setForm({ medicineName: '', medicineSystem: 'allopathy', dosage: '', frequency: '', startDate: '', endDate: '', prescribedBy: '', hospitalClinic: '', purpose: '', quantityRemaining: '' });
        setShowForm(false);
        load();
    };

    const handleDelete = async (id: string) => {
        await deleteMedication(id);
        setMeds(meds.filter(m => m.id !== id));
    };

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1><span className="gradient-text-green">{t('medications')}</span></h1>
                        <p>Track your medicines, dosages, and refill schedules</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> {t('add_medication')}</button>
                </div>

                <div className="tab-bar" style={{ maxWidth: 300 }}>
                    <button className={`tab-btn ${tab === 'active' ? 'active-green' : ''}`} onClick={() => setTab('active')}>{t('active')}</button>
                    <button className={`tab-btn ${tab === 'inactive' ? 'active-blue' : ''}`} onClick={() => setTab('inactive')}>{t('inactive')}</button>
                </div>

                {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> : meds.length === 0 ? (
                    <div className="empty-state"><Pill size={48} /><p>{t('no_data')}</p></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {meds.map((m: any) => (
                            <div key={m.id} className="record-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <strong style={{ fontSize: 15 }}>{m.medicineName}</strong>
                                            <span className={`badge ${m.medicineSystem === 'ayurvedic' ? 'badge-green' : 'badge-blue'}`}>{m.medicineSystem}</span>
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                            {m.dosage && <span>{t('dosage')}: {m.dosage}</span>}
                                            {m.frequency && <span>{t('frequency')}: {m.frequency}</span>}
                                            {m.prescribedBy && <span>{t('prescribed_by')}: {m.prescribedBy}</span>}
                                            {m.purpose && <span>{t('purpose')}: {m.purpose}</span>}
                                            {m.quantityRemaining != null && <span className={m.quantityRemaining <= 5 ? 'badge badge-rose' : ''}>{t('quantity_remaining')}: {m.quantityRemaining}</span>}
                                        </div>
                                    </div>
                                    <button className="btn-danger" onClick={() => handleDelete(m.id)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('add_medication')}</h2>
                                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div className="form-group"><label className="form-label">{t('medicine_name')} *</label><input className="input-field" value={form.medicineName} onChange={e => setForm({ ...form, medicineName: e.target.value })} /></div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">{t('medicine_system')}</label><select className="input-field" value={form.medicineSystem} onChange={e => setForm({ ...form, medicineSystem: e.target.value })}><option value="allopathy">{t('allopathy')}</option><option value="ayurvedic">{t('ayurvedic')}</option><option value="homeopathy">{t('homeopathy')}</option></select></div>
                                <div className="form-group"><label className="form-label">{t('dosage')}</label><input className="input-field" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} placeholder="500mg" /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">{t('frequency')}</label><input className="input-field" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} placeholder="Twice a day" /></div>
                                <div className="form-group"><label className="form-label">{t('quantity_remaining')}</label><input className="input-field" type="number" value={form.quantityRemaining} onChange={e => setForm({ ...form, quantityRemaining: e.target.value })} /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">{t('start_date')}</label><input className="input-field" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                                <div className="form-group"><label className="form-label">{t('end_date')}</label><input className="input-field" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">{t('prescribed_by')}</label><input className="input-field" value={form.prescribedBy} onChange={e => setForm({ ...form, prescribedBy: e.target.value })} /></div>
                                <div className="form-group"><label className="form-label">{t('hospital')}</label><input className="input-field" value={form.hospitalClinic} onChange={e => setForm({ ...form, hospitalClinic: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label className="form-label">{t('purpose')}</label><input className="input-field" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} /></div>
                            <button className="btn-primary" onClick={handleAdd} style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}><Plus size={16} /> {t('add_medication')}</button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
