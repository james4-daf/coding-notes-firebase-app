import { db } from "./firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
    doc,
    deleteDoc,
    getDoc,
    where,
    Timestamp
} from "firebase/firestore";
import {Note} from "../components/CodingNotesList"
import {query} from "@firebase/database";

export const addUserNote = async (userId: string, userInput : string) => {
    try {
        // Reference the user's `notes` subcollection
        const notesRef = collection(db, "users", userId, "notes");

        // Default note data
        const newNote = {
            content: userInput,
            createdAt: serverTimestamp(), // Firestore timestamp
        };

        // Add note to Firestore
        const docRef = await addDoc(notesRef, newNote);

        console.log("New note added with ID:", docRef.id);
        console.log(userInput);
        return docRef.id; // Return the new note ID
    } catch (error) {
        console.error("Error adding note:", error);
    }
};



export const getUserNotes = async (userId: string): Promise<Note[]> => {
    try {
        const notesRef = collection(db, "users", userId, "notes");
        const querySnapshot = await getDocs(notesRef);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id, // Note ID
            content: (doc.data().content as string) || "", // Ensure `content` exists
        }));
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    }
};

export const getNoteById = async (noteId: string) => {
    const docRef = doc(db, "notes", noteId);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};


export const getRecentlyUpdatedNotes = async (userId: string, minutesAgo: number) => {
    const now = Timestamp.now();
    const minutesAgoTimestamp = new Timestamp(now.seconds - minutesAgo * 60, now.nanoseconds);

    const notesRef = collection(db, "notes");
    const q = query(notesRef,
        where("userId", "==", userId),
        where("lastUpdated", ">", minutesAgoTimestamp)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateNoteContent = async (userId: string,noteId: string, newContent: string) => {
    try {
        const noteRef = doc(db, "users", userId, "notes", noteId); // Replace "your-user-id" dynamically
        await updateDoc(noteRef, { content: newContent, lastUpdated: serverTimestamp() });
        console.log("Note updated successfully!");
    } catch (error) {
        console.error("Error updating note:", error);
    }
};

// Delete a note from Firestore
export const deleteUserNote = async (userId: string, noteId: string) => {
    try {
        await deleteDoc(doc(db, "users", userId, "notes", noteId));
        console.log(`Note ${noteId} deleted`);
    } catch (error) {
        console.error("Error deleting note:", error);
    }
};

