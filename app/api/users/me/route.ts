// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import axios from 'axios';
// import { AxiosError } from 'axios';

// export async function GET() {
//   const cookieStore = await cookies();
//   const sessionCookie = cookieStore.get('session');

//   if (!sessionCookie) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const response = await axios.get('https://notehub-api.goit.study/users/me', {
//       headers: { Cookie: `${sessionCookie.name}=${sessionCookie.value}` },
//     });
//     return NextResponse.json(response.data, { status: 200 });
//   } catch (error) {
//     const axiosError = error as AxiosError;
//     const errorData = axiosError.response?.data as { message?: string };
//     return NextResponse.json(
//       { message: errorData?.message || 'Failed to fetch user' },
//       { status: axiosError.response?.status || 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const response = await axios.get('https://notehub-api.goit.study/users/me', {
      headers: {
        Cookie: `${accessToken.name}=${accessToken.value}`,
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch  {
    return NextResponse.json({ message: 'Failed to fetch user' }, { status: 401 });
  }
}