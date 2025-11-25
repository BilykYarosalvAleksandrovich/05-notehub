import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, deleteNote } from "../../services/noteService";
import { PER_PAGE } from "../../config";
import type { FetchNotesResponse } from "../../types/note";

import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  // 1. Запит для отримання нотаток
  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
      }),
    keepPreviousData: true,
  });

  // 2. Мутація для видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      // Інвалідація запиту для оновлення списку після видалення
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. See console for details.");
    },
  });

  // 3. Обробник видалення
  const handleDelete = (id: string) => {
    // Викликаємо мутацію
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {/* Умовний рендеринг пагінації: тільки якщо сторінок > 1 */}
        {data && data.totalPages > 1 && (
          <Pagination
            current={page}
            totalPages={data.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}

        <button
          className={css.button} // Змінив на css.button згідно з вимогами
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {/* Додаємо індикатори статусу */}
        {isLoading && <p>Loading notes...</p>}
        {deleteMutation.isLoading && <p>Deleting note...</p>}
        {isError && <p>Something went wrong loading notes.</p>}
        {deleteMutation.isError && <p>Error deleting note.</p>}

        {/* Умовний рендеринг NoteList */}
        {data && data.results && data.results.length > 0 ? (
          <NoteList notes={data.results} onDelete={handleDelete} />
        ) : (
          !isLoading && !isError && <p>No notes found.</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
