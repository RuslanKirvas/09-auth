import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post('https://notehub-api.goit.study/auth/register', body, {
      headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as { message?: string };
    return NextResponse.json(
      { message: errorData?.message || 'Registration failed' },
      { status: axiosError.response?.status || 500 }
    );
  }
}