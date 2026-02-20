'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
}>({ theme: 'dark', setTheme: () => { }, toggleTheme: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');

    useEffect(() => {
        const saved = localStorage.getItem('jeevaloom_theme') as Theme;
        if (saved === 'light' || saved === 'dark') {
            setThemeState(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem('jeevaloom_theme', t);
        document.documentElement.setAttribute('data-theme', t);
    };

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
