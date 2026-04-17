


'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={handleClose}>
      <div style={{ minWidth: '300px', padding: '16px' }}>
        <h2>{note.title}</h2>
        <p><strong>Tag:</strong> {note.tag}</p>
        <p>{note.content}</p>
        <small>Created: {new Date(note.createdAt).toLocaleDateString()}</small>
      </div>
    </Modal>
  );
}
