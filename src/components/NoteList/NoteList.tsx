import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (id: string | number) => {
    mutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.card}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>
          <span className={css.tag}>{note.tag}</span>
          <button className={css.deleteButton} onClick={() => handleDelete(note.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
