import { withIronSession } from 'next-iron-session';

export function withSession(handler) {
  const threeHoursInSeconds = 3 * 60 * 60;

  return withIronSession(handler, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'admin_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: threeHoursInSeconds,
      expires: new Date(Date.now() + threeHoursInSeconds * 1000),
    },
  });
}
