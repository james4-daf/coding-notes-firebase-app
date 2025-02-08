'use client';

import { createContext, useContext, useEffect, useState,ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; //
import { auth } from '../firebase/firebaseConfig';
import {User} from "firebase/auth";

interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    signOutFromGoogle: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    {
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
                setLoading(false);
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    // const uid = user.uid;
                    // console.log("User is logged in:", user);
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
        }, [user, router]);

        const signInWithGoogle = async () => {
            try {
                const result = await signInWithPopup(auth, new GoogleAuthProvider());
                const user = result.user;

                console.log(`Signed in with ${user.email}`);
                router.push('/');
            } catch (e) {
                if (e instanceof Error) {
                    window.alert(e.message); // Now TypeScript knows e has a 'message' property
                } else {
                    console.error("An unknown error occurred", e);
                }
            }
        };

        const signOutFromGoogle = async () => {
            try {
                await signOut(auth);

                // window.alert('Signed out!');
            } catch (e) {
                if (e instanceof Error) {
                    window.alert(e.message); // Now TypeScript knows e has a 'message' property
                } else {
                    console.error("An unknown error occurred", e);
                }
            }
        };

        return (
            <AuthContext.Provider value={{user, signInWithGoogle, signOutFromGoogle, loading}}>
                    {children}
            </AuthContext.Provider>
        );
    }
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}