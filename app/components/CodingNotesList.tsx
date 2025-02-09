"use client"
import React, {useState} from 'react';
import {useAuth} from "@/app/context/authContext";
import {addUserNote, getUserNotes} from "../firebase/firestore";
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import Loading from "@/app/components/Loading";
import {useDeviceType} from "@/app/hooks/useDeviceType";
import {NotesFetcher} from "@/app/state/NotesFetcher";
import {currentNote, notes} from "@/app/state/notes";
import {useAtom, useSetAtom} from "jotai";

const CodingNotesList = () => {
    const isMobile = useDeviceType();
    const setCurrentNote = useSetAtom(currentNote);
    const {user ,loading} = useAuth();
    const [notesList, setNotes] = useAtom(notes);
    const [showAddNote, setShowAddNote] = useState(false);
    const [noteInput, setInputNote] = useState<string>('')
    const router = useRouter()
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const noteId = Array.isArray(params?.noteId) ? params.noteId[0] : params?.noteId;

    const handleAddNoteSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
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
            const newNote = { id: newNoteId, content: noteInput.trim() };
            setCurrentNote(newNote);
            router.push(`/${newNoteId}`,{ scroll: false });
        }
        setInputNote(""); // Clear input field
        setShowAddNote(false)
        getUserNotes(user.uid).then((notes) => {
            setNotes(notes.map(note => ({ id: note.id, content: note.content || "" })));
        });

    };

    const handleNavigate = (id: string) => {
        router.push(`/${id}`, { scroll: false });

    };

    NotesFetcher();

    if (!notesList) {
        return <Loading />
    }

    // const isHtml = (str: string): boolean => {
    //     const pattern = /<\/?[a-z][\s\S]*>/i;
    //     return pattern.test(str);
    // };
    if (loading) {
        return <Loading />;
    }
    if (!user) {return null}

    return (
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'columns-3xs'}`}>
            {notesList.map(note => (
                <div key={note.id} className={` border h-22 ${note.id === noteId ? 'bg-gray-100' : ''}`}>

                    <button key={note.id} onClick={() => handleNavigate(note.id)} className="w-full text-left">
                        <div className="p-6 break-words whitespace-normal min-w-0">
                            {note.content}

                            </div>
                    </button>
                </div>
                    ))}

                    {
                        !showAddNote ?
                            <button onClick={() => setShowAddNote((prev) => !prev)}
                                    className="p-6 border rounded-l w-full hover:bg-sky-300">Add a note</button>
                            :
                            <form onSubmit={handleAddNoteSubmit}>

                                <input type="text" value={noteInput} onChange={(e) => setInputNote(e.target.value)}
                                       className={"p-6 border rounded-l w-full "} placeholder="Enter a note title"/>
                            </form>
                    }

                    {error && <div className="text-red-500">{error}</div>}
                </div>
            );
            };

            export default CodingNotesList;