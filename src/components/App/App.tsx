import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "../../services/noteService";
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

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const { data, isLoading, isError, isFetching } = useQuery<FetchNotesResponse>(
    {
      queryKey: ["notes", page, debouncedSearch],
      queryFn: () =>
        fetchNotes({
          page,
          perPage: PER_PAGE,
          search: debouncedSearch,
        }),
      placeholderData: (previousData) => previousData,
    }
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {/* Пагінація використовує data.totalPages */}
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
        {(isLoading || isFetching) && <p>Loading notes...</p>}
        {isError && <p>Something went wrong loading notes.</p>}

        {/* ⬅️ ВИКОРИСТАННЯ data.notes */}
        {data?.notes && data.notes.length > 0 ? (
          <NoteList notes={data.notes} />
        ) : (
          !isLoading && !isError && <p>No notes found</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onNoteCreated={() => {
              setSearch("");
              setPage(1);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
