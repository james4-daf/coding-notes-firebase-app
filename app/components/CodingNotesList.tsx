"use client"
import React, {useState,useEffect,useContext} from 'react';
import {useAuth} from "@/app/context/authContext";
import {addUserNote, deleteUserNote, getUserNotes} from "../firebase/firestore";
import { useRouter } from 'next/navigation'
import {NoteContext} from "@/app/context/NoteContext";
import { useParams } from 'next/navigation';
import Loading from "@/app/components/Loading";
import {useDeviceType} from "@/app/hooks/useDeviceType";

export interface Note {
    id: string;
    content: string;
}

interface NoteContextType {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    currentNote: Note | null;
    setCurrentNote: React.Dispatch<React.SetStateAction<Note | null>>;
}

const CodingNotesList = () => {
    const isMobile = useDeviceType();
    const {user ,loading} = useAuth();
    const { notes, setNotes,setCurrentNote } = useContext(NoteContext) as NoteContextType;
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

    const handleNavigate = async  (id: string) => {
        if (!user) return; // Ensure user exists
        const selectedNote = notes.find((note) => note.id === id);
        if (selectedNote) {
            setCurrentNote(selectedNote);
            await getUserNotes(user?.uid).then(setNotes);

            router.push(`/${id}`,{ scroll: false });
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!user) return; // Ensure user exists
            if (event.key === "Backspace" && noteId && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA" && !document.activeElement?.classList.contains("ProseMirror")) {
                event.preventDefault();

                deleteUserNote(user.uid, noteId).then(() => {
                    getUserNotes(user.uid).then(setNotes);
                    setCurrentNote(null);
                    router.push("/");
                });
            }
        };


        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [noteId, user, setNotes, setCurrentNote, router]);

    useEffect(() => {
        if (user) {
            // console.log(user.uid);
            getUserNotes(user.uid).then(setNotes);
        }
    }, [user, setNotes]);


    if (!notes) {
        return <Loading />
    }


    const isHtml = (str: string): boolean => {
        const pattern = /<\/?[a-z][\s\S]*>/i;
        return pattern.test(str);
    };
    if (loading) {
        return <Loading />;
    }
    if (!user) {return null}

    return (
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'columns-3xs min-w-64'}`}>
            {notes?.map((note) => (
                <div key={note.id} className={`border h-22 ${note.id === noteId ? 'bg-gray-100' : ''}`}>
                    <button onClick={() => handleNavigate(note.id)} className="w-full text-left">
                        <div className="p-6">
                            <b>
                                {isHtml(note.content) ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: note.content.match(/<p>.*?<\/p>/)?.[0] ?? '',
                                        }}
                                    ></div>
                                ) : (
                                    note.content
                                )}
                            </b>
                            {/*<div className="font-thin">*/}
                            {/*    {isHtml(note.content) ? (*/}
                            {/*        <p*/}
                            {/*            dangerouslySetInnerHTML={{*/}
                            {/*                __html: note.content.match(/<p>.*?<\/p>/)?.[1],*/}
                            {/*            }}*/}
                            {/*        ></p>*/}
                            {/*    ) : (*/}
                            {/*        note.content*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            {/*<b className="block" dangerouslySetInnerHTML={{__html: note.content.match(/<p>.*?<\/p>/)?.[0] }}></b>*/}
                            <p className="font-thin"
                               dangerouslySetInnerHTML={{__html: note.content.replace(/^<p>.*?<\/p>/, "").trim().substring(0, 15) + "..."}}></p>
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