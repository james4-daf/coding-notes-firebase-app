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
                // router.push('/notepad'); //
            } else {
                // User is signed out
                // ...
                router.push('/');
                console.log("user is logged out")
            }
        });
        return () => unsubscribe();
    }, [user]);

     const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            const user = result.user;

            // window.alert(`Signed in with ${user.email}`);
            router.push('/');
        } catch (e) {
            window.alert(e.message);
        }
    };


     const signOutFromGoogle = async () => {
        try {
            await signOut(auth);

            // window.alert('Signed out!');
        } catch (e) {
            window.alert(e.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOutFromGoogle, loading }}>
            <NoteProvider>

    {children}
            </NoteProvider>
    </AuthContext.Provider>
);
}

export function useAuth() {
    return useContext(AuthContext);
}