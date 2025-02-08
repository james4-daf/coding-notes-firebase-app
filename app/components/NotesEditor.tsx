import React, { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAuth } from "@/app/context/authContext";
import { useParams } from "next/navigation";
import {currentNote, editorContent, isLoading, notes} from "@/app/state/notes";
import {useAtom, useAtomValue} from "jotai";
import {SingleNotesFetcher} from "@/app/SingleNoteFetcher";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/firebaseConfig";

export default function NotesEditor() {
    const [content, setEditorContent] = useAtom(editorContent);
    const [selectedNote] = useAtom(currentNote);
    const { user } = useAuth();
    const params = useParams();
    const [saving, setSaving] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);
    const loading = useAtomValue(isLoading);
    const noteId = Array.isArray(params?.noteId) ? params.noteId[0] : params?.noteId;
    const [notesList, setNotes] = useAtom(notes);


    // console.log(noteId);

    // Local state for editor content
    useEffect(() => {
        if (selectedNote) {
            setEditorContent(selectedNote?.content);
        }
    }, [selectedNote, setEditorContent]);


    // Ref to store debounce timer
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize editor
    // Initialize TipTap editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const newContent = editor.getHTML();

            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === selectedNote?.id ? { ...note, content: newContent } : note
                )
            );

            setHasEdited(true);
            setSaving(true);

            // Debounce saving to Firestore
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            setSaving(true);
            saveTimerRef.current = setTimeout(() => {
                if (selectedNote && user?.uid) {
                    updateDoc(doc(db, "users", user.uid, "notes", selectedNote.id), {
                        content: newContent
                    }).then(() => setSaving(false));
                }
            }, 1000); // 1s debounce
        },
    });

    // Firestore Live Sync: Listen for real-time updates
    useEffect(() => {
        if (!user?.uid || !selectedNote?.id) return;

        const noteRef = doc(db, "users", user.uid, "notes", selectedNote.id);
        const unsubscribe = onSnapshot(noteRef, (doc) => {
            if (doc.exists() && editor) {
                editor.commands.setContent(doc.data().content, false);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [user?.uid, selectedNote?.id, editor]);

    if (loading) return <p>Loading notes...</p>;

    return (
        <div>
            <SingleNotesFetcher />
            {hasEdited && (saving ? (
                <p className="text-sm text-gray-500 animate-pulse text-right">Saving...</p>
            ) : (
                <p className="text-sm text-gray-500 text-right">Saved</p>
            ))}
            <EditorContent editor={editor} className="focus:outline-none outline-0 min-w-96" />
        </div>
    );
}