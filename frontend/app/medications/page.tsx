'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { getMedications, addMedication, updateMedication, deleteMedication } from '@/lib/api';
import { Pill, Plus, X, Edit2, Trash2, CheckCircle, Clock, Package } from 'lucide-react';

const SYSTEMS = ['allopathy', 'ayurvedic', 'homeopathy', 'unani', 'siddha'];
const FORMS = ['tablet', 'capsule', 'syrup', 'ointment', 'powder', 'oil', 'injection', 'drops', 'inhaler', 'patch'];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'Weekly', 'As needed'];

function MedModal({ med, onClose, onSave }: any) {
    const [form, setForm] = useState({
        medicineName: med?.medicineName || '',
        medicineSystem: med?.medicineSystem || 'allopathy',
        medicineForm: med?.medicineForm || 'tablet',
        dosage: med?.dosage || '',
        dosageUnit: med?.dosageUnit || 'mg',
        frequency: med?.frequency || 'Once daily',
        startDate: med?.startDate || '',
        endDate: med?.endDate || '',
        prescribedBy: med?.prescribedBy || '',
        hospitalClinic: med?.hospitalClinic || '',
        purpose: med?.purpose || '',
        quantityRemaining: med?.quantityRemaining || '',
        isActive: med?.isActive !== undefined ? med.isActive : true,
    });
    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6ff' }}>{med ? 'Edit' : 'Add'} Medication</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}><X size={20} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Medicine Name *</label>
                        <input className="input-field" placeholder="e.g. Paracetamol" value={form.medicineName} onChange={e => set('medicineName', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>System</label>
                        <select className="input-field" value={form.medicineSystem} onChange={e => set('medicineSystem', e.target.value)}>
                            {SYSTEMS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Form</label>
                        <select className="input-field" value={form.medicineForm} onChange={e => set('medicineForm', e.target.value)}>
                            {FORMS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Dosage</label>
                        <input className="input-field" placeholder="500" value={form.dosage} onChange={e => set('dosage', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Unit</label>
                        <select className="input-field" value={form.dosageUnit} onChange={e => set('dosageUnit', e.target.value)}>
                            {['mg', 'ml', 'g', 'mcg', 'IU', 'drops', 'puffs'].map(u => <option key={u}>{u}</option>)}
                        </select>
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Frequency</label>
                        <select className="input-field" value={form.frequency} onChange={e => set('frequency', e.target.value)}>
                            {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Start Date</label>
                        <input type="date" className="input-field" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>End Date</label>
                        <input type="date" className="input-field" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Prescribed By</label>
                        <input className="input-field" placeholder="Dr. Name" value={form.prescribedBy} onChange={e => set('prescribedBy', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Hospital/Clinic</label>
                        <input className="input-field" placeholder="Hospital name" value={form.hospitalClinic} onChange={e => set('hospitalClinic', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Purpose</label>
                        <input className="input-field" placeholder="e.g. Blood pressure control" value={form.purpose} onChange={e => set('purpose', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Quantity Remaining</label>
                        <input type="number" className="input-field" placeholder="30" value={form.quantityRemaining} onChange={e => set('quantityRemaining', +e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 20 }}>
                        <label className="toggle">
                            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
                            <span className="toggle-slider" />
                        </label>
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{form.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={() => onSave(form)}>
                        {med ? 'Update Medication' : 'Add Medication'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MedicationsPage() {
    const qc = useQueryClient();
    const [tab, setTab] = useState<'active' | 'past'>('active');
    const [showModal, setShowModal] = useState(false);
    const [editMed, setEditMed] = useState<any>(null);

    const { data: meds = [], isLoading } = useQuery({
        queryKey: ['medications', tab],
        queryFn: () => getMedications(tab === 'active').then(r => r.data),
    });

    const addMut = useMutation({ mutationFn: addMedication, onSuccess: () => { qc.invalidateQueries({ queryKey: ['medications'] }); setShowModal(false); } });
    const editMut = useMutation({ mutationFn: ({ id, data }: any) => updateMedication(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['medications'] }); setEditMed(null); } });
    const delMut = useMutation({ mutationFn: deleteMedication, onSuccess: () => qc.invalidateQueries({ queryKey: ['medications'] }) });

    const handleSave = (form: any) => {
        if (editMed) editMut.mutate({ id: editMed.id, data: form });
        else addMut.mutate(form);
    };

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>Medications</h1>
                        <p>Manage your allopathic, ayurvedic & integrative medicines</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setEditMed(null); setShowModal(true); }}>
                        <Plus size={16} /> Add Medication
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, background: '#0f172a', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
                    {(['active', 'past'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                            background: tab === t ? 'rgba(34,211,238,0.1)' : 'transparent',
                            color: tab === t ? '#22d3ee' : '#475569',
                        }}>
                            {t === 'active' ? <><CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }} />Active</> : <><Clock size={14} style={{ display: 'inline', marginRight: 6 }} />Past</>}
                        </button>
                    ))}
                </div>

                {/* List */}
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
                ) : meds.length === 0 ? (
                    <div className="glass-card empty-state">
                        <Pill size={40} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginTop: 8 }}>No {tab} medications</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>Add your first medication to get started</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {meds.map((med: any) => (
                            <div key={med.id} className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Pill size={22} color="#3b82f6" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>{med.medicineName}</span>
                                        <span className={`badge system-${med.medicineSystem}`} style={{ fontSize: 11 }}>{med.medicineSystem}</span>
                                        <span style={{ fontSize: 11, background: '#1e2a3a', color: '#94a3b8', padding: '2px 8px', borderRadius: 8 }}>{med.medicineForm}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                                        {med.dosage && <span style={{ fontSize: 12, color: '#475569' }}>💊 {med.dosage} {med.dosageUnit}</span>}
                                        {med.frequency && <span style={{ fontSize: 12, color: '#475569' }}>🕐 {med.frequency}</span>}
                                        {med.prescribedBy && <span style={{ fontSize: 12, color: '#475569' }}>👨‍⚕️ {med.prescribedBy}</span>}
                                        {med.purpose && <span style={{ fontSize: 12, color: '#475569' }}>📋 {med.purpose}</span>}
                                    </div>
                                    {med.quantityRemaining !== null && (
                                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Package size={12} color={med.quantityRemaining <= 5 ? '#f59e0b' : '#475569'} />
                                            <span style={{ fontSize: 12, color: med.quantityRemaining <= 5 ? '#f59e0b' : '#475569' }}>
                                                {med.quantityRemaining} remaining {med.quantityRemaining <= 5 ? '⚠️ Refill soon' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button className="btn-secondary" style={{ padding: '7px 10px' }} onClick={() => { setEditMed(med); setShowModal(true); }}>
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="btn-danger" onClick={() => { if (confirm('Delete this medication?')) delMut.mutate(med.id); }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {(showModal || editMed) && (
                <MedModal
                    med={editMed}
                    onClose={() => { setShowModal(false); setEditMed(null); }}
                    onSave={handleSave}
                />
            )}
        </AppLayout>
    );
}
