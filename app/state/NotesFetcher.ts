import { useEffect } from "react";
import { useSetAtom} from "jotai";
import { notes } from "@/app/state/notes";
import { getUserNotes } from "@/app/firebase/firestore";
import { useAuth } from "@/app/context/authContext";

export function NotesFetcher() {
    const { user } = useAuth();
    const setNotes = useSetAtom(notes);

    useEffect(() => {
        if (user) {
            getUserNotes(user.uid).then((fetchedNotes) => {
                setNotes(fetchedNotes);
            });
        }
    }, [user, setNotes]);

    return null; // No UI needed, just syncing state
}