import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import type { NoteTag } from '../../types/note';
import { createNote } from '../../services/noteService';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
}

interface FormValues {
  title: string;
  content?: string;
  tag: NoteTag;
}

const TAG_OPTIONS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
  title: Yup.string()
    .min(3, 'Min 3 characters')
    .max(50, 'Max 50 characters')
    .required('Title is required'),

  content: Yup.string()
    .max(500, 'Max 500 characters'), // не required

  tag: Yup.mixed<NoteTag>()
    .oneOf(TAG_OPTIONS)
    .required('Tag is required'),
});


const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel(); // Закриває форму
    },
  });

  const initialValues: FormValues = {
    title: '',
    content: '',
    tag: 'Todo',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: FormValues, helpers) => {
        mutation.mutate({
          ...values,
          content: values.content ?? '', // ← гарантує, що буде string, не undefined
        });
        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field id="content" name="content" as="textarea" rows={6} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.input}>
              {TAG_OPTIONS.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
