'use client'
import React, { useEffect } from 'react'
import { useNotes } from "@/app/context/NoteContext";
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAuth } from "@/app/context/authContext";
import { updateNoteContent, getUserNotes } from "@/app/firebase/firestore";
import {Note} from "@/app/components/CodingNotesList";

export default function NotesEditor() {
    const { user } = useAuth();
    const { currentNote, setCurrentNote, setNotes } = useNotes();

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        immediatelyRender: false,
        content: `${currentNote?.content}`,
        onUpdate: ({ editor }) => {
            const newContent = editor.getHTML();

            if (currentNote && newContent !== currentNote.content) {
                // Update current note directly
                setCurrentNote({
                    ...currentNote,
                    content: newContent
                });

                // Update notes list in context
                setNotes((prevNotes: Note[]) =>
                    prevNotes.map((note: Note) =>
                        note.id === currentNote.id ? { ...note, content: newContent } : note
                    )
                );

                // Save to Firestore
                if (user?.uid) {
                    updateNoteContent(user.uid, currentNote.id, newContent);
                }
            }
        },
    });

    useEffect(() => {
        if (user?.uid) {
            getUserNotes(user.uid).then(setNotes);
        }
    }, [user, setNotes]);

    useEffect(() => {
        if (editor && currentNote) {
            editor.commands.setContent(currentNote.content);
        }
    }, [currentNote, editor]);

    if (!currentNote) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <EditorContent editor={editor} className="focus:outline-none outline-0" />
        </div>
    );
}