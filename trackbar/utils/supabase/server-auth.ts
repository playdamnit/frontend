import { createClient } from "./server";
import { cache } from "react";

export const getServerUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
