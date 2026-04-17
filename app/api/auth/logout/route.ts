

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST() {
  try {
    // Отправляем запрос на внешний бекенд
    await axios.post(
      'https://notehub-api.goit.study/auth/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
    
  
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    response.cookies.delete('session');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    

    const response = NextResponse.json({ message: 'Logged out locally' }, { status: 200 });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    response.cookies.delete('session');
    
    return response;
  }
}