'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useLang } from '@/lib/language-context';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const healthQuestions = [
    { q: 'What is your age group?', options: ['18-25', '26-35', '36-45', '46-55', '56+'] },
    { q: 'What is your height (cm)?', input: 'number', placeholder: 'e.g. 170' },
    { q: 'What is your weight (kg)?', input: 'number', placeholder: 'e.g. 70' },
    { q: 'How would you rate your physical activity level?', options: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'] },
    { q: 'How many hours of sleep do you get per night?', options: ['Less than 5', '5-6 hours', '7-8 hours', 'More than 8'] },
    { q: 'How often do you feel stressed?', options: ['Rarely', 'Sometimes', 'Often', 'Always'] },
    { q: 'Do you smoke?', options: ['Never', 'Previously (quit)', 'Occasionally', 'Daily'] },
    { q: 'How often do you consume alcohol?', options: ['Never', 'Occasionally (social)', 'Weekly', 'Daily'] },
    { q: 'Do you have a family history of chronic diseases?', options: ['None known', 'Diabetes', 'Heart disease', 'Hypertension', 'Cancer', 'Multiple'] },
    { q: 'Do you have high blood pressure?', options: ['No', 'Borderline', 'Yes, controlled', 'Yes, uncontrolled'] },
    { q: 'Do you have diabetes?', options: ['No', 'Pre-diabetic', 'Type 1', 'Type 2'] },
    { q: 'Do you experience chest pain or shortness of breath?', options: ['Never', 'Rarely', 'During exercise', 'Frequently'] },
    { q: 'How are your digestion and bowel habits?', options: ['Normal', 'Occasional issues', 'Frequent problems', 'Chronic condition'] },
    { q: 'How often do you get headaches?', options: ['Rarely', 'Weekly', 'Several times a week', 'Daily'] },
    { q: 'Are you currently taking any medications?', options: ['None', '1-2 medications', '3-5 medications', 'More than 5'] },
];

import { saveHealthAssessment } from '@/lib/api';

export default function HealthAssessmentPage() {
    const { t } = useLang();
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [current]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Calculate BMI
        const heightVal = parseFloat(answers[1]) || 0;
        const weightVal = parseFloat(answers[2]) || 0;
        const height = heightVal / 100; // cm to m
        const weight = weightVal;
        const bmi = height > 0 ? weight / (height * height) : 0;

        // Risk scoring
        let risk = 0;
        // Activity level
        if (answers[3] === 'Sedentary') risk += 3;
        else if (answers[3] === 'Lightly active') risk += 1;
        // Sleep
        if (answers[4] === 'Less than 5') risk += 3;
        else if (answers[4] === '5-6 hours') risk += 1;
        // Stress
        if (answers[5] === 'Always') risk += 3;
        else if (answers[5] === 'Often') risk += 2;
        // Smoking
        if (answers[6] === 'Daily') risk += 3;
        else if (answers[6] === 'Occasionally') risk += 1;
        // Alcohol
        if (answers[7] === 'Daily') risk += 2;
        else if (answers[7] === 'Weekly') risk += 1;
        // Family history
        if (answers[8] === 'Multiple') risk += 3;
        else if (answers[8] !== 'None known') risk += 1;
        // BP
        if (answers[9]?.includes('uncontrolled')) risk += 3;
        else if (answers[9]?.includes('controlled') || answers[9] === 'Borderline') risk += 1;
        // Diabetes
        if (answers[10]?.includes('Type')) risk += 2;
        else if (answers[10] === 'Pre-diabetic') risk += 1;
        // Chest pain
        if (answers[11] === 'Frequently') risk += 3;
        else if (answers[11] === 'During exercise') risk += 1;
        // Digestion
        if (answers[12] === 'Chronic condition') risk += 2;
        // Headaches
        if (answers[13] === 'Daily') risk += 2;
        // Medications
        if (answers[14] === 'More than 5') risk += 2;
        else if (answers[14] === '3-5 medications') risk += 1;

        // BMI risk
        if (bmi > 30) risk += 3;
        else if (bmi > 25) risk += 1;
        else if (bmi < 18.5) risk += 1;

        const maxRisk = 30;
        const riskScore = Math.min(Math.round((risk / maxRisk) * 100), 100);
        const riskLevel = riskScore <= 25 ? 'low' : riskScore <= 55 ? 'moderate' : 'high';

        try {
            await saveHealthAssessment({
                answers,
                bmi: Math.round(bmi * 10) / 10,
                riskScore,
                riskLevel,
            });
            router.push('/dashboard?assessment_saved=true');
        } catch (err) {
            console.error('Failed to save assessment', err);
            // Fallback
            const data = JSON.stringify({
                answers,
                bmi: Math.round(bmi * 10) / 10,
                riskScore,
                riskLevel,
            });
            sessionStorage.setItem('health_result', data);
            router.push('/english-medicine/result');
        } finally {
            setLoading(false);
        }
    };

    const q = healthQuestions[current];
    const progress = ((current + 1) / healthQuestions.length) * 100;

    return (
        <AppLayout>
            <div className="animate-in" style={{ maxWidth: 700, margin: '0 auto' }}>
                <div className="page-header">
                    <h1 className="gradient-text-blue">🏥 {t('health_assessment')}</h1>
                    <p>{t('question')} {current + 1} {t('of')} {healthQuestions.length}</p>
                </div>

                <div className="progress-bar-track" style={{ marginBottom: 28 }}>
                    <div className="progress-bar-fill-blue" style={{ width: `${progress}%` }} />
                </div>

                <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0f7ff', marginBottom: 24 }}>
                        {q.q}
                    </h3>

                    {q.options && q.options.map(opt => (
                        <div
                            key={opt}
                            className={`question-option ${answers[current] === opt ? 'selected-medicine' : ''}`}
                            onClick={() => handleSelect(opt)}
                        >
                            <div className={`option-letter ${answers[current] === opt ? 'option-letter-blue' : ''}`}
                                style={answers[current] !== opt ? { background: 'rgba(74,100,128,0.15)', color: '#4a6480' } : {}}
                            >
                                {answers[current] === opt ? <CheckCircle2 size={16} /> : '○'}
                            </div>
                            <span style={{ fontSize: 15, color: answers[current] === opt ? '#3b82f6' : '#94aec8', fontWeight: answers[current] === opt ? 600 : 400 }}>
                                {opt}
                            </span>
                        </div>
                    ))}

                    {q.input && (
                        <input
                            className="input-field"
                            type={q.input}
                            placeholder={q.placeholder}
                            value={answers[current] || ''}
                            onChange={e => handleSelect(e.target.value)}
                            style={{ fontSize: 16, padding: 14 }}
                        />
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setCurrent(Math.max(0, current - 1))}
                        disabled={current === 0}
                        style={{ opacity: current === 0 ? 0.4 : 1 }}
                    >
                        <ArrowLeft size={15} /> {t('previous')}
                    </button>

                    {current < healthQuestions.length - 1 ? (
                        <button
                            className="btn-blue"
                            onClick={() => setCurrent(current + 1)}
                            disabled={!answers[current]}
                            style={{ opacity: !answers[current] ? 0.5 : 1 }}
                        >
                            {t('next')} <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            className="btn-blue"
                            onClick={handleSubmit}
                            disabled={loading || Object.keys(answers).length < healthQuestions.length}
                            style={{ opacity: (loading || Object.keys(answers).length < healthQuestions.length) ? 0.5 : 1 }}
                        >
                            {loading ? <span className="spinner" /> : <>{t('submit')} <CheckCircle2 size={15} /></>}
                        </button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
