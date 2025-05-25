import { Note } from '@/app/state/notes';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const addUserNote = async (
  userId: string,
  title: string,
  content: string,
) => {
  try {
    // Reference the user's `notes` subcollection
    const notesRef = collection(db, 'users', userId, 'notes');

    // Default note data
    const newNote = {
      title,
      content: '',
      lastModified: serverTimestamp(), // Firestore timestamp
    };

    // Add note to Firestore
    const docRef = await addDoc(notesRef, newNote);

    console.log('New note added with ID:', docRef.id);
    console.log(title, content);
    return docRef.id; // Return the new note ID
  } catch (error) {
    console.error('Error adding note:', error);
  }
};

export const getUserNotes = async (userId: string): Promise<Note[]> => {
  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const querySnapshot = await getDocs(notesRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Note ID
        title: data.title || '', // Ensure `title` exists
        content: data.content || '', // Ensure `content` exists
        lastModified:
          data.lastModified instanceof Timestamp
            ? data.lastModified.toDate() // Convert Firestore Timestamp to Date
            : undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

export const getNoteById = async (noteId: string) => {
  const docRef = doc(db, 'notes', noteId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title || '',
    content: data.content || '',
    lastModified:
      data.lastModified instanceof Timestamp
        ? data.lastModified.toDate()
        : undefined,
  };
};

export const updateNoteContent = async (
  userId: string,
  noteId: string,
  title: string,
  content: string,
) => {
  try {
    const noteRef = doc(db, 'users', userId, 'notes', noteId); // Replace "your-user-id" dynamically
    await updateDoc(noteRef, {
      title,
      content,
      lastUpdated: serverTimestamp(),
    });
    console.log('Note updated successfully!');
  } catch (error) {
    console.error('Error updating note:', error);
  }
};

// Delete a note from Firestore
export const deleteUserNote = async (userId: string, noteId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'notes', noteId));
    console.log(`Note ${noteId} deleted`);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};
