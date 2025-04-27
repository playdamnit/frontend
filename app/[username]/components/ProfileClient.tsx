"use client";

import { notFound } from "next/navigation";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

import { ProfileContent } from "./ProfileContent";
import { useGetApiUserByUsername } from "@/playdamnit-client";

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
  const {
    data: profileUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetApiUserByUsername(username, {
    query: {
      enabled: !!username,
    },
  });

  if (isUserLoading) {
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
        profileUser?.data?.name || (isOwnProfile ? currentUser?.name : "") || ""
      }
      avatarUrl={
        profileUser?.data?.image ||
        (isOwnProfile ? currentUser?.image : "") ||
        ""
      }
    />
  );
}
