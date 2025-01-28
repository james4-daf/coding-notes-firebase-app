// app/RequireAuth.tsx
'use client';

import { useAuth } from './context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthWraper({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login'); // Redirect to login if not signed in
        }
    }, [user, router]);

    if (!user) {
        return null; // Optionally show a loading state here
    }

    return <>{children}</>;
}