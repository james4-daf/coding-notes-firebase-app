'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; //
import { auth } from '../firebase/firebaseConfig';
import {NoteProvider} from "@/app/context/NoteContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;

                // ...
                // console.log("uid", uid)
                router.push('/notepad'); //
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
            }
        });
        return () => unsubscribe();
    }, [user]);

    const signIn = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logOut = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, logOut, loading }}>
            <NoteProvider>

    {children}
            </NoteProvider>
    </AuthContext.Provider>
);
}

export function useAuth() {
    return useContext(AuthContext);
}