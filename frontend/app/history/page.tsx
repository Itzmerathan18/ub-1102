'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import {
    getAyurvedaHistory, getHealthHistory, getPrescriptions,
    deleteAyurvedaRecord, deleteHealthRecord, deletePrescription,
    uploadPrescription,
} from '@/lib/api';
import { Leaf, Stethoscope, FileText, Trash2, Upload, Clock, Download, X } from 'lucide-react';

export default function HistoryPage() {
    const { t } = useLang();
    const [tab, setTab] = useState<'ayurveda' | 'health' | 'prescriptions'>('ayurveda');
    const [ayurvedaRecords, setAyurvedaRecords] = useState<any[]>([]);
    const [healthRecords, setHealthRecords] = useState<any[]>([]);
    const [prescriptionRecords, setPrescriptionRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Upload state
    const [showUpload, setShowUpload] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState<'ayurveda' | 'english'>('ayurveda');
    const [uploadNotes, setUploadNotes] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [a, h, p] = await Promise.all([
                getAyurvedaHistory(), getHealthHistory(), getPrescriptions()
            ]);
            setAyurvedaRecords(a.data || []);
            setHealthRecords(h.data || []);
            setPrescriptionRecords(p.data || []);
        } catch { }
        setLoading(false);
    }

    async function handleDelete(type: string, id: string) {
        if (!confirm('Delete this record?')) return;
        try {
            if (type === 'ayurveda') { await deleteAyurvedaRecord(id); setAyurvedaRecords(r => r.filter(x => x.id !== id)); }
            else if (type === 'health') { await deleteHealthRecord(id); setHealthRecords(r => r.filter(x => x.id !== id)); }
            else { await deletePrescription(id); setPrescriptionRecords(r => r.filter(x => x.id !== id)); }
        } catch { }
    }

    async function handleUpload() {
        if (!uploadFile) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', uploadFile);
            fd.append('type', uploadType);
            if (uploadNotes) fd.append('notes', uploadNotes);
            await uploadPrescription(fd);
            setShowUpload(false);
            setUploadFile(null);
            setUploadNotes('');
            loadData();
        } catch { }
        setUploading(false);
    }

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1 className="gradient-text">📋 {t('history')}</h1>
                </div>

                {/* Tab bar */}
                <div className="tab-bar">
                    <button className={`tab-btn ${tab === 'ayurveda' ? 'active-green' : ''}`} onClick={() => setTab('ayurveda')}>
                        🌿 {t('ayurveda_history')}
                    </button>
                    <button className={`tab-btn ${tab === 'health' ? 'active-blue' : ''}`} onClick={() => setTab('health')}>
                        🏥 {t('health_history')}
                    </button>
                    <button className={`tab-btn ${tab === 'prescriptions' ? 'active-gold' : ''}`} onClick={() => setTab('prescriptions')}>
                        📄 {t('prescriptions')}
                    </button>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }} />
                    </div>
                )}

                {/* Ayurveda tab */}
                {!loading && tab === 'ayurveda' && (
                    <div>
                        {ayurvedaRecords.length === 0 && (
                            <div className="empty-state">
                                <Leaf size={36} style={{ margin: '0 auto 12px', display: 'block' }} />
                                <div style={{ fontSize: 14 }}>{t('no_records')}</div>
                            </div>
                        )}
                        {ayurvedaRecords.map(rec => (
                            <div key={rec.id} className="glass-card" style={{ padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Leaf size={20} color="#22c55e" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f7ff' }}>Dosha: <span style={{ color: '#22c55e' }}>{rec.result}</span></div>
                                    <div style={{ fontSize: 12, color: '#4a6480', display: 'flex', gap: 12, marginTop: 4 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {formatDate(rec.createdAt)}</span>
                                        <span>V:{rec.vataScore}% P:{rec.pittaScore}% K:{rec.kaphaScore}%</span>
                                    </div>
                                </div>
                                <button className="btn-danger" onClick={() => handleDelete('ayurveda', rec.id)} style={{ padding: '6px 10px' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Health tab */}
                {!loading && tab === 'health' && (
                    <div>
                        {healthRecords.length === 0 && (
                            <div className="empty-state">
                                <Stethoscope size={36} style={{ margin: '0 auto 12px', display: 'block' }} />
                                <div style={{ fontSize: 14 }}>{t('no_records')}</div>
                            </div>
                        )}
                        {healthRecords.map(rec => (
                            <div key={rec.id} className="glass-card" style={{ padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: 'rgba(29,78,216,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Stethoscope size={20} color="#3b82f6" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f7ff' }}>
                                        BMI: <span style={{ color: '#3b82f6' }}>{rec.bmi?.toFixed(1) || '—'}</span>
                                        <span style={{ margin: '0 8px', color: '#1a2d45' }}>|</span>
                                        Risk: <span style={{ color: rec.riskLevel === 'low' ? '#22c55e' : rec.riskLevel === 'high' ? '#f43f5e' : '#f59e0b', textTransform: 'capitalize' }}>{rec.riskLevel || '—'}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#4a6480', display: 'flex', gap: 12, marginTop: 4 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {formatDate(rec.createdAt)}</span>
                                        <span>Score: {rec.riskScore}%</span>
                                    </div>
                                </div>
                                <button className="btn-danger" onClick={() => handleDelete('health', rec.id)} style={{ padding: '6px 10px' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Prescriptions tab */}
                {!loading && tab === 'prescriptions' && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <button className="btn-gold" onClick={() => setShowUpload(true)}>
                                <Upload size={15} /> {t('upload_prescription')}
                            </button>
                        </div>

                        {prescriptionRecords.length === 0 && (
                            <div className="empty-state">
                                <FileText size={36} style={{ margin: '0 auto 12px', display: 'block' }} />
                                <div style={{ fontSize: 14 }}>{t('no_records')}</div>
                            </div>
                        )}
                        {prescriptionRecords.map(rec => (
                            <div key={rec.id} className="glass-card" style={{ padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: rec.type === 'ayurveda' ? 'rgba(22,163,74,0.12)' : 'rgba(29,78,216,0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <FileText size={20} color={rec.type === 'ayurveda' ? '#22c55e' : '#3b82f6'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f7ff' }}>{rec.fileName}</div>
                                    <div style={{ fontSize: 12, color: '#4a6480', display: 'flex', gap: 10, marginTop: 4 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {formatDate(rec.createdAt)}</span>
                                        <span className={rec.type === 'ayurveda' ? 'badge badge-green' : 'badge badge-blue'} style={{ fontSize: 10, padding: '1px 8px' }}>
                                            {rec.type}
                                        </span>
                                    </div>
                                    {rec.notes && <div style={{ fontSize: 12, color: '#94aec8', marginTop: 4 }}>{rec.notes}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${rec.fileUrl}`}
                                        target="_blank" rel="noopener"
                                        className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}
                                    >
                                        <Download size={13} />
                                    </a>
                                    <button className="btn-danger" onClick={() => handleDelete('prescription', rec.id)} style={{ padding: '6px 10px' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Upload modal */}
                        {showUpload && (
                            <div className="modal-overlay" onClick={() => setShowUpload(false)}>
                                <div className="modal-box" onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0f7ff' }}>{t('upload_prescription')}</h3>
                                        <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6480' }}>
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#94aec8', display: 'block', marginBottom: 6 }}>Type</label>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                        <button
                                            className={uploadType === 'ayurveda' ? 'btn-primary' : 'btn-secondary'}
                                            onClick={() => setUploadType('ayurveda')}
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            🌿 Ayurveda
                                        </button>
                                        <button
                                            className={uploadType === 'english' ? 'btn-blue' : 'btn-secondary'}
                                            onClick={() => setUploadType('english')}
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            🏥 English
                                        </button>
                                    </div>

                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#94aec8', display: 'block', marginBottom: 6 }}>File (PDF, JPG, PNG)</label>
                                    <div className="drop-zone" style={{ marginBottom: 16, padding: 24 }}>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                            style={{ width: '100%' }} />
                                        {uploadFile && <div style={{ marginTop: 8, fontSize: 13, color: '#22c55e' }}>✓ {uploadFile.name}</div>}
                                    </div>

                                    <label style={{ fontSize: 13, fontWeight: 500, color: '#94aec8', display: 'block', marginBottom: 6 }}>Notes (optional)</label>
                                    <input className="input-field" value={uploadNotes} onChange={e => setUploadNotes(e.target.value)}
                                        placeholder="Add any notes..." style={{ marginBottom: 20 }} />

                                    <button className="btn-primary" onClick={handleUpload} disabled={!uploadFile || uploading}
                                        style={{ width: '100%', justifyContent: 'center', opacity: !uploadFile ? 0.5 : 1 }}>
                                        {uploading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Upload size={15} /> Upload</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
