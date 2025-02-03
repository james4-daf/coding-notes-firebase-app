import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc,doc,deleteDoc } from "firebase/firestore";

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


export const updateNoteContent = async (userId: string,noteId: string, newContent: string) => {
    try {
        const noteRef = doc(db, "users", userId, "notes", noteId); // Replace "your-user-id" dynamically
        await updateDoc(noteRef, { content: newContent });
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

