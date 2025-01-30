"use client";
import {createContext, useEffect, useState} from "react";
import {getUserNotes} from "@/app/firebase/firestore";
import {useAuth} from "@/app/context/authContext";
export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
    const {user} = useAuth();
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);

    useEffect(() => {
        if (user) {
            // console.log(user.uid);
            getUserNotes(user.uid).then(setNotes);

        }
    }, [user]);

    // console.log(notes);


    return (
        <NoteContext.Provider value={{ currentNote, setCurrentNote,notes, setNotes }}>
            {children}
        </NoteContext.Provider>
    );
};

