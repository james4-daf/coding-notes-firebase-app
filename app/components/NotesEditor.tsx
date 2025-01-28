"use client"
import React from 'react';
import { signInWithGoogle } from "../firebase/auth";


const notesData: notesDataTypes[] = [
    {name: "first",
        content: "First note",
        id:1},

    {name: "second",
        content: "Second note",
        id:2},
]

const NotesEditor = ({notesData}) => {
    return (
        <div>


        </div>
    );
};

export default NotesEditor;