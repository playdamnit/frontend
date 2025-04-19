"use client";

import { useEffect, useState } from "react";
import { useUserGamesList } from "@/hooks/useUserGamesList";
import { ProfileContent } from "./ProfileContent";
import { useUserByUsername } from "@/hooks/user";
import { notFound } from "next/navigation";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

type ProfileClientProps = {
  username: string;
  isOwnProfile: boolean;
  currentUser: {
    name: string;
    image?: string | null;
    username?: string | null;
  } | null;
};

export default function ProfileClient({
  username,
  isOwnProfile,
  currentUser,
}: ProfileClientProps) {
  const [userGamesData, setUserGamesData] = useState<any[]>([]);

  // Fetch the user by username
  const {
    data: profileUser,
    isLoading: isUserLoading,
    error: userError,
  } = useUserByUsername(username, !!username);

  // Fetch the user's games data
  const { data: gamesData, isLoading: isGamesLoading } = useUserGamesList({
    username,
    enabled: !!username,
  });

  useEffect(() => {
    if (gamesData?.games) {
      setUserGamesData(gamesData.games);
    }
  }, [gamesData]);

  if (isUserLoading || isGamesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (
    userError &&
    userError instanceof AxiosError &&
    userError.response?.status === 404
  ) {
    notFound();
  }

  return (
    <ProfileContent
      isOwnProfile={isOwnProfile}
      username={username}
      fullName={
        profileUser?.name || (isOwnProfile ? currentUser?.name : "") || ""
      }
      avatarUrl={
        profileUser?.image || (isOwnProfile ? currentUser?.image : "") || ""
      }
      initialGamesData={userGamesData}
    />
  );
}
