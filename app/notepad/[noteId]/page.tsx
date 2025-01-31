'use client'
import React, {useContext,useEffect} from 'react'
import {NoteContext} from "@/app/context/NoteContext";
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {useAuth} from "@/app/context/authContext";
import {updateNoteContent,getUserNotes} from "@/app/firebase/firestore";

export default function NotesEditor() {
    const { user } = useAuth();
    const { currentNote, setCurrentNote, setNotes } = useContext(NoteContext);
    const editor = useEditor({
        extensions: [
            StarterKit,

        ],
        immediatelyRender: false,
        content: `${currentNote?.content}`,
        onUpdate: ({ editor }) => {
            const newContent = editor.getHTML();
            if (currentNote && newContent !== currentNote.content) {
                setCurrentNote({ ...currentNote, content: newContent }); // Update local state
                updateNoteContent(user.uid,currentNote.id, newContent); // Save to Firestore
            }
        },
    })

    useEffect(() => {
        if (user) {
            getUserNotes(user.uid).then(setNotes);
        }
    }, [user]);
    if (!currentNote) {
        return <p>Loading...</p>;
    }


    return (
        <div>
            <EditorContent editor={editor} className="focus:outline-none outline-none"/>
        </div>
    );
}