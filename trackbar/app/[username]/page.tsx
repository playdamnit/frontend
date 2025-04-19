import { notFound } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { ProfileContent } from "./components/ProfileContent";
import { getServerUser } from "@/utils/supabase/server-auth";
import { getUserGames } from "@/app/helpers/getUserGames";

interface UserData {
  username: string;
  full_name: string;
  avatar_url: string;
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  const supabase = await createClient();
  const currentUser = await getServerUser();
  const { data: userData, error } = await supabase.rpc("get_user_by_username", {
    p_username: username,
  });

  if (!userData || error) {
    console.error("Error finding user:", error);
    notFound();
  }

  // Fetch user games data server-side
  const userGamesData = await getUserGames({
    username,
  });

  const typedUserData = userData as unknown as UserData;
  const isOwnProfile = currentUser?.user_metadata?.username === username;

  return (
    <ProfileContent
      isOwnProfile={isOwnProfile}
      username={typedUserData.username}
      fullName={typedUserData.full_name}
      avatarUrl={typedUserData.avatar_url}
      initialGamesData={userGamesData.games}
    />
  );
}
