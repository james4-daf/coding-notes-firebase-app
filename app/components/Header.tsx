'use client';
import { useAuth } from '../context/authContext';
import Link from 'next/link';


export const Header = () => {
    const { user, loading, signOutFromGoogle,signInWithGoogle } = useAuth();
    if (!user) {return null}

    return (

        <div className='py-4 px-8 border-b font-medium flex justify-between'>
            <Link href={'/notepad'}>Dashboard</Link>
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