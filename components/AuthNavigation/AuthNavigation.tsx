// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/lib/store/authStore';
// import { logout } from '@/lib/api/clientApi';
// import css from './AuthNavigation.module.css';

// export default function AuthNavigation() {
//   const router = useRouter();
//   const { user, isAuthenticated, clearAuth } = useAuthStore();

//   const handleLogout = async () => {
//     await logout();
//     clearAuth();
//     router.push('/sign-in');
//   };

//   if (!isAuthenticated) {
//     return (
//       <>
//         <li className={css.navigationItem}>
//           <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
//             Login
//           </Link>
//         </li>
//         <li className={css.navigationItem}>
//           <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
//             Sign up
//           </Link>
//         </li>
//       </>
//     );
//   }

//   return (
//     <>
//       <li className={css.navigationItem}>
//         <Link href="/profile" prefetch={false} className={css.navigationLink}>
//           Profile
//         </Link>
//       </li>
//       <li className={css.navigationItem}>
//         <p className={css.userEmail}>{user?.email}</p>
//         <button onClick={handleLogout} className={css.logoutButton}>
//           Logout
//         </button>
//       </li>
//     </>
//   );
// }





"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import css from "./AuthNavigation.module.css";

export const AuthNavigation = () => {
  const { user, isAuthenticated, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      router.push("/sign-in");
   
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    );
  }


  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" className={css.navigationLink}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button onClick={handleLogout} className={css.logoutButton}>
          Logout
        </button>
      </li>
    </>
  );
};