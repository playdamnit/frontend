"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ProfileHeader } from "./ProfileHeader";
// import { StatsCards } from "./StatsCards";
import { ProfileTabs } from "./ProfileTabs";
import { SearchAndFilter } from "./SearchAndFilter";
import { GamesList } from "./GamesList";
import AddGameModal from "@/components/add-game-modal";
import SearchModal from "@/components/search/search-modal";
import {
  Game,
  getGetApiUserByUsernameGamesQueryKey,
  useGetApiUserByUsernameGames,
  useDeleteApiUserByUsernameGamesById,
} from "@/playdamnit-client";

export interface ProfileContentProps {
  isOwnProfile: boolean;
  username: string;
  fullName?: string;
  avatarUrl?: string;
}

export const ProfileContent = ({
  isOwnProfile,
  username,
  fullName,
  avatarUrl,
}: ProfileContentProps) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "row">("row");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { data: userGames, isLoading } = useGetApiUserByUsernameGames(username);
  const deleteGameMutation = useDeleteApiUserByUsernameGamesById();

  const queryClient = useQueryClient();

  const transformedGames = userGames?.data.games.map((game) => ({
    id: game.id,
    title: game.name,
    cover: game.cover?.url,
    genres: game.genres?.map((g: any) => g.name) || [],
    platform: game.platforms?.[0]?.name || "Unknown",
    status: (game.userGameData?.status === "want_to_play"
      ? "Want"
      : game.userGameData?.status === "finished"
        ? "Finished"
        : game.userGameData?.status === "playing"
          ? "Playing"
          : game.userGameData?.status === "dropped"
            ? "Dropped"
            : game.userGameData?.status) as
      | "Want"
      | "Finished"
      | "Playing"
      | "Dropped",
    rating: game.userGameData?.rating || 0,
    // playtime: Math.round((game.userGameData?.playtime_minutes || 0) / 60),
    // achievements: {
    //   completed: game.userGameData?.achievements_completed || 0,
    //   total: game.userGameData?.achievements_total || 0,
    // },
    source: game.userGameData?.source || "manual",
    dateAdded: game.userGameData?.addedAt
      ? new Date(game.userGameData.addedAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
  }));

  const getStatusCount = (status: string) => {
    if (status === "All") return transformedGames?.length || 0;
    return transformedGames?.filter((game) =>
      status === "want_to_play"
        ? game.status === "Want"
        : status === "finished"
          ? game.status === "Finished"
          : status === "playing"
            ? game.status === "Playing"
            : status === "dropped"
              ? game.status === "Dropped"
              : game.status === status
    ).length;
  };

  const tabs = [
    {
      name: "All",
      count: getStatusCount("All"),
      icon: "🎮",
      color: "playdamnit-cyan",
    },
    {
      name: "Finished",
      count: getStatusCount("finished"),
      icon: "✓",
      color: "green-500",
    },
    {
      name: "Playing",
      count: getStatusCount("playing"),
      icon: "▶",
      color: "blue-500",
    },
    {
      name: "Dropped",
      count: getStatusCount("dropped"),
      icon: "✕",
      color: "red-500",
    },
    {
      name: "Want",
      count: getStatusCount("want_to_play"),
      icon: "⭐",
      color: "yellow-500",
    },
  ];

  // const totalPlaytime = transformedGames?.reduce(
  //   (sum, game) => sum + (game.playtime || 0),
  //   0
  // );

  const completionRate =
    (transformedGames?.filter((game) => game.status === "Finished").length ||
      0 / (transformedGames?.length || 0)) * 100 || 0;

  // const achievementsCompleted = transformedGames?.reduce(
  //   (sum, game) => sum + (game.achievements?.completed || 0),
  //   0
  // );

  // const achievementsTotal = transformedGames.reduce(
  //   (sum, game) => sum + (game.achievements?.total || 0),
  //   0
  // );

  // Calculate platform distribution
  const platformDistribution = Array.from(
    new Set(transformedGames?.map((g) => g.platform))
  ).map((platform) => {
    const count = transformedGames?.filter(
      (g) => g.platform === platform
    ).length;
    const percentage = (count || 0 / (transformedGames?.length || 0)) * 100;
    return { platform, count, percentage };
  });

  // Filter games based on active tab and search term
  const filteredGames = transformedGames?.filter((game) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Finished" && game.status === "Finished") ||
      (activeTab === "Playing" && game.status === "Playing") ||
      (activeTab === "Dropped" && game.status === "Dropped") ||
      (activeTab === "Want" && game.status === "Want");

    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genres.some((genre: string) =>
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  const handleGameClick = (game: Game) => {
    if (!isOwnProfile) return;

    const gameForModal: Game & {
      userStatus?: string;
      userRating?: number;
      userReview?: string;
      userGameId?: number;
    } = {
      id: game.id,
      name: game.name,
      slug: game.name.toLowerCase().replace(/\s+/g, "-"),
      cover: game.cover,
      genres: game.genres,
      platforms: game.platforms,
      createdAt: Date.now(),
      // Add properties for editing
      userStatus:
        game.userGameData?.status?.toLowerCase() === "want"
          ? "want_to_play"
          : game.userGameData?.status?.toLowerCase(),
      userRating: game.userGameData?.rating,
      userReview: game.userGameData?.review,
      userGameId: game.id,
    };

    setSelectedGame(gameForModal);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedGame(null);

    queryClient.invalidateQueries({
      queryKey: getGetApiUserByUsernameGamesQueryKey(username),
    });
  };

  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  // Handle game deletion
  const handleDeleteGame = (game: Game) => {
    if (!isOwnProfile) return; // Only allow deleting on own profile

    if (
      window.confirm(
        `Are you sure you want to remove ${game.title} from your collection?`
      )
    ) {
      deleteGameMutation.mutate(
        { username, id: game.id },
        {
          onSuccess: () => {
            // Invalidate the query to refresh the data
            queryClient.invalidateQueries({
              queryKey: getGetApiUserByUsernameGamesQueryKey(username),
            });
          },
          onError: (error) => {
            console.error("Error deleting game:", error);
            alert("Failed to delete game. Please try again.");
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-playdamnit-light/40 mb-2">
              Loading games...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          isOwnProfile={isOwnProfile}
          username={username}
          fullName={fullName}
          avatarUrl={
            avatarUrl &&
            !(avatarUrl.startsWith("http") || avatarUrl.startsWith("data:"))
              ? `data:image/png;base64,${avatarUrl}`
              : avatarUrl
          }
          onAddGameClick={handleSearchModalOpen}
        />

        {/* <StatsCards
          // totalPlaytime={totalPlaytime || 0}
          completionRate={completionRate}
          // achievementsCompleted={achievementsCompleted}
          // achievementsTotal={achievementsTotal}
          totalGames={transformedGames?.length || 0}
          platformDistribution={platformDistribution}
        /> */}

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <GamesList
          games={filteredGames}
          isOwnProfile={isOwnProfile}
          viewMode={viewMode}
          onGameClick={handleGameClick}
          onDeleteClick={isOwnProfile ? handleDeleteGame : undefined}
        />

        {/* Add Game Modal */}
        {selectedGame && (
          <AddGameModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
            game={selectedGame}
            isEditing={true}
          />
        )}

        {/* Game Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onGameSelect={(game: Game) => {
            setSelectedGame(game);
            setIsModalOpen(true);
            setIsSearchModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};
