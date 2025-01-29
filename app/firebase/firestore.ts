import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

export const addUserNote = async (userId: string) => {
    try {
        // Reference the user's `notes` subcollection
        const notesRef = collection(db, "users", userId, "notes");

        // Default note data
        const newNote = {
            title: "noteTitle",
            content: "new note",
            createdAt: serverTimestamp(), // Firestore timestamp
        };

        // Add note to Firestore
        const docRef = await addDoc(notesRef, newNote);

        console.log("New note added with ID:", docRef.id);
        return docRef.id; // Return the new note ID
    } catch (error) {
        console.error("Error adding note:", error);
    }
};



export const getUserNotes = async (userId: string) => {
    try {
        // Reference the `notes` subcollection inside the user's document
        const notesRef = collection(db, "users", userId, "notes");

        // Fetch all notes for this user
        const querySnapshot = await getDocs(notesRef);

        // Format the notes into an array
        return querySnapshot.docs.map((doc) => ({
            id: doc.id, // Note ID
            ...doc.data(), // Note data (title, content, createdAt, etc.)
        }));
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    }
};