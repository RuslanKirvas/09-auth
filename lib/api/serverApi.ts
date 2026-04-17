


import { api } from './api';
import { cookies } from 'next/headers';
import { Note } from '@/types/note';
import { User } from '@/types/user';

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params: { page?: number; perPage?: number; search?: string; tag?: string } = {}) => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  const response = await api.get('/notes', {
    params,
    headers: cookieString ? { Cookie: cookieString } : {},
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  const response = await api.get(`/notes/${id}`, {
    headers: cookieString ? { Cookie: cookieString } : {},
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  
  
  const response = await api.get('/users/me', {
    headers: cookieString ? { Cookie: cookieString } : {},
  });
  return response.data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    
    const response = await api.get('/auth/session', {
      headers: cookieString ? { Cookie: cookieString } : {},
    });
    return response.data;
  } catch {
    return null;
  }
};
