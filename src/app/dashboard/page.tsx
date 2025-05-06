'use client';

import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ENCRYPTION_KEY } from '@/lib/constants';
import Board from '@/components/board/Board';
import styled from 'styled-components';

const MainContainer = styled.main`
  padding: 2rem;
`;

const Heading = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
`;

const LogoutButton = styled(Button)`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border-radius: 0.375rem;

  &:hover {
    background-color: #b91c1c;
  }
`;

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const encrypted = localStorage.getItem('auth_token');

        if (!encrypted) {
            router.push('/signin');
            return;
        }

        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
            const token = bytes.toString(CryptoJS.enc.Utf8);

            if (!token) {
                router.push('/signin');
            } else {
                setLoading(false);
            }
        } catch {
            router.push('/signin');
        }
    }, [router]);

    if (loading) return <p>Cargando...</p>;

    return (
        <MainContainer>
            <Heading>Bienvenido al Dashboard</Heading>
            <Board />

            <LogoutButton
                onClick={() => {
                    localStorage.removeItem('auth_token');
                    router.push('/signin');
                }}
            >
                Cerrar sesión
            </LogoutButton>
        </MainContainer>
    );
}
