'use client';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { Leaf, ArrowRight, Sparkles, Heart, Utensils, Sun } from 'lucide-react';
import Link from 'next/link';

export default function AyurvedaPage() {
    const { t } = useLang();

    return (
        <AppLayout>
            <div className="animate-in">
                <div className="page-header">
                    <h1 className="gradient-text-green">🌿 {t('ayurveda')}</h1>
                    <p>{t('dosha_subtitle')}</p>
                </div>

                {/* Hero card */}
                <div className="glass-card" style={{
                    padding: 40,
                    background: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(217,119,6,0.04) 100%)',
                    border: '1px solid rgba(22,163,74,0.2)',
                    marginBottom: 28,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 18,
                            background: 'linear-gradient(135deg, #16a34a, #d97706)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 12px 40px rgba(22,163,74,0.2)',
                        }}>
                            <Leaf size={32} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f0f7ff', marginBottom: 6, fontFamily: 'Plus Jakarta Sans' }}>
                                {t('discover_dosha')}
                            </h2>
                            <p style={{ fontSize: 15, color: '#94aec8', maxWidth: 500 }}>
                                Ayurveda identifies three primary doshas — <strong style={{ color: '#22c55e' }}>Vata</strong>, <strong style={{ color: '#f59e0b' }}>Pitta</strong>, and <strong style={{ color: '#10b981' }}>Kapha</strong> — that govern your physical and mental characteristics.
                            </p>
                        </div>
                    </div>

                    <Link href="/ayurveda/assessment">
                        <button className="btn-primary" style={{ padding: '14px 28px', fontSize: 15 }}>
                            <Sparkles size={17} /> {t('take_assessment')}
                            <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>

                {/* Info cards */}
                <div className="grid-3">
                    {[
                        { icon: Heart, title: 'Body Constitution', desc: 'Understand your unique physical and mental makeup based on ancient Ayurvedic wisdom.', color: '#22c55e' },
                        { icon: Utensils, title: 'Diet & Lifestyle', desc: 'Get personalized dietary recommendations, daily routine, and lifestyle tips for your dosha.', color: '#f59e0b' },
                        { icon: Sun, title: 'Seasonal Advice', desc: 'Learn how to adapt your lifestyle with seasonal changes for optimal health balance.', color: '#d97706' },
                    ].map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className="metric-card ayurveda-card" style={{ cursor: 'default' }}>
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
