// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import axios from 'axios';

// export async function GET() {
//   const cookieStore = await cookies();
//   const sessionCookie = cookieStore.get('session');

//   if (!sessionCookie) {
//     return NextResponse.json(null, { status: 200 });
//   }

//   try {
//     const response = await axios.get('https://notehub-api.goit.study/auth/session', {
//       headers: { Cookie: `${sessionCookie.name}=${sessionCookie.value}` },
//     });
//     return NextResponse.json(response.data, { status: 200 });
//   } catch {
//     return NextResponse.json(null, { status: 200 });
//   }





import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  
  if (!accessToken) {
    return NextResponse.json(null, { status: 200 });
  }
  
  try {
    const response = await axios.get('https://notehub-api.goit.study/users/me', {
      headers: {
        Cookie: `${accessToken.name}=${accessToken.value}`,
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(null, { status: 200 });
  }
}
