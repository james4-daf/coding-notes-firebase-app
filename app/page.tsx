'use client';

import { useAuth } from './context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/notePad'); // Redirect authenticated users to dashboard
        } else {
            router.push('/auth'); // Redirect unauthenticated users to login
        }
    }, [user, router]);

    return null; // No content on this page
}