'use client';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import { getProfile, updateProfile, addEmergencyContact, deleteEmergencyContact } from '@/lib/api';
import { User, Heart, Phone, Plus, Trash2, Save, Check } from 'lucide-react';

export default function ProfilePage() {
    const { t } = useLang();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ fullName: '', dob: '', gender: '', bloodGroup: '', heightCm: '', weightKg: '', email: '' });
    const [allergies, setAllergies] = useState<string[]>([]);
    const [conditions, setConditions] = useState<string[]>([]);
    const [newAllergy, setNewAllergy] = useState('');
    const [newCondition, setNewCondition] = useState('');
    const [contacts, setContacts] = useState<any[]>([]);
    const [contactForm, setContactForm] = useState({ name: '', relation: '', phone: '', email: '' });
    const [showContactForm, setShowContactForm] = useState(false);

    useEffect(() => {
        getProfile().then(res => {
            const d = res.data;
            setForm({ fullName: d.fullName || '', dob: d.dob || '', gender: d.gender || '', bloodGroup: d.bloodGroup || '', heightCm: d.heightCm?.toString() || '', weightKg: d.weightKg?.toString() || '', email: d.email || '' });
            setAllergies(d.allergies || []);
            setConditions(d.chronicConditions || []);
            setContacts(d.emergencyContacts || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({
                ...form,
                heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
                weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
                allergies, chronicConditions: conditions,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch { }
        setSaving(false);
    };

    const handleAddContact = async () => {
        if (!contactForm.name) return;
        try {
            const res = await addEmergencyContact({
                name: contactForm.name, relation: contactForm.relation,
                phoneNumbers: contactForm.phone ? [contactForm.phone] : [],
                emails: contactForm.email ? [contactForm.email] : [],
            });
            setContacts([...contacts, res.data]);
            setContactForm({ name: '', relation: '', phone: '', email: '' });
            setShowContactForm(false);
        } catch { }
    };

    const handleDeleteContact = async (id: string) => {
        await deleteEmergencyContact(id);
        setContacts(contacts.filter(c => c.id !== id));
    };

    if (loading) return <AppLayout><div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div></AppLayout>;

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1><span className="gradient-text-green">{t('profile')}</span></h1>
                    <p>{t('basic_info')} · {t('medical_history')} · {t('emergency_contacts')}</p>
                </div>

                {/* Basic Info */}
                <div className="section-card">
                    <h3><User size={18} color="#22c55e" /> {t('basic_info')}</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">{t('name')}</label>
                            <input className="input-field" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('email')}</label>
                            <input className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">{t('dob')}</label>
                            <input className="input-field" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('gender')}</label>
                            <select className="input-field" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                <option value="">—</option>
                                <option value="male">{t('male')}</option>
                                <option value="female">{t('female')}</option>
                                <option value="other">{t('other')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">{t('blood_group')}</label>
                            <select className="input-field" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                                <option value="">—</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('height')}</label>
                            <input className="input-field" type="number" value={form.heightCm} onChange={e => setForm({ ...form, heightCm: e.target.value })} placeholder="170" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('weight')}</label>
                        <input className="input-field" type="number" value={form.weightKg} onChange={e => setForm({ ...form, weightKg: e.target.value })} placeholder="70" style={{ maxWidth: 200 }} />
                    </div>
                </div>

                {/* Medical History */}
                <div className="section-card">
                    <h3><Heart size={18} color="#f43f5e" /> {t('medical_history')}</h3>
                    <div className="form-group">
                        <label className="form-label">{t('allergies')}</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {allergies.map((a, i) => (
                                <span key={i} className="badge badge-rose" style={{ cursor: 'pointer' }} onClick={() => setAllergies(allergies.filter((_, j) => j !== i))}>{a} ✕</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input className="input-field" value={newAllergy} onChange={e => setNewAllergy(e.target.value)} placeholder="Add allergy..." style={{ maxWidth: 250 }} onKeyDown={e => { if (e.key === 'Enter' && newAllergy.trim()) { setAllergies([...allergies, newAllergy.trim()]); setNewAllergy(''); } }} />
                            <button className="btn-secondary" onClick={() => { if (newAllergy.trim()) { setAllergies([...allergies, newAllergy.trim()]); setNewAllergy(''); } }}><Plus size={14} /></button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('chronic_conditions')}</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {conditions.map((c, i) => (
                                <span key={i} className="badge badge-gold" style={{ cursor: 'pointer' }} onClick={() => setConditions(conditions.filter((_, j) => j !== i))}>{c} ✕</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input className="input-field" value={newCondition} onChange={e => setNewCondition(e.target.value)} placeholder="Add condition..." style={{ maxWidth: 250 }} onKeyDown={e => { if (e.key === 'Enter' && newCondition.trim()) { setConditions([...conditions, newCondition.trim()]); setNewCondition(''); } }} />
                            <button className="btn-secondary" onClick={() => { if (newCondition.trim()) { setConditions([...conditions, newCondition.trim()]); setNewCondition(''); } }}><Plus size={14} /></button>
                        </div>
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="section-card">
                    <h3><Phone size={18} color="#3b82f6" /> {t('emergency_contacts')}</h3>
                    {contacts.map((c: any) => (
                        <div key={c.id} className="record-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{c.name}</strong> {c.relation && <span className="badge badge-blue" style={{ marginLeft: 8 }}>{c.relation}</span>}
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                                    {(JSON.parse(c.phoneNumbers || '[]')).join(', ')}
                                    {c.emails && ` · ${(JSON.parse(c.emails || '[]')).join(', ')}`}
                                </div>
                            </div>
                            <button className="btn-danger" onClick={() => handleDeleteContact(c.id)}><Trash2 size={14} /></button>
                        </div>
                    ))}
                    {showContactForm ? (
                        <div style={{ marginTop: 12, padding: 16, border: '1px solid var(--border-color)', borderRadius: 14, background: 'var(--bg-secondary)' }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('name')}</label>
                                    <input className="input-field" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('relation')}</label>
                                    <input className="input-field" value={contactForm.relation} onChange={e => setContactForm({ ...contactForm, relation: e.target.value })} placeholder="Parent, Spouse..." />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('phone')}</label>
                                    <input className="input-field" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('email')}</label>
                                    <input className="input-field" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn-primary" onClick={handleAddContact}><Plus size={14} /> {t('add')}</button>
                                <button className="btn-secondary" onClick={() => setShowContactForm(false)}>{t('cancel')}</button>
                            </div>
                        </div>
                    ) : (
                        <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => setShowContactForm(true)}>
                            <Plus size={14} /> {t('add_contact')}
                        </button>
                    )}
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? <><div className="spinner" style={{ width: 16, height: 16 }} /> {t('saving')}</> : saved ? <><Check size={16} /> {t('save_success')}</> : <><Save size={16} /> {t('save_changes')}</>}
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
