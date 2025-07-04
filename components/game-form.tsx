"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, GamepadIcon, Loader2 } from "lucide-react";
import {
  Game,
  UserGameWithUserData,
  usePostApiUserByUsernameGames,
  usePatchApiUserByUsernameGamesById,
  useGetApiMe,
  getGetApiUserByUsernameGamesQueryKey,
  getGetApiUserByUsernameQueryKey,
  getGetApiMeQueryKey,
} from "@playdamnit/api-client";
import { useQueryClient } from "@tanstack/react-query";

type GameFormMode = "add" | "update";
type GameData = Game | UserGameWithUserData;

interface GameFormProps {
  mode: GameFormMode;
  game: GameData;
  onSuccess: () => void;
  onCancel: () => void;
  onBackToSearch?: () => void;
}

export default function GameForm({
  mode,
  game,
  onSuccess,
  onCancel,
  onBackToSearch,
}: GameFormProps) {
  const [status, setStatus] = useState<
    "Finished" | "Playing" | "Dropped" | "Want"
  >("Want");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [endedAt, setEndedAt] = useState<string>("");
  const { data: me } = useGetApiMe();
  const queryClient = useQueryClient();

  const addGameMutation = usePostApiUserByUsernameGames();
  const updateGameMutation = usePatchApiUserByUsernameGamesById();

  const isSubmitting = mode === "add" 
    ? addGameMutation.isPending 
    : updateGameMutation.isPending;

  // Initialize with existing data for update mode
  useEffect(() => {
    if (mode === "update" && game) {
      const userGame = game as UserGameWithUserData;
      
      // Try to extract status from game data if available
      if (userGame.userGameData?.status) {
        const statusMap: Record<
          string,
          "Finished" | "Playing" | "Dropped" | "Want"
        > = {
          finished: "Finished",
          playing: "Playing",
          dropped: "Dropped",
          want_to_play: "Want",
        };
        setStatus(statusMap[userGame.userGameData.status] || "Want");
      }

      // Set rating if available
      if (userGame.userGameData?.rating) {
        setRating(userGame.userGameData.rating);
      }

      // Set review if available
      if (userGame.userGameData?.review) {
        setReview(userGame.userGameData.review);
      }

      // Set endedAt if available
      if (userGame.userGameData?.endedAt) {
        // Convert from ISO string to date input format (YYYY-MM-DD)
        const date = new Date(userGame.userGameData.endedAt);
        setEndedAt(date.toISOString().split("T")[0]);
      }
    }
  }, [game, mode]);

  const getRatingEmoji = useMemo(() => {
    if (rating === 0) return "🤔";
    if (rating <= 2) return "😤";
    if (rating <= 4) return "😐";
    if (rating <= 6) return "🙂";
    if (rating <= 8) return "😊";
    return "🤩";
  }, [rating]);

  const statusOptions = [
    {
      value: "Want",
      label: "Want to Play",
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      value: "Playing",
      label: "Playing",
      color: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    {
      value: "Finished",
      label: "Finished",
      color:
        "bg-playdamnit-cyan/20 text-playdamnit-cyan border-playdamnit-cyan/30",
    },
    {
      value: "Dropped",
      label: "Dropped",
      color: "bg-red-500/20 text-red-300 border-red-500/30",
    },
  ];

  const handleSubmit = async () => {
    if (!me?.data.username) {
      console.error("No username available");
      return;
    }

    try {
      // Convert status to database enum format
      const dbStatus =
        status === "Want"
          ? "want_to_play"
          : (status.toLowerCase() as
              | "finished"
              | "playing"
              | "dropped"
              | "want_to_play");

      const invalidateQueries = () => {
        queryClient.invalidateQueries({
          queryKey: getGetApiUserByUsernameQueryKey(me?.data.username),
        });
        queryClient.invalidateQueries({
          queryKey: getGetApiUserByUsernameGamesQueryKey(me?.data.username),
        });
        queryClient.invalidateQueries({
          queryKey: getGetApiMeQueryKey(),
        });
        onSuccess();
      };

      if (mode === "add") {
        await addGameMutation.mutateAsync(
          {
            username: me?.data.username,
            data: {
              gameId: game.id,
              status: dbStatus,
              rating: rating || 0,
              review: review || undefined,
              platformId: game.platforms?.[0]?.id || 1,
              endedAt: endedAt ? new Date(endedAt).toISOString() : undefined,
            },
          },
          {
            onSuccess: invalidateQueries,
          }
        );
      } else {
        await updateGameMutation.mutateAsync(
          {
            username: me?.data.username,
            id: game.id,
            data: {
              status: dbStatus,
              rating: rating || 0,
              review: review || undefined,
              endedAt: endedAt ? new Date(endedAt).toISOString() : undefined,
            },
          },
          {
            onSuccess: invalidateQueries,
          }
        );
      }
    } catch (error) {
      console.error(`Error ${mode === "add" ? "saving" : "updating"} game:`, error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-playdamnit-purple/10 to-playdamnit-cyan/10 rounded-lg border border-playdamnit-purple/20">
        <div className="relative">
          <img
            src={game.cover?.url || "/placeholder.svg"}
            alt={game.name}
            className="w-20 h-28 rounded-lg object-cover shadow-lg"
          />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-playdamnit-cyan rounded-full flex items-center justify-center shadow-lg">
            <GamepadIcon className="w-4 h-4 text-playdamnit-dark" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-playdamnit-light mb-2 line-clamp-2">
            {game.name}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-playdamnit-cyan">
                {rating > 0 ? rating.toFixed(1) : "—"}
              </span>
              <span className="text-2xl">{getRatingEmoji}</span>
            </div>
            {game.platforms && game.platforms.length > 0 && (
              <Badge
                variant="outline"
                className="text-xs bg-playdamnit-dark/50 border-playdamnit-purple/30"
              >
                {game.platforms[0].name}
              </Badge>
            )}
          </div>
          {game.summary && (
            <p className="text-sm text-playdamnit-light/60 line-clamp-2">
              {game.summary}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-playdamnit-light">
            Status
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setStatus(option.value as typeof status);
                  // Set default date for Finished/Dropped, clear for others
                  if (
                    option.value === "Finished" ||
                    option.value === "Dropped"
                  ) {
                    if (!endedAt) {
                      setEndedAt(new Date().toISOString().split("T")[0]);
                    }
                  } else {
                    setEndedAt("");
                  }
                }}
                className={cn(
                  "p-3 rounded-lg border text-sm font-medium transition-all duration-200",
                  status === option.value
                    ? option.color
                    : "bg-playdamnit-dark/50 text-playdamnit-light/60 border-playdamnit-purple/20 hover:bg-playdamnit-purple/5 hover:border-playdamnit-purple/30"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-playdamnit-light">
            Rating
          </Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-playdamnit-light/60">No Score</span>
              <span className="text-xs text-playdamnit-light/60">
                Perfect 10
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(Number.parseFloat(e.target.value))}
                className="w-full h-2 bg-playdamnit-dark rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${(rating / 10) * 100}%, #1a1a2e ${(rating / 10) * 100}%, #1a1a2e 100%)`,
                }}
              />
              <div className="flex justify-between mt-2">
                {[0, 2, 4, 6, 8, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={cn(
                      "w-6 h-6 rounded-full text-xs font-medium transition-all duration-200",
                      rating === value
                        ? "bg-playdamnit-cyan text-playdamnit-dark scale-110"
                        : "bg-playdamnit-dark border border-playdamnit-purple/30 text-playdamnit-light/60 hover:border-playdamnit-cyan/50"
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Date Input - Only show for Finished or Dropped */}
        {(status === "Finished" || status === "Dropped") && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-playdamnit-light flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {status === "Finished" ? "Date Finished" : "Date Dropped"}
            </Label>
            <input
              type="date"
              value={endedAt}
              onChange={(e) => setEndedAt(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full bg-playdamnit-dark border border-playdamnit-purple/30 text-playdamnit-light rounded-lg p-3 focus:border-playdamnit-cyan focus:ring-1 focus:ring-playdamnit-cyan focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Review */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-playdamnit-light">
            Review <span className="text-playdamnit-light/60">(optional)</span>
          </Label>
          <Textarea
            placeholder="Share your thoughts about this game..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            maxLength={5000}
            className="min-h-[120px] bg-playdamnit-dark border-playdamnit-purple/30 text-playdamnit-light placeholder:text-playdamnit-light/40 focus:border-playdamnit-cyan focus:ring-1 focus:ring-playdamnit-cyan resize-none"
          />
          <div className="text-xs text-playdamnit-light/60 text-right">
            {review.length}/5000 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {onBackToSearch ? (
            <Button
              variant="outline"
              onClick={onBackToSearch}
              className="border-playdamnit-purple/30 text-playdamnit-light hover:bg-playdamnit-purple/10"
              disabled={isSubmitting}
            >
              ← Back to Search
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-playdamnit-purple/30 text-playdamnit-light hover:bg-playdamnit-purple/10"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-playdamnit-purple to-playdamnit-cyan text-white hover:from-playdamnit-purple/80 hover:to-playdamnit-cyan/80 font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === "add" ? "Adding..." : "Updating..."}
              </>
            ) : (
              mode === "add" ? "Add to Library" : "Update Game"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 