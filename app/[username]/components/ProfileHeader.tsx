import { Pencil, Trophy, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  isOwnProfile: boolean;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  onAddGameClick?: () => void;
}

export function ProfileHeader({
  isOwnProfile,
  username,
  fullName,
  avatarUrl,
  onAddGameClick,
}: ProfileHeaderProps) {
  return (
    <div className="relative mb-12">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-playdamnit-purple/20 to-playdamnit-cyan/20 rounded-xl -z-10"></div>

      <div className="pt-8 px-6 flex flex-col md:flex-row items-start md:items-end gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-playdamnit-purple to-playdamnit-cyan p-1 shadow-xl shadow-playdamnit-purple/10">
          {avatarUrl ? (
            <img
              src={
                avatarUrl.startsWith("data:") || avatarUrl.startsWith("http")
                  ? avatarUrl
                  : `data:image/png;base64,${avatarUrl}`
              }
              alt={`${username}'s avatar`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-playdamnit-dark flex items-center justify-center">
              <span className="text-3xl font-bold text-playdamnit-cyan">
                {username[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-playdamnit-light">
                {fullName || username}
                {isOwnProfile && (
                  <button className="ml-2 text-playdamnit-light/40 hover:text-playdamnit-cyan transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </h1>
              <div className="text-playdamnit-light/60 text-sm mb-2">
                @{username}
              </div>

              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="bg-playdamnit-purple/10 border-playdamnit-purple/30 text-playdamnit-purple px-2 py-0.5"
                  >
                    <Trophy className="w-3 h-3 mr-1" />
                    Level 5
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-playdamnit-light/40">Following</span>
                    <span className="ml-1.5 text-playdamnit-light font-medium">
                      0
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-playdamnit-light/40">Followers</span>
                    <span className="ml-1.5 text-playdamnit-light font-medium">
                      0
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isOwnProfile && (
                <>
                  <button
                    onClick={onAddGameClick}
                    className="px-4 py-2 bg-gradient-to-r from-playdamnit-purple to-playdamnit-cyan text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Game
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
