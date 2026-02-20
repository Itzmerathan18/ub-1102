'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { saveAyurvedaAssessment } from '@/lib/api';
import { Leaf, Save, CheckCircle, ArrowLeft, Wind, Flame, Droplets } from 'lucide-react';
import Link from 'next/link';

const doshaInfo: Record<string, {
    color: string; emoji: string;
    personality: string; diet: string[]; lifestyle: string[]; exercise: string[]; seasonal: string;
}> = {
    Vata: {
        color: '#22d3ee', emoji: '💨',
        personality: 'Creative, quick-thinking, enthusiastic. You thrive on change and new experiences but may struggle with anxiety and irregular habits.',
        diet: ['Warm, cooked, nourishing foods', 'Healthy fats — ghee, sesame oil', 'Sweet fruits — bananas, grapes, mangoes', 'Warm spices — ginger, cinnamon, cumin', 'Avoid raw, cold, and dry foods'],
        lifestyle: ['Maintain regular daily routine', 'Warm oil massage (Abhyanga)', 'Early bedtime — sleep by 10 PM', 'Stay warm and hydrated', 'Meditation for calming the mind'],
        exercise: ['Gentle yoga', 'Tai chi', 'Walking', 'Swimming', 'Avoid excessive cardio'],
        seasonal: 'Autumn/early winter is Vata season. Keep extra warm, eat grounding foods, and maintain routine strictly.',
    },
    Pitta: {
        color: '#f59e0b', emoji: '🔥',
        personality: 'Intelligent, focused, ambitious. Natural leaders with sharp minds. May become irritable, competitive, or overheated under stress.',
        diet: ['Cool, refreshing foods', 'Sweet fruits — melons, pears, coconut', 'Green leafy vegetables', 'Cooling herbs — mint, coriander, fennel', 'Avoid spicy, fried, and acidic foods'],
        lifestyle: ['Avoid excessive heat and sun', 'Cool showers', 'Moonlit evening walks', 'Creative hobbies for stress relief', 'Practice patience and compassion'],
        exercise: ['Swimming', 'Cycling', 'Moderate yoga', 'Hiking in cool places', 'Avoid intense midday exercise'],
        seasonal: 'Summer is Pitta season. Stay cool, drink coconut water, avoid spicy food, and exercise during cooler hours.',
    },
    Kapha: {
        color: '#10b981', emoji: '🌊',
        personality: 'Calm, steady, loving. You have great endurance but may become lethargic, resistant to change, or gain weight easily.',
        diet: ['Light, warm, and spicy foods', 'Plenty of vegetables and legumes', 'Bitter and astringent tastes', 'Honey (in moderation) instead of sugar', 'Avoid heavy, oily, and dairy-rich foods'],
        lifestyle: ['Wake up early (before 6 AM)', 'Stimulating activities and variety', 'Dry body brushing', 'Keep social and engaged', 'Avoid daytime napping'],
        exercise: ['Vigorous activities — running, cycling', 'Strength training', 'Hot yoga or power yoga', 'Dance classes', 'Aim for daily exercise'],
        seasonal: 'Late winter/spring is Kapha season. Stay active, eat lighter, use warming spices, and avoid oversleeping.',
    },
};

function DoshaBar({ label, score, color, icon: Icon }: { label: string; score: number; color: string; icon: any }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={14} color={color} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#94aec8' }}>{label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color }}>{score}%</span>
            </div>
            <div style={{ height: 8, background: '#1a2d45', borderRadius: 4, overflow: 'hidden' }}>
                <div className="dosha-bar" style={{ width: `${score}%`, background: color }} />
            </div>
        </div>
    );
}

export default function AyurvedaResultPage() {
    const { t } = useLang();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem('ayurveda_result');
        if (!raw) { router.push('/ayurveda'); return; }
        setData(JSON.parse(raw));
    }, []);

    if (!data) return null;

    const primary = data.result.split('-')[0];
    const info = doshaInfo[primary] || doshaInfo.Vata;

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveAyurvedaAssessment({
                answers: data.answers,
                result: data.result,
                vataScore: data.vataScore,
                pittaScore: data.pittaScore,
                kaphaScore: data.kaphaScore,
            });
            setSaved(true);
            sessionStorage.removeItem('ayurveda_result');
        } catch { }
        setSaving(false);
    };

    return (
        <AppLayout>
            <div className="animate-in" style={{ maxWidth: 750, margin: '0 auto' }}>
                <div className="page-header">
                    <h1 className="gradient-text-green">🌿 {t('your_dosha')}</h1>
                </div>

                {/* Result hero */}
                <div className="glass-card" style={{
                    padding: 36, marginBottom: 24, textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(217,119,6,0.05))',
                    border: '1px solid rgba(22,163,74,0.25)',
                }}>
                    <div style={{ fontSize: 52, marginBottom: 8 }}>{info.emoji}</div>
                    <h2 style={{ fontSize: 32, fontWeight: 900, color: info.color, fontFamily: 'Plus Jakarta Sans', marginBottom: 8 }}>
                        {data.result}
                    </h2>
                    <p style={{ fontSize: 15, color: '#94aec8', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
                        {info.personality}
                    </p>
                </div>

                {/* Dosha bars */}
                <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f7ff', marginBottom: 18 }}>Constitution Breakdown</h3>
                    <DoshaBar label="Vata" score={data.vataScore} color="#22d3ee" icon={Wind} />
                    <DoshaBar label="Pitta" score={data.pittaScore} color="#f59e0b" icon={Flame} />
                    <DoshaBar label="Kapha" score={data.kaphaScore} color="#10b981" icon={Droplets} />
                </div>

                {/* Recommendations */}
                <div className="grid-2" style={{ marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: 24 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#22c55e', marginBottom: 14 }}>🍽 Diet</h4>
                        {info.diet.map((d, i) => (
                            <div key={i} style={{ fontSize: 13, color: '#94aec8', padding: '6px 0', borderBottom: '1px solid #1a2d45', display: 'flex', gap: 8 }}>
                                <span style={{ color: '#22c55e' }}>•</span> {d}
                            </div>
                        ))}
                    </div>
                    <div className="glass-card" style={{ padding: 24 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#d97706', marginBottom: 14 }}>🧘 Lifestyle</h4>
                        {info.lifestyle.map((l, i) => (
                            <div key={i} style={{ fontSize: 13, color: '#94aec8', padding: '6px 0', borderBottom: '1px solid #1a2d45', display: 'flex', gap: 8 }}>
                                <span style={{ color: '#d97706' }}>•</span> {l}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid-2" style={{ marginBottom: 24 }}>
                    <div className="glass-card" style={{ padding: 24 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#3b82f6', marginBottom: 14 }}>🏃 Exercise</h4>
                        {info.exercise.map((e, i) => (
                            <div key={i} style={{ fontSize: 13, color: '#94aec8', padding: '6px 0', borderBottom: '1px solid #1a2d45', display: 'flex', gap: 8 }}>
                                <span style={{ color: '#3b82f6' }}>•</span> {e}
                            </div>
                        ))}
                    </div>
                    <div className="glass-card" style={{ padding: 24 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f59e0b', marginBottom: 14 }}>🌤 Seasonal</h4>
                        <p style={{ fontSize: 13, color: '#94aec8', lineHeight: 1.6 }}>{info.seasonal}</p>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <Link href="/ayurveda">
                        <button className="btn-secondary"><ArrowLeft size={15} /> Back</button>
                    </Link>
                    <button className="btn-primary" onClick={handleSave} disabled={saved || saving}>
                        {saved ? <><CheckCircle size={15} /> {t('saved')}</> : saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Save size={15} /> {t('save_history')}</>}
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
