'use client';

import { useAuth } from '../context/authContext';
import { Header } from "@/app/components/Header";
import CodingNotesList from "@/app/components/CodingNotesList";
import Login from "../components/Login"
import Loading from "../components/Loading"
import {useDeviceType} from "@/app/hooks/useDeviceType";
import NotesEditor from "@/app/[noteId]/page";
import { useParams } from "next/navigation";

export default function AppContent() {
    const { user, loading } = useAuth();
    const isMobile = useDeviceType();
    const params = useParams();
    const noteId = params?.noteId;

    if (loading) {
        return <Loading />; // Show centered login when not logged in
    }
    if (!user) {
        return <Login />; // Show centered login when not logged in
    }

    return (
        <>
                <Header />
                {isMobile ? (
                    // Mobile: Show only one view at a time
                    <div className="p-4 " >
                        {noteId ? <NotesEditor/> : <CodingNotesList/>}
                    </div>
                ) : (
                    // Desktop: Show both side by side
                    <div className="flex gap-4 p-8 transition-all">
                        <div className="basis-[23%] ">
                            <CodingNotesList/>
                        </div>
                        {noteId &&
                            <div className="basis-[76%]">
                                <NotesEditor/>
                            </div>
                            }
                    </div>

                )}
        </>

    );
}