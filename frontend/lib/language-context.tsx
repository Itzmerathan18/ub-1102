'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations } from './translations';
import type { Lang } from './translations';
export type { Lang };

interface LangContextType {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
    lang: 'en', setLang: () => { }, t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>('en');

    useEffect(() => {
        const stored = localStorage.getItem('jeevaloom_lang') as Lang;
        if (stored && ['en', 'hi', 'kn'].includes(stored)) setLangState(stored);
    }, []);

    const setLang = (l: Lang) => {
        localStorage.setItem('jeevaloom_lang', l);
        setLangState(l);
    };

    const t = (key: string) => translations[lang][key] || translations['en'][key] || key;

    return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
