import { getSession } from "@/lib/authServer";
import ProfileClient from "./components/ProfileClient";

export default async function UserProfilePage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const session = await getSession();
  const currentUser = session?.data?.user ?? null;
  const { username } = params;

  const isOwnProfile =
    currentUser?.username?.toLowerCase() === username.toLowerCase();

  return (
    <ProfileClient
      username={username}
      isOwnProfile={isOwnProfile}
      currentUser={currentUser}
    />
  );
}
