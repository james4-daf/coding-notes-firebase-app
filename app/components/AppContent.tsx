'use client';

import { useAuth } from '../context/authContext';
import { Header } from "@/app/components/Header";
import CodingNotesList from "@/app/components/CodingNotesList";
import Login from "../components/Login"
import Loading from "../components/Loading"


export default function AppContent({ children }: { children: React.ReactNode }) {
    const { user,loading } = useAuth();
    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Login />; // Show centered login when not logged in
    }

    return (
        <>
            <Header />
            <div className="flex columns-2 gap-4 p-8">
                <CodingNotesList />
                {children}
            </div>
        </>
    );
}