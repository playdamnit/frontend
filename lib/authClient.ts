import { createAuthClient } from "better-auth/react";
import { passkeyClient, usernameClient } from "better-auth/client/plugins";
import { getConfig } from "@/config";

const { betterAuthUrl, betterAuthSecret } = getConfig();

export const authClient = createAuthClient({
  baseURL: betterAuthUrl,
  secret: betterAuthSecret,
  plugins: [passkeyClient(), usernameClient()],
});
