import { useQuery } from "@tanstack/react-query";
import {getNoteById, getRecentlyUpdatedNotes, getUserNotes} from "@/app/firebase/firestore";

export const useNotesHook = (userId?: string) => {
    return useQuery({
        queryKey: ["notes", userId],
        queryFn: () => userId ? getUserNotes(userId) : [],
        enabled: !!userId, // Only fetch if userId exists
    });
};

export const useFetchNoteById = (noteId?: string) => {
    return useQuery({
        queryKey: ["note", noteId],
        queryFn: () => (noteId ? getNoteById(noteId) : null),
        enabled: !!noteId, // Only fetch if noteId exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};

export const useRecentNotes = (userId?: string, minutesAgo = 10) => {
    return useQuery({
        queryKey: ["recentNotes", userId, minutesAgo],
        queryFn: () => userId ? getRecentlyUpdatedNotes(userId, minutesAgo) : [],
        enabled: !!userId, // Only fetch if userId exists
        refetchInterval: 30000, // Poll every 30s
    });
};