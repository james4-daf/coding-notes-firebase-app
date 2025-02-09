import React, { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAuth } from "@/app/context/authContext";
import {currentNote, editorContent, isLoading, notes} from "@/app/state/notes";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {SingleNotesFetcher} from "@/app/SingleNoteFetcher";
import {doc, onSnapshot, updateDoc,serverTimestamp} from "firebase/firestore";
import {db} from "@/app/firebase/firebaseConfig";

export default function NotesEditor() {
    const setEditorContent = useSetAtom(editorContent);
    const [selectedNote] = useAtom(currentNote);
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);
    const loading = useAtomValue(isLoading);
    const setNotes = useSetAtom(notes);

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
                    note.id === selectedNote?.id ? { ...note, content: newContent,lastModified: new Date() } : note
                )
            );

            setHasEdited(true);

            // Debounce saving to Firestore
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            setSaving(true);
            saveTimerRef.current = setTimeout(() => {
                if (selectedNote && user?.uid) {
                    updateDoc(doc(db, "users", user.uid, "notes", selectedNote.id), {
                        content: newContent,
                        lastModified: serverTimestamp(),
                    }).then(() => setSaving(false));
                }
            }, 1000); // 1s debounce
        },
    });

    useEffect(() => {
        if (!user?.uid || !selectedNote?.id || !editor) return;

        const noteRef = doc(db, "users", user.uid, "notes", selectedNote.id);
        const unsubscribe = onSnapshot(noteRef, (doc) => {
            if (doc.exists()) {
                const newContent = doc.data().content;
                const currentContent = editor.getHTML();

                if (newContent !== currentContent) {
                    // Preserve cursor
                    const { from, to } = editor.state.selection;
                    editor.commands.setContent(newContent, false);
                    editor.commands.setTextSelection({ from, to });
                }
            }
        });

        return () => unsubscribe();
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
            {selectedNote?.lastModified ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(selectedNote.lastModified) : "No date"}
        </div>
    );
}