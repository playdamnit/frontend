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
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-quokka-purple/20 to-quokka-cyan/20 rounded-xl -z-10"></div>

      <div className="pt-8 px-6 flex flex-col md:flex-row items-start md:items-end gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-quokka-purple to-quokka-cyan p-1 shadow-xl shadow-quokka-purple/10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${username}'s avatar`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-quokka-dark flex items-center justify-center">
              <span className="text-3xl font-bold text-quokka-cyan">
                {username[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-quokka-light">
                {fullName || username}
                {isOwnProfile && (
                  <button className="ml-2 text-quokka-light/40 hover:text-quokka-cyan transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </h1>
              <div className="text-quokka-light/60 text-sm mb-2">
                @{username}
              </div>

              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="bg-quokka-purple/10 border-quokka-purple/30 text-quokka-purple px-2 py-0.5"
                  >
                    <Trophy className="w-3 h-3 mr-1" />
                    Level 5
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-quokka-light/40">Following</span>
                    <span className="ml-1.5 text-quokka-light font-medium">
                      0
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-quokka-light/40">Followers</span>
                    <span className="ml-1.5 text-quokka-light font-medium">
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
                    className="px-4 py-2 bg-gradient-to-r from-quokka-purple to-quokka-cyan text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Game
                  </button>
                  <button className="px-4 py-2 bg-quokka-purple/20 hover:bg-quokka-purple/30 text-quokka-purple rounded-lg transition-colors text-sm font-medium">
                    Edit Profile
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
