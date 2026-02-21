'use client';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import { getCaretakers, getPatients, inviteCaretaker, approveCaretaker, removeCaretaker } from '@/lib/api';
import { Users, Plus, Check, Trash2, X, Shield, Heart } from 'lucide-react';

export default function CaretakersPage() {
    const { t } = useLang();
    const [activeTab, setActiveTab] = useState<'caretakers' | 'patients'>('caretakers');
    const [caretakers, setCaretakers] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const [form, setForm] = useState({ caretakerEmail: '', relationship: '', canEditMedications: false, canUploadReports: false, canEditProfile: false });
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        Promise.all([getCaretakers(), getPatients()])
            .then(([cRes, pRes]) => {
                setCaretakers(cRes.data || []);
                setPatients(pRes.data || []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleInvite = async () => {
        if (!form.caretakerEmail) return;
        setError('');
        try {
            await inviteCaretaker(form);
            setShowInvite(false);
            setForm({ caretakerEmail: '', relationship: '', canEditMedications: false, canUploadReports: false, canEditProfile: false });
            load();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to invite');
        }
    };

    const handleApprove = async (id: string) => {
        await approveCaretaker(id);
        load();
    };

    const handleRemove = async (id: string) => {
        await removeCaretaker(id);
        load();
    };

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1><span className="gradient-text-green">{t('caretakers')}</span></h1>
                        <p>Manage who can access your health data and who you are helping</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowInvite(true)}><Plus size={16} /> {t('invite_caretaker')}</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 24, marginBottom: 24, borderBottom: '1px solid rgba(148,174,200,0.1)' }}>
                    <button
                        onClick={() => setActiveTab('caretakers')}
                        style={{
                            padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer',
                            color: activeTab === 'caretakers' ? '#22c55e' : '#94aec8',
                            borderBottom: activeTab === 'caretakers' ? '2px solid #22c55e' : '2px solid transparent',
                            fontWeight: activeTab === 'caretakers' ? 700 : 400, fontSize: 14, transition: 'all 0.2s'
                        }}
                    >
                        {t('my_caretakers')} ({caretakers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        style={{
                            padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer',
                            color: activeTab === 'patients' ? '#3b82f6' : '#94aec8',
                            borderBottom: activeTab === 'patients' ? '2px solid #3b82f6' : '2px solid transparent',
                            fontWeight: activeTab === 'patients' ? 700 : 400, fontSize: 14, transition: 'all 0.2s'
                        }}
                    >
                        {t('people_i_care_for')} ({patients.length})
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
                ) : activeTab === 'caretakers' ? (
                    <>
                        {caretakers.length === 0 ? (
                            <div className="empty-state"><Users size={48} /><p>{t('no_caretakers_yet')}</p></div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {caretakers.map((c: any) => (
                                    <div key={c.id} className="record-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                    <strong style={{ fontSize: 15 }}>{c.caretaker?.name}</strong>
                                                    <span className={`badge ${c.status === 'accepted' ? 'badge-green' : 'badge-gold'}`}>{c.status === 'accepted' ? t('accepted') : t('pending')}</span>
                                                </div>
                                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                    {c.caretaker?.email} {c.relationship && ` · ${c.relationship}`}
                                                </div>
                                                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}><Shield size={12} /> {t('permissions')}:</span>
                                                    {c.canEditMedications && <span className="badge badge-blue" style={{ fontSize: 11 }}>{t('edit_medications')}</span>}
                                                    {c.canUploadReports && <span className="badge badge-blue" style={{ fontSize: 11 }}>{t('upload_reports')}</span>}
                                                    {c.canEditProfile && <span className="badge badge-blue" style={{ fontSize: 11 }}>{t('edit_profile')}</span>}
                                                    {!c.canEditMedications && !c.canUploadReports && !c.canEditProfile && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>View only</span>}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {c.status === 'pending' && <button className="btn-primary" style={{ padding: '6px 10px' }} onClick={() => handleApprove(c.id)} title="Approve"><Check size={14} /></button>}
                                                <button className="btn-danger" onClick={() => handleRemove(c.id)} title="Remove"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {patients.length === 0 ? (
                            <div className="empty-state"><Heart size={48} color="#3b82f6" /><p>{t('no_patients_yet')}</p></div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {patients.map((p: any) => (
                                    <div key={p.id} className="record-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                    <strong style={{ fontSize: 15 }}>{p.patient?.name}</strong>
                                                    <span className={`badge ${p.status === 'accepted' ? 'badge-blue' : 'badge-gold'}`}>{p.status === 'accepted' ? t('caring_for') : t('invitation_pending')}</span>
                                                </div>
                                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                    {p.patient?.email} {p.relationship && ` · ${p.relationship}`}
                                                </div>
                                                {p.status === 'accepted' && (
                                                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                                        <Shield size={12} color="#3b82f6" />
                                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('you_have_access_to')}: {[p.canEditMedications && t('meds'), p.canUploadReports && t('reports'), p.canEditProfile && t('profile')].filter(Boolean).join(', ') || t('view_only')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button className="btn-secondary" onClick={() => handleRemove(p.id)} style={{ color: '#f43f5e' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {showInvite && (
                    <div className="modal-overlay" onClick={() => setShowInvite(false)}>
                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('invite_caretaker')}</h2>
                                <button onClick={() => setShowInvite(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            {error && <p style={{ color: '#f43f5e', fontSize: 13, marginBottom: 12 }}>{error}</p>}
                            <div className="form-group">
                                <label className="form-label">{t('username_or_email')} *</label>
                                <input className="input-field" value={form.caretakerEmail} onChange={e => setForm({ ...form, caretakerEmail: e.target.value })} placeholder="Enter name or email" />
                            </div>
                            <div className="form-group"><label className="form-label">{t('relationship')}</label><input className="input-field" value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} placeholder="Parent, Spouse, Nurse..." /></div>
                            <div className="form-group">
                                <label className="form-label">{t('permissions_to_give')}</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><input type="checkbox" checked={form.canEditMedications} onChange={e => setForm({ ...form, canEditMedications: e.target.checked })} /> {t('can_edit_my_medications')}</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><input type="checkbox" checked={form.canUploadReports} onChange={e => setForm({ ...form, canUploadReports: e.target.checked })} /> {t('can_upload_to_my_vault')}</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><input type="checkbox" checked={form.canEditProfile} onChange={e => setForm({ ...form, canEditProfile: e.target.checked })} /> {t('can_edit_my_profile')}</label>
                                </div>
                            </div>
                            <button className="btn-primary" onClick={handleInvite} style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}><Plus size={16} /> {t('send_invitation')}</button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
