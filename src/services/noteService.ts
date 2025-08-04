import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`
  },
});

// API повертає: { notes: Note[], totalPages: number }
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );

  const response = await axiosInstance.get<FetchNotesResponse>('/notes', {
    params: cleanParams,
  });

  return response.data;
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const response = await axiosInstance.post<Note>('/notes', note);
  return response.data;
};

// Дозволяємо id бути number або string
export const deleteNote = async (id: string | number): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};
