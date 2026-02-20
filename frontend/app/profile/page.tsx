'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { getProfile, updateProfile, addEmergencyContact, deleteEmergencyContact } from '@/lib/api';
import { User, Save, Plus, Trash2, Phone, Wind, Flame, Droplets } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DOSHAS = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridoshic'];

export default function ProfilePage() {
    const qc = useQueryClient();
    const { data: profile, isLoading } = useQuery({ queryKey: ['profile'], queryFn: () => getProfile().then(r => r.data) });
    const [form, setForm] = useState<any>(null);
    const [saved, setSaved] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
    const [showContactForm, setShowContactForm] = useState(false);

    // Initialize form from profile
    if (profile && !form) {
        setForm({
            fullName: profile.fullName || '',
            email: profile.email || '',
            dob: profile.dob || '',
            gender: profile.gender || '',
            bloodGroup: profile.bloodGroup || '',
            heightCm: profile.heightCm || '',
            weightKg: profile.weightKg || '',
            allergies: (profile.allergies || []).join(', '),
            chronicConditions: (profile.chronicConditions || []).join(', '),
            primaryDosha: profile.primaryDosha || '',
            doshaVata: profile.doshaVata || 33,
            doshaPitta: profile.doshaPitta || 33,
            doshaKapha: profile.doshaKapha || 34,
        });
    }

    const saveMut = useMutation({
        mutationFn: () => updateProfile({
            ...form,
            allergies: form.allergies.split(',').map((s: string) => s.trim()).filter(Boolean),
            chronicConditions: form.chronicConditions.split(',').map((s: string) => s.trim()).filter(Boolean),
        }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); setSaved(true); setTimeout(() => setSaved(false), 2500); },
    });

    const addContactMut = useMutation({
        mutationFn: () => addEmergencyContact({ name: newContact.name, relation: newContact.relation, phoneNumbers: [newContact.phone] }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); setNewContact({ name: '', relation: '', phone: '' }); setShowContactForm(false); },
    });

    const delContactMut = useMutation({
        mutationFn: deleteEmergencyContact,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
    });

    const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

    const handleDoshaChange = (field: string, val: number) => {
        const other = ['doshaVata', 'doshaPitta', 'doshaKapha'].filter(f => f !== field);
        const remaining = 100 - val;
        const half = Math.floor(remaining / 2);
        const newForm = { ...form, [field]: val, [other[0]]: half, [other[1]]: remaining - half };
        setForm(newForm);
    };

    if (isLoading || !form) return <AppLayout><div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div></AppLayout>;

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div><h1>Health Profile</h1><p>Your personal health information and emergency contacts</p></div>
                    <button className="btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
                        <Save size={15} /> {saved ? '✓ Saved!' : saveMut.isPending ? 'Saving…' : 'Save Profile'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
                    {/* Main info */}
                    <div>
                        <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <User size={16} color="#22d3ee" /> Personal Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Full Name</label>
                                    <input className="input-field" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Email</label>
                                    <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Date of Birth</label>
                                    <input type="date" className="input-field" value={form.dob} onChange={e => set('dob', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Gender</label>
                                    <select className="input-field" value={form.gender} onChange={e => set('gender', e.target.value)}>
                                        <option value="">Select</option>
                                        {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Blood Group</label>
                                    <select className="input-field" value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                                        <option value="">Select</option>
                                        {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Height (cm)</label>
                                    <input type="number" className="input-field" value={form.heightCm} onChange={e => set('heightCm', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Weight (kg)</label>
                                    <input type="number" className="input-field" value={form.weightKg} onChange={e => set('weightKg', e.target.value)} />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Allergies (comma separated)</label>
                                    <input className="input-field" placeholder="Penicillin, Peanuts, Latex" value={form.allergies} onChange={e => set('allergies', e.target.value)} />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Chronic Conditions (comma separated)</label>
                                    <input className="input-field" placeholder="Diabetes, Hypertension" value={form.chronicConditions} onChange={e => set('chronicConditions', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Dosha Profile */}
                        <div className="glass-card" style={{ padding: 28 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', marginBottom: 6 }}>Ayurvedic Dosha Profile</h3>
                            <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Adjust your dosha constitution (total = 100%)</p>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Primary Dosha</label>
                                <select className="input-field" value={form.primaryDosha} onChange={e => set('primaryDosha', e.target.value)}>
                                    <option value="">Select</option>
                                    {DOSHAS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>

                            {[
                                { key: 'doshaVata', label: 'Vata', color: '#22d3ee', icon: Wind },
                                { key: 'doshaPitta', label: 'Pitta', color: '#f59e0b', icon: Flame },
                                { key: 'doshaKapha', label: 'Kapha', color: '#10b981', icon: Droplets },
                            ].map(({ key, label, color, icon: Icon }) => (
                                <div key={key} style={{ marginBottom: 18 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Icon size={14} color={color} /><span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{label}</span>
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 700, color }}>{form[key]}%</span>
                                    </div>
                                    <input type="range" min={0} max={100} value={form[key]} onChange={e => handleDoshaChange(key, +e.target.value)}
                                        style={{ width: '100%', accentColor: color }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div>
                        <div className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>Emergency Contacts</h3>
                                <button className="btn-primary" style={{ padding: '7px 12px', fontSize: 12 }} onClick={() => setShowContactForm(true)}>
                                    <Plus size={14} />
                                </button>
                            </div>

                            {profile?.emergencyContacts?.map((c: any) => (
                                <div key={c.id} style={{ padding: '12px', background: 'rgba(15,23,42,0.6)', borderRadius: 10, border: '1px solid #1e2a3a', marginBottom: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{c.name}</div>
                                            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{c.relation}</div>
                                            {c.phoneNumbers?.map((p: string, i: number) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                                    <Phone size={11} color="#22d3ee" /><span style={{ fontSize: 12, color: '#94a3b8' }}>{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="btn-danger" onClick={() => delContactMut.mutate(c.id)} style={{ padding: '5px 8px' }}><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            ))}
                            {(!profile?.emergencyContacts || profile.emergencyContacts.length === 0) && !showContactForm && (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: '#334155', fontSize: 13 }}>
                                    <Phone size={28} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                                    No emergency contacts added
                                </div>
                            )}

                            {showContactForm && (
                                <div style={{ padding: 16, background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 12, marginTop: 12 }}>
                                    <div style={{ marginBottom: 10 }}>
                                        <input className="input-field" placeholder="Name" value={newContact.name} onChange={e => setNewContact(f => ({ ...f, name: e.target.value }))} style={{ marginBottom: 8 }} />
                                        <input className="input-field" placeholder="Relation (e.g. Spouse)" value={newContact.relation} onChange={e => setNewContact(f => ({ ...f, relation: e.target.value }))} style={{ marginBottom: 8 }} />
                                        <input className="input-field" placeholder="Phone number" value={newContact.phone} onChange={e => setNewContact(f => ({ ...f, phone: e.target.value }))} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '8px' }} onClick={() => addContactMut.mutate()}>Add</button>
                                        <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '8px' }} onClick={() => setShowContactForm(false)}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
