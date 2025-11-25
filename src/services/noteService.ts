import axios, { type AxiosResponse, isAxiosError } from "axios";
import type { Note, NoteTag } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  // Заголовки Content-Type встановлюємо тут, Authorization додаємо через інтерцептор
  headers: {
    "Content-Type": "application/json",
  },
});

// === ІНТЕРЦЕПТОР ДЛЯ ДИНАМІЧНОГО ДОДАВАННЯ ТОКЕНА ===
// Цей код виконується перед відправкою КОЖНОГО запиту
api.interceptors.request.use(
  (config) => {
    // Зчитуємо токен динамічно перед відправкою
    const token = import.meta.env.VITE_NOTEHUB_TOKEN;

    if (token) {
      // Встановлюємо заголовок Authorization
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(
        "Authorization Token (VITE_NOTEHUB_TOKEN) is missing. Check your .env file."
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// =======================================================

// === ІНТЕРФЕЙСИ ДАНИХ ===

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

export interface CreateNoteDto {
  title: string;
  content?: string;
  tag: NoteTag;
}

// === ФУНКЦІЇ СЕРВІСУ ===

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  try {
    const res: AxiosResponse = await api.get("/notes", { params });
    return res.data as FetchNotesResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      console.error(
        "401 Unauthorized: Failed to fetch notes. Check if token is valid."
      );
    }
    // Перекидаємо помилку, щоб її обробив useQuery
    throw error;
  }
};

export const createNote = async (dto: CreateNoteDto): Promise<Note> => {
  try {
    const res = await api.post("/notes", dto);
    return res.data as Note;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      console.error(
        "401 Unauthorized: Failed to create note. Check if token is valid."
      );
    }
    // Перекидаємо помилку, щоб її обробив useMutation
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const res = await api.delete(`/notes/${id}`);
    return res.data as Note;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      console.error(
        "401 Unauthorized: Failed to delete note. Check if token is valid."
      );
    }
    throw error;
  }
};
