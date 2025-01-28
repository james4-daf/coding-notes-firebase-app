"use client"
import {AuthProvider} from "@/app/context/authContext";
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CodingNotesList from "@/app/components/CodingNotesList";

// interface notesDataTypes {
//   name: string;
//   content: string;
//   id: number;
// }

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const { user, logOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth'); // Redirect unauthenticated users to /auth
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <AuthProvider>
            <nav>
                <h1>Dashboard</h1>
                <p>Welcome, {user?.displayName || 'User'}!</p>
                <button onClick={logOut}>logOut</button>
            </nav>
            <div className="flex columns-2 gap-4 p-8">
                <CodingNotesList />
                {children}
            </div>
        </AuthProvider>
    );
}
