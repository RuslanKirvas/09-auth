


import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: Request) {

  
  try {
    const body = await request.json();
   
    
    const response = await axios.post('https://notehub-api.goit.study/auth/login', body, {
      headers: { 'Content-Type': 'application/json' },
    });
    
  
    
    const accessToken = response.headers['set-cookie'];
    
    const headers = new Headers();
    if (accessToken) {
      if (Array.isArray(accessToken)) {
        accessToken.forEach(c => headers.append('Set-Cookie', c));
      } else {
        headers.set('Set-Cookie', accessToken);
      }
    }
    
    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
      headers,
    });
  } catch (error) {
   
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as { message?: string };
    return NextResponse.json(
      { message: errorData?.message || 'Login failed' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
