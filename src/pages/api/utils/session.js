import { withIronSession } from 'next-iron-session';

export function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'admin_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 24 * 60 * 60, // 5 days in seconds
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in milliseconds
    },
  });
}