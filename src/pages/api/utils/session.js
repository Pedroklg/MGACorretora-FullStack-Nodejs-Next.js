import { withIronSession } from "next-iron-session";

export function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SESSION_PASSWORD, // Make sure the password is fetched from environment variables
    cookieName: "admin_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}

