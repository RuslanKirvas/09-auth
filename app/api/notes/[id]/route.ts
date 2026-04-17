


import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    
    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const response = await axios.get(`https://notehub-api.goit.study/notes/${id}`, {
      headers: {
        Cookie: `${accessToken.name}=${accessToken.value}`,
        'Content-Type': 'application/json',
      },
    });
    
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('API /notes/[id] error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

