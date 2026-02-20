'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { getCaretakers, inviteCaretaker, approveCaretaker, removeCaretaker } from '@/lib/api';
import { Users, UserPlus, Check, X, Trash2, Phone, Clock, UserCheck } from 'lucide-react';

export default function CaretakersPage() {
    const qc = useQueryClient();
    const { data: caretakers = [], isLoading } = useQuery({ queryKey: ['caretakers'], queryFn: () => getCaretakers().then(r => r.data) });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ caretakerPhone: '', relationship: '', canEditMedications: false, canUploadReports: false, canEditProfile: false });
    const [error, setError] = useState('');

    const inviteMut = useMutation({
        mutationFn: inviteCaretaker,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['caretakers'] }); setShowForm(false); setForm({ caretakerPhone: '', relationship: '', canEditMedications: false, canUploadReports: false, canEditProfile: false }); },
        onError: (e: any) => setError(e.response?.data?.error || 'Invite failed'),
    });
    const approveMut = useMutation({ mutationFn: approveCaretaker, onSuccess: () => qc.invalidateQueries({ queryKey: ['caretakers'] }) });
    const removeMut = useMutation({ mutationFn: removeCaretaker, onSuccess: () => qc.invalidateQueries({ queryKey: ['caretakers'] }) });

    const statusColor = { pending: '#f59e0b', accepted: '#10b981', rejected: '#f43f5e' };

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div><h1>Caretakers</h1><p>Manage who can help monitor your health</p></div>
                    <button className="btn-primary" onClick={() => setShowForm(true)}><UserPlus size={16} /> Invite Caretaker</button>
                </div>

                {showForm && (
                    <div className="glass-card" style={{ padding: 28, marginBottom: 24, border: '1px solid rgba(34,211,238,0.2)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f6ff', marginBottom: 20 }}>Invite a Caretaker</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Caretaker Phone *</label>
                                <input className="input-field" placeholder="+91 98765 43210" value={form.caretakerPhone} onChange={e => setForm(f => ({ ...f, caretakerPhone: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Relationship</label>
                                <input className="input-field" placeholder="Spouse, Parent…" value={form.relationship} onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, fontWeight: 500 }}>Permissions</div>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {[
                                    { key: 'canEditMedications', label: 'Edit Medications' },
                                    { key: 'canUploadReports', label: 'Upload Reports' },
                                    { key: 'canEditProfile', label: 'Edit Profile' },
                                ].map(({ key, label }) => (
                                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                        <label className="toggle" style={{ width: 36, height: 20 }}>
                                            <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                                            <span className="toggle-slider" />
                                        </label>
                                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {error && <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, fontSize: 13, color: '#f43f5e', marginBottom: 14 }}>{error}</div>}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn-primary" onClick={() => inviteMut.mutate(form)} disabled={inviteMut.isPending}><UserPlus size={15} /> Send Invite</button>
                            <button className="btn-secondary" onClick={() => { setShowForm(false); setError(''); }}>Cancel</button>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
                ) : caretakers.length === 0 ? (
                    <div className="glass-card empty-state" style={{ padding: 60 }}>
                        <Users size={40} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginTop: 8 }}>No caretakers yet</div>
                        <div style={{ marginTop: 16 }}><button className="btn-primary" onClick={() => setShowForm(true)}><UserPlus size={15} /> Invite someone</button></div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {caretakers.map((ct: any) => {
                            const scolor = statusColor[ct.status as keyof typeof statusColor] || '#475569';
                            return (
                                <div key={ct.id} className="glass-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <UserCheck size={22} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                            <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>{ct.caretaker?.phoneNumber || 'Unknown'}</span>
                                            <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${scolor}18`, color: scolor }}>
                                                {ct.status}
                                            </span>
                                        </div>
                                        {ct.relationship && <div style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>{ct.relationship}</div>}
                                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                            {ct.canEditMedications && <span style={{ fontSize: 11, color: '#22d3ee', background: 'rgba(34,211,238,0.08)', padding: '2px 8px', borderRadius: 8 }}>Edit Meds</span>}
                                            {ct.canUploadReports && <span style={{ fontSize: 11, color: '#8b5cf6', background: 'rgba(139,92,246,0.08)', padding: '2px 8px', borderRadius: 8 }}>Upload Reports</span>}
                                            {ct.canEditProfile && <span style={{ fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '2px 8px', borderRadius: 8 }}>Edit Profile</span>}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#334155', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={10} /> Invited {new Date(ct.invitedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {ct.status === 'pending' && (
                                            <button className="btn-secondary" style={{ padding: '7px 12px', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }} onClick={() => approveMut.mutate(ct.id)}>
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button className="btn-danger" onClick={() => { if (confirm('Remove this caretaker?')) removeMut.mutate(ct.id); }}>
                                            <Trash2 size={14} />
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
