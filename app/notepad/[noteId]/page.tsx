'use client'
import React, {useContext} from 'react'
import {NoteContext} from "@/app/context/NoteContext";

export default function NotesEditor() {
    const { currentNote } = useContext(NoteContext);

    if (!currentNote) {
        return <p>Loading...</p>;
    }

    //  console.log("currentNote",currentNote)
    // console.log("params",params.noteId)

    return (
        <div>
            <h1>{currentNote.title}</h1>
            <p>{currentNote.content}</p>
        </div>
    );
}