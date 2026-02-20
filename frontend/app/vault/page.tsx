'use client';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { getReports, uploadReport, deleteReport } from '@/lib/api';
import { Upload, FileText, Trash2, Eye, X, AlertCircle, Calendar, Building2, User, Sparkles } from 'lucide-react';

function UploadModal({ onClose, onSuccess }: any) {
    const [form, setForm] = useState({ reportName: '', reportType: 'general', reportDate: '', hospitalLab: '', doctorName: '', isCritical: false });
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
    };

    const handleSubmit = async () => {
        if (!file && !form.reportName) { setError('Please provide at least a report name'); return; }
        setUploading(true); setError('');
        try {
            const fd = new FormData();
            if (file) fd.append('file', file);
            Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
            await uploadReport(fd);
            onSuccess();
        } catch (e: any) {
            setError(e.response?.data?.error || 'Upload failed');
        } finally { setUploading(false); }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f6ff' }}>Upload Report</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}><X size={20} /></button>
                </div>

                {/* Drop zone */}
                <div
                    className={`drop-zone ${dragging ? 'drag-over' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    style={{ marginBottom: 20 }}
                >
                    <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => e.target.files && setFile(e.target.files[0])} />
                    {file ? (
                        <div>
                            <FileText size={36} color="#22d3ee" style={{ margin: '0 auto 8px', display: 'block' }} />
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{file.name}</div>
                            <div style={{ fontSize: 12, color: '#475569' }}>{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                    ) : (
                        <div>
                            <Upload size={36} color="#334155" style={{ margin: '0 auto 12px', display: 'block' }} />
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8' }}>Drop file here or click to browse</div>
                            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>PDF, JPG, PNG up to 20MB · AI summary generated automatically</div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Report Name *</label>
                        <input className="input-field" placeholder="Blood Test Report" value={form.reportName} onChange={e => set('reportName', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Report Type</label>
                        <select className="input-field" value={form.reportType} onChange={e => set('reportType', e.target.value)}>
                            {['general', 'blood_test', 'urine_test', 'xray', 'mri', 'ct_scan', 'ecg', 'ultrasound', 'prescription', 'discharge'].map(t => (
                                <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Report Date</label>
                        <input type="date" className="input-field" value={form.reportDate} onChange={e => set('reportDate', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Hospital/Lab</label>
                        <input className="input-field" placeholder="City Hospital" value={form.hospitalLab} onChange={e => set('hospitalLab', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Doctor Name</label>
                        <input className="input-field" placeholder="Dr. Sharma" value={form.doctorName} onChange={e => set('doctorName', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
                        <label className="toggle">
                            <input type="checkbox" checked={form.isCritical} onChange={e => set('isCritical', e.target.checked)} />
                            <span className="toggle-slider" />
                        </label>
                        <span style={{ fontSize: 13, color: form.isCritical ? '#f43f5e' : '#94a3b8' }}>{form.isCritical ? '🔴 Critical' : 'Mark as critical'}</span>
                    </div>
                </div>

                {error && <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, fontSize: 13, color: '#f43f5e' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={uploading}>
                        {uploading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Uploading…</> : <><Upload size={15} /> Upload Report</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ViewModal({ report, onClose }: any) {
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${report.fileUrl}`;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f6ff' }}>{report.reportName}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}><X size={20} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                    {report.reportDate && <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} />{report.reportDate}</span>}
                    {report.hospitalLab && <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={12} />{report.hospitalLab}</span>}
                    {report.doctorName && <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><User size={12} />{report.doctorName}</span>}
                </div>
                {report.autoGeneratedSummary && (
                    <div style={{ padding: '16px', background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 12, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <Sparkles size={14} color="#22d3ee" />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#22d3ee' }}>AI-Generated Summary</span>
                        </div>
                        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{report.autoGeneratedSummary}</p>
                    </div>
                )}
                {report.fileUrl && (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex' }}>
                        <Eye size={15} /> Open File
                    </a>
                )}
            </div>
        </div>
    );
}

export default function VaultPage() {
    const qc = useQueryClient();
    const [showUpload, setShowUpload] = useState(false);
    const [viewReport, setViewReport] = useState<any>(null);
    const { data: reports = [], isLoading } = useQuery({ queryKey: ['reports'], queryFn: () => getReports().then(r => r.data) });
    const delMut = useMutation({ mutationFn: deleteReport, onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }) });

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>Medical Vault</h1>
                        <p>Store & analyze your medical reports with AI-powered summaries</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowUpload(true)}><Upload size={16} /> Upload Report</button>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(17,24,39,0.8)', border: '1px solid #1e2a3a', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText size={16} color="#8b5cf6" />
                        <span style={{ fontSize: 14, color: '#94a3b8' }}><strong style={{ color: '#f0f6ff' }}>{reports.length}</strong> total reports</span>
                    </div>
                    <div style={{ padding: '12px 20px', background: 'rgba(17,24,39,0.8)', border: '1px solid #1e2a3a', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertCircle size={16} color="#f43f5e" />
                        <span style={{ fontSize: 14, color: '#94a3b8' }}><strong style={{ color: '#f0f6ff' }}>{reports.filter((r: any) => r.isCritical).length}</strong> critical</span>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
                ) : reports.length === 0 ? (
                    <div className="glass-card empty-state" style={{ padding: 60 }}>
                        <Upload size={40} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginTop: 8 }}>Your vault is empty</div>
                        <div style={{ marginTop: 16 }}><button className="btn-primary" onClick={() => setShowUpload(true)}><Upload size={15} /> Upload your first report</button></div>
                    </div>
                ) : (
                    <div className="grid-3">
                        {reports.map((rep: any) => (
                            <div key={rep.id} className="glass-card" style={{ padding: 20, cursor: 'pointer' }} onClick={() => setViewReport(rep)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: rep.isCritical ? 'rgba(244,63,94,0.12)' : 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={20} color={rep.isCritical ? '#f43f5e' : '#8b5cf6'} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                                        {rep.isCritical && <span className="badge severity-critical" style={{ fontSize: 10 }}>Critical</span>}
                                        <button className="btn-danger" style={{ padding: '5px 8px' }} onClick={e => { e.stopPropagation(); if (confirm('Delete?')) delMut.mutate(rep.id); }}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 6 }}>{rep.reportName}</div>
                                <div style={{ fontSize: 12, color: '#475569', marginBottom: 10 }}>
                                    {rep.reportType?.replace('_', ' ')} {rep.reportDate && `· ${rep.reportDate}`}
                                </div>
                                {rep.autoGeneratedSummary && (
                                    <div style={{ padding: '10px', background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.1)', borderRadius: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                            <Sparkles size={11} color="#22d3ee" />
                                            <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 600 }}>AI Summary</span>
                                        </div>
                                        <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {rep.autoGeneratedSummary}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => { setShowUpload(false); qc.invalidateQueries({ queryKey: ['reports'] }); }} />}
            {viewReport && <ViewModal report={viewReport} onClose={() => setViewReport(null)} />}
        </AppLayout>
    );
}
