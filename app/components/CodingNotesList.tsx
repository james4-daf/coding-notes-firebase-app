"use client"
import React, {useState,useEffect} from 'react';
import Link from "next/link";
import {useAuth} from "@/app/context/authContext";
import {addUserNote, getUserNotes} from "../firebase/firestore";

const CodingNotesList = () => {
    const {user} = useAuth();
    const [notes, setNotes] = useState([]);


    function addNote() {
        addUserNote(user.uid)
        getUserNotes(user.uid).then(setNotes);
    }

    useEffect(() => {
        if (user) {
            console.log(user.uid);
            getUserNotes(user.uid).then(setNotes);

        }
    }, [user]);

    return (
        <div className="columns-3xs">
            {notes?.map((note) => (
                <div key={note.id} className="border h-22">
                    <Link href={`/notepad/${note.id}`}>
                        <div className="p-6">
                            <b>{note.title}</b>
                            <p className="font-thin">{note.content}</p>
                        </div>
                    </Link>
                </div>
            ))}
            <button onClick={addNote} className="p-6 border rounded-l w-full hover:bg-sky-300">Add a note</button>
        </div>
    );
};

export default CodingNotesList;