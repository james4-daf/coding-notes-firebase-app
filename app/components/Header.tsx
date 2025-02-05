'use client';
import { useAuth } from '../context/authContext';
import Link from 'next/link';
import {useDeviceType} from "@/app/hooks/useDeviceType";
import {useParams} from "next/navigation";


export const Header = () => {
    const isMobile = useDeviceType();
    const { user, loading, signOutFromGoogle,signInWithGoogle } = useAuth();
    const params = useParams();
    if (!user) {return null}
    const noteId = params?.noteId;

    return (

        <div className='py-4 px-8 border-b font-medium flex justify-between'>
            {isMobile && noteId  && <Link href="/" className="text-blue-500 hover:underline">← Back</Link>}
            <p>Welcome, {user?.displayName || 'User'}!</p>

    {!loading && (
        <button
            type='button'
        className='hover:underline'
        onClick={user ? signOutFromGoogle : signInWithGoogle}
            >
            Log {user ? <>out</> : <>in</>}
        </button>
    )}
    </div>
);
};