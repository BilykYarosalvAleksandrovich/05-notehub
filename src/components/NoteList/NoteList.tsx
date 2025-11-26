// src/components/NoteList/NoteList.tsx

import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  // Проп onDelete більше не потрібен
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Логіка видалення перенесена з App.tsx
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      // Інвалідація кешу після успішного видалення
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

  if (!notes || notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        // Використовуємо n.id
        <li key={n.id} className={css.listItem}> 
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(n.id)}
              disabled={deleteMutation.isPending} // Використовуємо isPending (v5)
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}