"use client"
import React, {useState,useEffect,useContext} from 'react';
import {useAuth} from "@/app/context/authContext";
import {addUserNote, getUserNotes} from "../firebase/firestore";
import { useRouter } from 'next/navigation'
import {NoteContext} from "@/app/context/NoteContext";

interface Note {
    id: string;
    title: string;
    content: string;
}

interface NoteContextType {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    currentNote: Note | null;
    setCurrentNote: React.Dispatch<React.SetStateAction<Note | null>>;
}


const CodingNotesList = () => {
    const {user} = useAuth();
    const { notes, setNotes,setCurrentNote } = useContext(NoteContext) as NoteContextType;
    const [showAddNote, setShowAddNote] = useState(false);
    const [noteInput, setInputNote] = useState<string>('')
    const router = useRouter()
    const [error, setError] = useState<string | null>(null);

    const handleAddNoteSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in to add a note.');
            return;
        }

        if (!noteInput.trim()) {
            setError('Note title cannot be empty.');
            return;
        }

        setError(null);

        const newNoteId = await addUserNote(user.uid, noteInput.trim());
        if (newNoteId) {
            const newNote = { id: newNoteId, title: noteInput.trim(), content: "new note" };
            setCurrentNote(newNote);
            router.push(`/notepad/${newNoteId}`);
        }
        setInputNote(""); // Clear input field
        getUserNotes(user.uid).then(setNotes);
    };

    const handleNavigate = (id: string) => {
        const selectedNote = notes.find((note) => note.id === id);
        if (selectedNote) {
            setCurrentNote(selectedNote);
            router.push(`/notepad/${id}`);
        }
    };

    useEffect(() => {
        if (user) {
            // console.log(user.uid);
            getUserNotes(user.uid).then(setNotes);
        }
    }, [user]);


    if (!notes) {
        return <div className="text-center my-8">Loading notes...</div>;
    }

    return (
        <div className="columns-3xs">
            {notes?.map((note) => (
                <div key={note.id} className="border h-22">
                    <button onClick={() => handleNavigate(note.id)} className="w-full">
                        <div className="p-6">
                            <b>{note.title}</b>
                            <p className="font-thin">{note.content}</p>
                        </div>
                    </button>
                </div>
            ))}

            {
                !showAddNote ?
            <button onClick={() => setShowAddNote((prev) => !prev)} className="p-6 border rounded-l w-full hover:bg-sky-300">Add a note</button>
                    :
                    <form onSubmit={handleAddNoteSubmit}>

                    <input type="text" value={noteInput} onChange={(e) => setInputNote(e.target.value)} className={"p-6 border rounded-l w-full "} placeholder="Enter a note title"/>
                    </form>
            }
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

export default CodingNotesList;