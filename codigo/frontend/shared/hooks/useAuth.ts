"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginService } from '@/shared/services/login.service';
import type { UserData } from '@/shared/interfaces/login.interface';

export function useAuth(requiredType?: 'ALUNO' | 'EMPRESA' | 'PROFESSOR') {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userData = loginService.getUserData();

        if (!userData) {
            router.push('/login');
            return;
        }

        if (requiredType && userData.tipo !== requiredType) {
            router.push('/login');
            return;
        }

        setUser(userData);
        setIsLoading(false);
    }, [router, requiredType]);

    const logout = () => {
        loginService.logout();
        router.push('/login');
    };

    return { user, isLoading, logout };
}