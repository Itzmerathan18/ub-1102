'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    language: string;
    phoneNumber?: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null, token: null, login: () => { }, logout: () => { }, isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('jeevaloom_token');
            const storedUser = localStorage.getItem('jeevaloom_user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch {
            // Corrupted storage — clear it
            localStorage.removeItem('jeevaloom_token');
            localStorage.removeItem('jeevaloom_user');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        // Persist first, then set state, then navigate
        localStorage.setItem('jeevaloom_token', newToken);
        localStorage.setItem('jeevaloom_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        // Use replace so back button doesn't return to login
        router.replace('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('jeevaloom_token');
        localStorage.removeItem('jeevaloom_user');
        setToken(null);
        setUser(null);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
