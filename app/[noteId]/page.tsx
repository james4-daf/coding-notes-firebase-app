'use client'
import React from 'react'
import NotesEditor from "@/app/components/NotesEditor";
import {useParams} from "next/navigation";

export default function NotePage() {
    const params = useParams();
    console.log(params);
    const noteId = params?.noteId;
    return (
        <>
        <NotesEditor />
        </>
    )
}