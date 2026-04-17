

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    
    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('perPage') || '12';
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    
    const params: Record<string, string> = { page, perPage };
    if (search) params.search = search;
    if (tag) params.tag = tag;
    
    const response = await axios.get('https://notehub-api.goit.study/notes', {
      params,
      headers: {
        Cookie: `${accessToken.name}=${accessToken.value}`,
        'Content-Type': 'application/json',
      },
    });
    
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('API /notes error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
