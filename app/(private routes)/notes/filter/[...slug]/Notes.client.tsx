


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import css from "./NotesPage.module.css";

export default function NotesClient({ initialTag }: { initialTag?: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', page, search, initialTag],
    queryFn: () => fetchNotes({ page, perPage: 12, search, tag: initialTag }),
    placeholderData: (prev) => prev,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes. {error.message}</p>;

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={debouncedSetSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <Link
          href="/notes/action/create"
          style={{ padding: '6px 12px', background: '#0d6efd', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
        >
          Create note +
        </Link>
      </div>

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>No notes yet. Create your first note!</p>
      )}
    </div>
  );
}