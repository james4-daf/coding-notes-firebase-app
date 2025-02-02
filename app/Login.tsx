'use client';

import { useAuth } from './context/authContext';
import { useEffect} from "react";
import {router} from "next/client";

export default function Login() {
    const { signIn,user } = useAuth();


    useEffect(() => {
        if(user) {
            router.push('/');
        }
    }, [user])

    return (
        <div>
            <h1>Please sign in to view content</h1>
    <button onClick={signIn}>Sign in with Google</button>
    </div>
        );
}