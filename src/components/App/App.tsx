import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, deleteNote } from "../../services/noteService";
import { PER_PAGE } from "../../config";
import type { FetchNotesResponse } from "../../services/noteService";

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

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. See console for details.");
    },
  });

  const handleDelete = (id: string) => {
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
            totalPages={data?.totalPages ?? 1}
            onPageChange={(p) => setPage(p)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {/* Додаємо індикатори статусу */}
        {isLoading && <p>Loading notes...</p>}
        {deleteMutation.isPending && <p>Deleting note...</p>}
        {isError && <p>Something went wrong loading notes.</p>}
        {deleteMutation.isError && <p>Error deleting note.</p>}

        {/* Умовний рендеринг NoteList */}
        {data?.results && data.results.length > 0 ? (
          <NoteList notes={data.results} onDelete={handleDelete} />
        ) : (
          !isLoading && <p>No notes found</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            // Функція для скидання станів App після успіху
            onNoteCreated={() => {
              setSearch(""); // Скидаємо пошук
              setPage(1); // Повертаємося на першу сторінку
              // TanStack Query виконає новий запит, оскільки queryKey змінився
            }}
          />
        </Modal>
      )}
    </div>
  );
}
