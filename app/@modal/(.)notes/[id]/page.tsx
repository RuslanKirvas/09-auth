


import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreview from './NotePreview.client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const cleanId = id.replace(/^\(\.\)/, '');
    const note = await fetchNoteById(cleanId);
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.substring(0, 160),
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.substring(0, 160),
        url: `https://09-auth.vercel.app/notes/${cleanId}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'The requested note could not be found.',
    };
  }
}

export default async function InterceptedNotePage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = id.replace(/^\(\.\)/, '');

  try {
    await fetchNoteById(cleanId);
  } catch {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', cleanId],
    queryFn: () => fetchNoteById(cleanId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={cleanId} />
    </HydrationBoundary>
  );
}
