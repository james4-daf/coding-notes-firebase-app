import { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { currentNote, notes } from "@/app/state/notes";
import { getUserNotes } from "@/app/firebase/firestore";
import { useAuth } from "@/app/context/authContext";
import { useParams } from "next/navigation";

export function SingleNotesFetcher() {
    const {user} = useAuth();
    const noteId = useParams()?.noteId; // Get noteId from URL
    const setNotes = useSetAtom(notes);
    const setCurrentNote = useSetAtom(currentNote);

    const allNotes = useAtomValue(notes); // Read the existing notes from state

    useEffect(() => {
        if (!user) return;

        async function fetchNotes() {
            const fetchedNotes = await getUserNotes(user.uid);
            setNotes(fetchedNotes); // Store all notes in state

            // If we have a noteId from the URL, find the matching note
            const selectedNote = noteId ? fetchedNotes.find(note => note.id === noteId) : null;

            // Set the found note, or fallback to the first note if available
            setCurrentNote(selectedNote);

        }

        fetchNotes();
    }, [user, noteId, setNotes, setCurrentNote]);

    return null; // No UI needed
}