import axios, { type AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  results: Note[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const res: AxiosResponse = await api.get("/notes", { params });
  return res.data as FetchNotesResponse;
};

export interface CreateNoteDto {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const createNote = async (dto: CreateNoteDto): Promise<Note> => {
  const res = await api.post("/notes", dto);
  return res.data as Note;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete(`/notes/${id}`);
  return res.data as Note;
};
