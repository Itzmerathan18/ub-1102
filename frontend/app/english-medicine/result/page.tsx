'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { saveHealthAssessment } from '@/lib/api';
import { Scale, HeartPulse, Save, CheckCircle, ArrowLeft, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

function getBMICategory(bmi: number) {
    if (bmi < 18.5) return { label: 'Underweight', color: '#f59e0b', advice: 'Focus on nutrient-dense foods and strength training.' };
    if (bmi < 25) return { label: 'Normal weight', color: '#22c55e', advice: 'Great! Maintain your healthy lifestyle.' };
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b', advice: 'Consider increasing physical activity and reducing processed foods.' };
    return { label: 'Obese', color: '#f43f5e', advice: 'Consult a healthcare professional for a personalized plan.' };
}

function getWellnessSuggestions(data: any): string[] {
    const suggestions: string[] = [];
    const answers = data.answers || {};

    if (answers[3] === 'Sedentary') suggestions.push('🏃 Aim for at least 150 minutes of moderate exercise per week.');
    if (answers[4] === 'Less than 5' || answers[4] === '5-6 hours') suggestions.push('😴 Prioritize 7-8 hours of quality sleep nightly.');
    if (answers[5] === 'Often' || answers[5] === 'Always') suggestions.push('🧘 Practice daily stress management — meditation, deep breathing, or yoga.');
    if (answers[6] === 'Daily' || answers[6] === 'Occasionally') suggestions.push('🚭 Consider smoking cessation programs for better lung and heart health.');
    if (answers[7] === 'Daily' || answers[7] === 'Weekly') suggestions.push('🍷 Reduce alcohol intake — max 1-2 drinks occasionally.');
    if (data.bmi > 25) suggestions.push('⚖️ Work towards a healthy BMI through balanced diet and regular exercise.');
    if (data.bmi < 18.5) suggestions.push('🍎 Increase caloric intake with nutrient-dense foods and protein.');
    if (answers[9]?.includes('Yes')) suggestions.push('💊 Monitor blood pressure regularly and follow your doctor\'s advice.');
    if (answers[10]?.includes('Type') || answers[10] === 'Pre-diabetic') suggestions.push('🩸 Monitor blood sugar levels and maintain a low-glycemic diet.');
    if (answers[12] === 'Frequent problems' || answers[12] === 'Chronic condition') suggestions.push('🥗 Include more fiber and probiotics for better digestive health.');
    if (answers[13] === 'Daily' || answers[13] === 'Several times a week') suggestions.push('💧 Stay hydrated and consider tracking headache triggers.');

    if (suggestions.length === 0) suggestions.push('✅ Your health indicators look good! Keep up the healthy lifestyle.');
    return suggestions;
}

export default function HealthResultPage() {
    const { t } = useLang();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem('health_result');
        if (!raw) { router.push('/english-medicine'); return; }
        setData(JSON.parse(raw));
    }, []);

    if (!data) return null;

    const bmiCat = getBMICategory(data.bmi);
    const suggestions = getWellnessSuggestions(data);
    const riskColors: Record<string, string> = { low: '#22c55e', moderate: '#f59e0b', high: '#f43f5e' };
    const riskColor = riskColors[data.riskLevel] || '#f59e0b';

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveHealthAssessment({
                answers: data.answers,
                bmi: data.bmi,
                riskScore: data.riskScore,
                riskLevel: data.riskLevel,
            });
            setSaved(true);
            sessionStorage.removeItem('health_result');
        } catch { }
        setSaving(false);
    };

    return (
        <AppLayout>
            <div className="animate-in" style={{ maxWidth: 750, margin: '0 auto' }}>
                <div className="page-header">
                    <h1 className="gradient-text-blue">🏥 Health Results</h1>
                </div>

                {/* BMI + Risk */}
                <div className="grid-2" style={{ marginBottom: 24 }}>
                    <div className="glass-card" style={{
                        padding: 32, textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(29,78,216,0.08), rgba(96,165,250,0.04))',
                        border: '1px solid rgba(29,78,216,0.2)',
                    }}>
                        <Scale size={28} color="#3b82f6" style={{ marginBottom: 12 }} />
                        <div style={{ fontSize: 42, fontWeight: 900, color: bmiCat.color, fontFamily: 'Plus Jakarta Sans', lineHeight: 1 }}>
                            {data.bmi}
                        </div>
                        <div style={{ fontSize: 14, color: '#94aec8', marginTop: 6 }}>{t('bmi')}</div>
                        <div className="badge" style={{
                            background: `${bmiCat.color}18`, color: bmiCat.color,
                            border: `1px solid ${bmiCat.color}40`, marginTop: 10,
                        }}>
                            {bmiCat.label}
                        </div>
                        <p style={{ fontSize: 13, color: '#4a6480', marginTop: 12 }}>{bmiCat.advice}</p>
                    </div>

                    <div className="glass-card" style={{
                        padding: 32, textAlign: 'center',
                        background: `linear-gradient(135deg, ${riskColor}08, transparent)`,
                        border: `1px solid ${riskColor}30`,
                    }}>
                        <HeartPulse size={28} color={riskColor} style={{ marginBottom: 12 }} />
                        <div style={{ fontSize: 42, fontWeight: 900, color: riskColor, fontFamily: 'Plus Jakarta Sans', lineHeight: 1 }}>
                            {data.riskScore}%
                        </div>
                        <div style={{ fontSize: 14, color: '#94aec8', marginTop: 6 }}>{t('risk_level')}</div>
                        <div className="badge" style={{
                            background: `${riskColor}18`, color: riskColor,
                            border: `1px solid ${riskColor}40`, marginTop: 10,
                            textTransform: 'capitalize',
                        }}>
                            {data.riskLevel === 'low' ? t('risk_low') : data.riskLevel === 'moderate' ? t('risk_moderate') : t('risk_high')}
                        </div>
                        <div style={{ marginTop: 14, height: 8, background: '#1a2d45', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', width: `${data.riskScore}%`, borderRadius: 4,
                                background: `linear-gradient(90deg, #22c55e, ${data.riskScore > 50 ? '#f43f5e' : '#f59e0b'})`,
                                transition: 'width 1s ease',
                            }} />
                        </div>
                    </div>
                </div>

                {/* Wellness Suggestions */}
                <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <Activity size={18} color="#3b82f6" />
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0f7ff' }}>Wellness Suggestions</h3>
                    </div>
                    {suggestions.map((s, i) => (
                        <div key={i} style={{
                            padding: '12px 16px', marginBottom: 8, borderRadius: 10,
                            background: 'rgba(15,28,48,0.6)', border: '1px solid #1a2d45',
                            fontSize: 14, color: '#94aec8', lineHeight: 1.5,
                        }}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <Link href="/english-medicine">
                        <button className="btn-secondary"><ArrowLeft size={15} /> Back</button>
                    </Link>
                    <button className="btn-blue" onClick={handleSave} disabled={saved || saving}>
                        {saved ? <><CheckCircle size={15} /> {t('saved')}</> : saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Save size={15} /> {t('save_history')}</>}
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
