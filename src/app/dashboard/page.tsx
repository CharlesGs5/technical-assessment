'use client';

import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui/button";
import { ENCRYPTION_KEY } from '@/lib/constants';
import Board from "@/components/board/Board";

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
        <main className="p-8">
            <h1 className="text-3xl font-bold">Bienvenido al Dashboard</h1>
            <Board/>

            <Button
                onClick={() => {
                    localStorage.removeItem('auth_token');
                    router.push('/signin');
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Cerrar sesión
            </Button>
        </main>
    );
}
