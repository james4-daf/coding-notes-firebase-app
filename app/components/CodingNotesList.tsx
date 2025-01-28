"use client"
import React, {useState,useEffect} from 'react';
import Link from "next/link";
import { readUserData} from "../firebase/realtimeDatabase";
import {useAuth} from "@/app/context/authContext";

const CodingNotesList = ({notesData}) => {
    const {user} = useAuth();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (user?.uid) {
            // Fetch notes only if the user is authenticated
            const fetchNotes = () => {
                readUserData(user.uid, "notes", (fetchedNotes) => {
                    setNotes(fetchedNotes);
                });
            };
            fetchNotes();
        }
    }, [user]);

    return (
        <div className="columns-3xs">
            {notes.map((note) => (
                <div key={note.id} className="border h-22">
                    <Link href={`/notepad/${note.id}`}>
                        <div className="p-6">
                            <b>{note.name}</b>
                            <p className="font-thin">{note.content}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default CodingNotesList;