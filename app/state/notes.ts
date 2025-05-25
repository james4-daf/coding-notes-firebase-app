'use client';

import { atom } from 'jotai';

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified?: Date;
}

// Atoms for managing state globally
export const notes = atom<Note[]>([]);
export const currentNote = atom<Note | null>(null);
export const editorContent = atom<string>('');
export const isLoading = atom<boolean>(false);
