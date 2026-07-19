import { createAuthClient } from "better-auth/react";

// Points to the Express backend. Only used for the Google OAuth
// handshake — email/password and the app's own "who's logged in" state
// are handled entirely by our custom JWT (see lib/api.ts, lib/useAppSession.ts).
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  basePath: "/api/auth",
});

export const { signIn } = authClient;
