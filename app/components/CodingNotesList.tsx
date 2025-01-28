import React from 'react';
import Link from "next/link";

const CodingNotesList = ({notesData}) => {
    return (
        <div className="columns-3xs">
            {notesData.map((note) => (
                <div key={note.id} className="border h-22">
                    <Link href={`/notesEditor/${note.id}`} >
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