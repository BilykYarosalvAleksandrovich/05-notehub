import React from "react";

export default function NoteForm({ onClose }: NoteFormProps) {
  const qc = useQueryClient();
  const mutation = useMutation(
    (dto: { title: string; content?: string; tag: NoteTag }) => createNote(dto),
    {
      onSuccess: () => {
        qc.invalidateQueries(["notes"]);
        onClose();
      },
    }
  );

  return (
    <div>
      <h2>Create note</h2>
      <Formik
        initialValues={{ title: "", content: "", tag: "Todo" }}
        validationSchema={schema}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                id="content"
                name="content"
                as="textarea"
                rows={6}
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field id="tag" name="tag" as="select" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting}
              >
                Create note
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
