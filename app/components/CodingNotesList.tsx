'use client';
import Loading from '@/app/components/Loading';
import { useAuth } from '@/app/context/authContext';
import { useDeviceType } from '@/app/hooks/useDeviceType';
import { NotesFetcher } from '@/app/state/NotesFetcher';
import { currentNote, notes } from '@/app/state/notes';
import { useAtom, useSetAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  addUserNote,
  deleteUserNote,
  getUserNotes,
} from '../firebase/firestore';

const CodingNotesList = () => {
  const isMobile = useDeviceType();
  const setCurrentNote = useSetAtom(currentNote);
  const { user, loading } = useAuth();
  const [notesList, setNotes] = useAtom(notes);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteInput, setInputNote] = useState<string>('');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const noteId = Array.isArray(params?.noteId)
    ? params.noteId[0]
    : params?.noteId;
  const [swipedNoteId, setSwipedNoteId] = useState<string | null>(null);
  const touchStartX = React.useRef<number | null>(null);
  const touchCurrentX = React.useRef<number | null>(null);

  const handleAddNoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to add a note.');
      return;
    }

    if (!noteInput.trim()) {
      setError('Note title cannot be empty.');
      return;
    }

    setError(null);

    const newNoteId = await addUserNote(
      user.uid,
      noteInput.trim(),
      noteInput.trim(),
    );
    if (newNoteId) {
      const newNote = {
        id: newNoteId,
        title: noteInput.trim(),
        content: noteInput.trim(),
      };
      setCurrentNote(newNote);
      router.push(`/${newNoteId}`);
    }
    setInputNote(''); // Clear input field
    setShowAddNote(false);
    getUserNotes(user.uid).then((notes) => {
      setNotes(
        notes.map((note) => ({
          id: note.id,
          title: note.title || '',
          content: '',
          lastModified: new Date(),
        })),
      );
    });
  };

  const handleNavigate = (id: string) => {
    router.push(`/${id}`);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (noteId: string) => {
    if (
      touchStartX.current !== null &&
      touchCurrentX.current !== null &&
      touchStartX.current - touchCurrentX.current > 50 // threshold for swipe left
    ) {
      setSwipedNoteId(noteId);
    } else {
      setSwipedNoteId(null);
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  const handleDelete = async (noteId: string) => {
    if (!user) return;
    await deleteUserNote(user.uid, noteId);
    // Remove from local state
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (swipedNoteId === noteId) setSwipedNoteId(null);
  };

  NotesFetcher();

  if (!notesList) {
    return <Loading />;
  }

  // const isHtml = (str: string): boolean => {
  //     const pattern = /<\/?[a-z][\s\S]*>/i;
  //     return pattern.test(str);
  // };
  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return null;
  }

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'columns-3xs'}`}>
      {[...notesList]
        .sort(
          (a, b) =>
            (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0),
        ) // Sort by lastModified, newest first
        .map((note) => (
          <div className="relative" key={note.id}>
            <div
              className={`border h-22 relative ${
                note.id === noteId ? 'bg-gray-100' : ''
              }`}
              style={
                isMobile && swipedNoteId === note.id
                  ? {
                      transform: 'translateX(-40px)',
                      transition: 'transform 0.2s',
                    }
                  : { transition: 'transform 0.2s' }
              }
              {...(isMobile
                ? {
                    onTouchStart: handleTouchStart,
                    onTouchMove: handleTouchMove,
                    onTouchEnd: () => handleTouchEnd(note.id),
                  }
                : {})}
            >
              <button
                key={note.id}
                onClick={() => handleNavigate(note.id)}
                className="w-full text-left"
              >
                <div className="p-6 break-words whitespace-normal min-w-0">
                  {note.title}
                </div>
              </button>
            </div>
            {isMobile && swipedNoteId === note.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDelete(note.id);
                }}
                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-red-500 text-white text-xl"
                style={{ zIndex: 10 }}
              >
                ❌
              </button>
            )}
          </div>
        ))}

      {!showAddNote ? (
        <button
          onClick={() => setShowAddNote((prev) => !prev)}
          className="p-6 border rounded-l w-full hover:bg-sky-300"
        >
          Add a note
        </button>
      ) : (
        <form onSubmit={handleAddNoteSubmit}>
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setInputNote(e.target.value)}
            className={'p-6 border rounded-l w-full '}
            placeholder="Enter a note title"
          />
        </form>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default CodingNotesList;
