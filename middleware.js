import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export function middleware(req) {
  const res = NextResponse.next();

  // Example: Setting a cookie with appropriate attributes
  res.headers.set('Set-Cookie', serialize('name', 'value', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'None',
    path: '/',
  }));

  return res;
}

export const config = {
  matcher: '/api/:path*', // Apply middleware to specific routes
};