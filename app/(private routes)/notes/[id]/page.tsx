
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from '@tanstack/react-query';
// import { fetchNoteById } from '@/lib/api/clientApi';
// import NotePreview from './NotePreview.client';
// import { Metadata } from 'next';

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const { id } = await params;
//   const note = await fetchNoteById(id);
  
//   return {
//     title: `${note.title} | NoteHub`,
//     description: note.content.substring(0, 160),
//     openGraph: {
//       title: `${note.title} | NoteHub`,
//       description: note.content.substring(0, 160),
//       url: `https://08-zustand.vercel.app/notes/${id}`,
//       images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
//     },
//   };
// }

// export default async function NoteModalPage({ params }: PageProps) {
//   const { id } = await params;

//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['note', id],
//     queryFn: () => fetchNoteById(id),
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <NotePreview id={id} />
//     </HydrationBoundary>
//   );
// }


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
    const note = await fetchNoteById(id);
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.substring(0, 160),
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.substring(0, 160),
        url: `https://09-auth.vercel.app/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch  {
    return {
      title: 'Note not found | NoteHub',
      description: 'The requested note could not be found.',
    };
  }
}

export default async function NoteModalPage({ params }: PageProps) {
  const { id } = await params;


  try {
   await fetchNoteById(id);
  } catch  {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
