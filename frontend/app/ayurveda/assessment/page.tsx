'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { saveAyurvedaAssessment } from '@/lib/api';

const doshaQuestions = [
    { q: 'My body frame is:', a: 'Thin and lean', b: 'Medium, well-proportioned', c: 'Large and broad' },
    { q: 'My skin tends to be:', a: 'Dry and rough', b: 'Oily, sensitive to sun', c: 'Smooth and moist' },
    { q: 'My hair is:', a: 'Dry, thin, frizzy', b: 'Fine, straight, thinning early', c: 'Thick, heavy, wavy' },
    { q: 'My appetite is:', a: 'Variable, sometimes forget to eat', b: 'Strong, I get irritable if hungry', c: 'Steady, can skip meals easily' },
    { q: 'My digestion is:', a: 'Irregular, prone to gas/bloating', b: 'Fast, prone to acidity', c: 'Slow, heavy feeling after meals' },
    { q: 'My sleep pattern is:', a: 'Light, interrupted, difficulty falling asleep', b: 'Moderate, wake up alert', c: 'Heavy, deep, hard to wake up' },
    { q: 'My energy levels are:', a: 'Variable — bursts of energy then fatigue', b: 'Moderate — focused and intense', c: 'Steady — slow to start but enduring' },
    { q: 'My temperament is:', a: 'Anxious, nervous, creative', b: 'Ambitious, competitive, focused', c: 'Calm, patient, compassionate' },
    { q: 'Under stress, I tend to:', a: 'Worry and overthink', b: 'Become irritable or angry', c: 'Withdraw and become passive' },
    { q: 'My learning style is:', a: 'Quick to learn, quick to forget', b: 'Focused, sharp grasp', c: 'Slow to learn, but excellent memory' },
    { q: 'My preferred weather is:', a: 'Warm and humid', b: 'Cool and dry', c: 'Warm and dry' },
    { q: 'My joints are:', a: 'Thin, prominent, tend to crack', b: 'Loose, flexible', c: 'Large, well-padded, stable' },
    { q: 'My physical activity preference:', a: 'Light — yoga, walking', b: 'Moderate — competitive sports', c: 'Minimal — can be sedentary' },
    { q: 'My speech pattern is:', a: 'Fast, talkative', b: 'Sharp, convincing', c: 'Slow, melodious' },
    { q: 'My bowel movements are:', a: 'Irregular, tendency to constipation', b: 'Regular, sometimes loose', c: 'Regular, heavy, well-formed' },
];

export default function AyurvedaAssessmentPage() {
    const { t } = useLang();
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, 'a' | 'b' | 'c'>>({});
    const [loading, setLoading] = useState(false);

    const handleSelect = (option: 'a' | 'b' | 'c') => {
        setAnswers(prev => ({ ...prev, [current]: option }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        let vata = 0, pitta = 0, kapha = 0;
        Object.values(answers).forEach(val => {
            if (val === 'a') vata++;
            else if (val === 'b') pitta++;
            else kapha++;
        });

        const vataScore = Math.round((vata / doshaQuestions.length) * 100);
        const pittaScore = Math.round((pitta / doshaQuestions.length) * 100);
        const kaphaScore = Math.round((kapha / doshaQuestions.length) * 100);

        let result = 'Vata';
        const max = Math.max(vata, pitta, kapha);
        const types: string[] = [];
        if (vata === max) types.push('Vata');
        if (pitta === max) types.push('Pitta');
        if (kapha === max) types.push('Kapha');
        result = types.join('-');

        try {
            await saveAyurvedaAssessment({
                answers,
                result,
                vataScore,
                pittaScore,
                kaphaScore,
            });
            router.push('/dashboard?assessment_saved=true');
        } catch (err) {
            console.error('Failed to save assessment', err);
            // Fallback
            const data = JSON.stringify({ answers, result, vataScore, pittaScore, kaphaScore });
            sessionStorage.setItem('ayurveda_result', data);
            router.push('/ayurveda/result');
        } finally {
            setLoading(false);
        }
    };

    const q = doshaQuestions[current];
    const progress = ((current + 1) / doshaQuestions.length) * 100;

    return (
        <AppLayout>
            <div className="animate-in" style={{ maxWidth: 700, margin: '0 auto' }}>
                <div className="page-header">
                    <h1 className="gradient-text-green">🌿 {t('dosha_assessment')}</h1>
                    <p>{t('question')} {current + 1} {t('of')} {doshaQuestions.length}</p>
                </div>

                {/* Progress bar */}
                <div className="progress-bar-track" style={{ marginBottom: 28 }}>
                    <div className="progress-bar-fill-green" style={{ width: `${progress}%` }} />
                </div>

                {/* Question */}
                <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0f7ff', marginBottom: 24 }}>
                        {q.q}
                    </h3>

                    {[
                        { key: 'a' as const, text: q.a, label: 'A' },
                        { key: 'b' as const, text: q.b, label: 'B' },
                        { key: 'c' as const, text: q.c, label: 'C' },
                    ].map(opt => (
                        <div
                            key={opt.key}
                            className={`question-option ${answers[current] === opt.key ? 'selected-ayurveda' : ''}`}
                            onClick={() => handleSelect(opt.key)}
                        >
                            <div className={`option-letter ${answers[current] === opt.key ? 'option-letter-green' : ''}`}
                                style={answers[current] !== opt.key ? { background: 'rgba(74,100,128,0.15)', color: '#4a6480' } : {}}
                            >
                                {answers[current] === opt.key ? <CheckCircle2 size={16} /> : opt.label}
                            </div>
                            <span style={{ fontSize: 15, color: answers[current] === opt.key ? '#22c55e' : '#94aec8', fontWeight: answers[current] === opt.key ? 600 : 400 }}>
                                {opt.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setCurrent(Math.max(0, current - 1))}
                        disabled={current === 0}
                        style={{ opacity: current === 0 ? 0.4 : 1 }}
                    >
                        <ArrowLeft size={15} /> {t('previous')}
                    </button>

                    {current < doshaQuestions.length - 1 ? (
                        <button
                            className="btn-primary"
                            onClick={() => setCurrent(current + 1)}
                            disabled={!answers[current]}
                            style={{ opacity: !answers[current] ? 0.5 : 1 }}
                        >
                            {t('next')} <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={loading || Object.keys(answers).length < doshaQuestions.length}
                            style={{ opacity: (loading || Object.keys(answers).length < doshaQuestions.length) ? 0.5 : 1 }}
                        >
                            {loading ? <span className="spinner" /> : <>{t('submit')} <CheckCircle2 size={15} /></>}
                        </button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
