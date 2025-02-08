"use client";

import { atom } from "jotai";

export interface Note {
    id: string;
    content: string;
}

interface NoteContextType {
    notesList: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    currentNote: Note | null;
    setCurrentNote: (note: Note | null) => void;
}

// Atoms for managing state globally
export const notes = atom<Note[]>([]);
export const currentNote = atom<Note | null>(null);
export const editorContent = atom<string>("");
export const isLoading = atom<boolean>(false);
