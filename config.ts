const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";
const backendUrl = process.env.BACKEND_URL || "http://localhost:3030/api";
const betterAuthUrl = `${backendUrl}/auth` || "http://localhost:3030/api/auth";
const betterAuthSecret = process.env.BETTER_AUTH_SECRET || "";

const config = {
  isDev,
  isProd,
  backendUrl,
  betterAuthUrl,
  betterAuthSecret,
};

export const getConfig = () => {
  return config;
};
