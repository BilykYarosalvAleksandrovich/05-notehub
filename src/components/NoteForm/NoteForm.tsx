import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

// Додано пропс onNoteCreated
interface NoteFormProps {
  onClose: () => void;
  onNoteCreated: () => void;
}

const validTags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(validTags, "Invalid tag selected")
    .required("Tag is required"),
});

export default function NoteForm({ onClose, onNoteCreated }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dto: { title: string; content?: string; tag: NoteTag }) =>
      createNote(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onNoteCreated(); // Викликаємо скидання пошуку/сторінки в App
      onClose(); // Закриваємо модалку
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      alert("Failed to create note. See console for details.");
    },
  });

  return (
    <div>
      <h2>Create note</h2>
      <Formik
        initialValues={{ title: "", content: "", tag: "Todo" as NoteTag }}
        validationSchema={schema}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            {/* Title Field */}
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            {/* Content Field (Textarea) */}
            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                id="content"
                name="content"
                as="textarea"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            {/* Tag Field (Select) */}
            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field id="tag" name="tag" as="select" className={css.select}>
                {validTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            {/* Actions */}
            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting || mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create note"}
              </button>
            </div>

            {mutation.isError && (
              <p className={css.apiError}>
                Error: Failed to create note. Please try again.
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
