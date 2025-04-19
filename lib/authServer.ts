"use server";

import { createAuthClient } from "better-auth/react";
import { passkeyClient, usernameClient } from "better-auth/client/plugins";
import { cache } from "react";
import { headers } from "next/headers";

const BETTER_AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3030/api/auth";
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || "";

const auth = createAuthClient({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  plugins: [passkeyClient(), usernameClient()],
});

export const getSession = cache(async () => {
  return await auth.getSession({
    query: {
      disableCookieCache: true,
    },
    fetchOptions: {
      headers: await headers(),
    },
  });
});

export const authServer = async () => {
  return auth;
};
