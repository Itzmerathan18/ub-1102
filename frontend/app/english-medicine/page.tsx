'use client';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { Stethoscope, ArrowRight, Sparkles, Activity, Scale, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function EnglishMedicinePage() {
    const { t } = useLang();

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1 className="gradient-text-blue">🏥 {t('english_medicine')}</h1>
                    <p>{t('health_subtitle')}</p>
                </div>

                {/* Hero card */}
                <div className="glass-card" style={{
                    padding: 40,
                    background: 'linear-gradient(135deg, rgba(29,78,216,0.08) 0%, rgba(96,165,250,0.04) 100%)',
                    border: '1px solid rgba(29,78,216,0.2)',
                    marginBottom: 28,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 18,
                            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 12px 40px rgba(29,78,216,0.2)',
                        }}>
                            <Stethoscope size={32} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f0f7ff', marginBottom: 6, fontFamily: 'Plus Jakarta Sans' }}>
                                {t('bmi_check')}
                            </h2>
                            <p style={{ fontSize: 15, color: '#94aec8', maxWidth: 500 }}>
                                Complete a comprehensive health questionnaire covering <strong style={{ color: '#3b82f6' }}>BMI</strong>, lifestyle factors, medical history, and current symptoms for a personalized wellness summary.
                            </p>
                        </div>
                    </div>

                    <Link href="/english-medicine/assessment">
                        <button className="btn-blue" style={{ padding: '14px 28px', fontSize: 15 }}>
                            <Sparkles size={17} /> {t('take_assessment')}
                            <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>

                {/* Info cards */}
                <div className="grid-3">
                    {[
                        { icon: Scale, title: 'BMI Analysis', desc: 'Calculate your Body Mass Index and understand your weight category relative to height.', color: '#3b82f6' },
                        { icon: HeartPulse, title: 'Risk Assessment', desc: 'Evaluate your lifestyle risk factors including activity, sleep, stress, and medical history.', color: '#f43f5e' },
                        { icon: Activity, title: 'Wellness Plan', desc: 'Receive personalized wellness suggestions based on your complete health profile.', color: '#22d3ee' },
                    ].map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className="metric-card medicine-card" style={{ cursor: 'default' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16,
                            }}>
                                <Icon size={20} color={color} />
                            </div>
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f0f7ff', marginBottom: 6 }}>{title}</h4>
                            <p style={{ fontSize: 13, color: '#94aec8', lineHeight: 1.5 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
