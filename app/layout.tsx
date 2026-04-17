// import type { Metadata } from 'next';
// import { Roboto } from 'next/font/google';
// import './globals.css';
// import Header from '@/components/Header/Header';
// import Footer from '@/components/Footer/Footer';
// import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
// import AuthProvider from '@/components/AuthProvider/AuthProvider';

// const roboto = Roboto({
//   weight: ['400', '500', '700'],
//   subsets: ['latin'],
//   variable: '--font-roboto',
//   display: 'swap',
// });

// export const metadata: Metadata = {
//   title: 'NoteHub',
//   description: 'Simple and efficient application for managing personal notes',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={roboto.variable}>
//       <body className={roboto.className}>
//         <TanStackProvider>
//           <AuthProvider>
//             <Header />
//             <main>{children}</main>
//             <Footer />
//           </AuthProvider>
//         </TanStackProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Simple and efficient application for managing personal notes",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}