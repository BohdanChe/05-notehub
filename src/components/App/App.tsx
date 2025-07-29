import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

const PER_PAGE = 12;

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debounced] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ['notes', debounced, page],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search: debounced }),
    placeholderData: () => ({
      results: [],
      totalPages: 1,
      totalResults: 0,
    }),
  });

  const addNote = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setModalOpen(false);
    },
  });

  const removeNote = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination pageCount={data.totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button onClick={() => setModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      {isPending && <p>Loading notes...</p>}
      {isError && <p>Error loading notes.</p>}

      {data?.results.length ? (
        <NoteList notes={data.results} onDelete={id => removeNote.mutate(id)} />
      ) : (
        !isPending && <p>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm
            onSubmit={values => addNote.mutate(values)}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
