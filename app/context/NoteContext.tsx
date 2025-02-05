"use client";
import {createContext, ReactNode, useEffect, useState, useContext} from "react";
import {getUserNotes} from "@/app/firebase/firestore";
import {useAuth} from "@/app/context/authContext";


interface Note {
    id: string;
    content: string;
}

// Define a type for the context
interface NoteContextType {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    currentNote: Note | null;
    setCurrentNote: (note: Note | null) => void;
}

// Create a context with proper typing
export const NoteContext = createContext<NoteContextType | null>(null);

export function NoteProvider({ children }: { children: ReactNode }) {
    const {user} = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);

    useEffect(() => {
        if (user) {
            // console.log(user.uid);
            // Assuming getUserNotes returns an array of objects with { id: string, content: string }
            getUserNotes(user.uid).then((fetchedNotes: Note[]) => {
                setNotes(fetchedNotes); // Now it's of type Note[]
            });

        }
    }, [user]);

    // console.log(notes);
    useEffect(() => {
        if (currentNote) {
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === currentNote.id ? { ...note, content: currentNote.content } : note
                )
            );
        }
    }, [currentNote]);


    return (
        <NoteContext.Provider value={{ currentNote, setCurrentNote,notes, setNotes }}>
            {children}
        </NoteContext.Provider>
    );
};


// Custom hook to use NoteContext with safety
export function useNotes() {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error("useNotes must be used within a NoteProvider");
    }
    return context;
}

