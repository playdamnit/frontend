"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  usePostApiUserByUsernameGames,
  useGetApiMe,
  getGetApiUserByUsernameGamesQueryKey,
  getGetApiUserByUsernameQueryKey,
  getGetApiMeQueryKey,
  Game,
} from "@playdamnit/api-client";
import { useQueryClient } from "@tanstack/react-query";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  game: Game;
  isEmbedded?: boolean;
}

export default function CreateGameModal({
  isOpen,
  onClose,
  onSuccess,
  game,
  isEmbedded = false,
}: CreateGameModalProps) {
  const [status, setStatus] = useState<
    "Finished" | "Playing" | "Dropped" | "Want"
  >("Want");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { data: me } = useGetApiMe();
  const queryClient = useQueryClient();

  // Use the API hook
  const createGameMutation = usePostApiUserByUsernameGames();

  // Determine if we're in a submitting state
  const isSubmitting = createGameMutation.isPending;

  const getRatingEmoji = useMemo(() => {
    if (rating === 0) return "🤔";
    if (rating <= 2) return "😤";
    if (rating <= 4) return "😐";
    if (rating <= 6) return "🙂";
    if (rating <= 8) return "😊";
    return "🤩";
  }, [rating]);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setRating(value);
  };

  const calculateRatingFromPosition = (clientX: number) => {
    if (!sliderRef.current) return rating;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, position / rect.width));
    return Math.round(percentage * 100) / 10; // Round to 1 decimal place
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const newRating = calculateRatingFromPosition(e.clientX);
    setRating(newRating);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newRating = calculateRatingFromPosition(e.clientX);
      setRating(newRating);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse up outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("mouseleave", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mouseleave", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const handleSubmit = async () => {
    if (!me?.data.username || !game.id) {
      console.error("No username or game ID available");
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

      await createGameMutation.mutateAsync(
        {
          username: me?.data.username,
          data: {
            gameId: game.id,
            status: dbStatus,
            rating: rating || 0,
            review: review || undefined,
            platformId: game.platforms?.[0]?.id || 1,
          },
        },
        {
          onSuccess: () => {
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
          },
        }
      );
    } catch (error) {
      console.error("Error creating game:", error);
      // TODO: Show error toast
    }
  };

  // The content of the modal
  const ModalContent = () => (
    <div className={cn("relative p-6")}>
      {/* Game Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={game.cover?.url || "/placeholder.svg"}
          alt={game.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl font-bold">
              {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-4xl transition-all duration-200">
              {getRatingEmoji}
            </span>
          </div>
          <h2 className="text-2xl font-bold">{game.name}</h2>
        </div>
      </div>

      {/* Status Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {["Finished", "Playing", "Dropped", "Want"].map((statusOption) => (
          <button
            key={statusOption}
            onClick={() => setStatus(statusOption as typeof status)}
            className={cn(
              "py-2 px-4 rounded-full border border-playdamnit-purple/20 text-center",
              status === statusOption
                ? "bg-playdamnit-purple/10"
                : "hover:bg-playdamnit-purple/5"
            )}
          >
            {statusOption}
          </button>
        ))}
      </div>

      {/* Rating Slider */}
      <div className="mb-8">
        <div className="flex justify-between text-gray-400 mb-2">
          <span>NS</span>
          <span>10</span>
        </div>
        <div
          className="relative"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="h-[2px] bg-gray-600 w-full"></div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={rating}
            onChange={handleRatingChange}
            className="absolute top-0 w-full h-[2px] opacity-0 cursor-pointer"
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-playdamnit-cyan rounded-full transition-all duration-200 ${
              isDragging ? "scale-125" : ""
            }`}
            style={{ left: `${(rating / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Review Textarea */}
      <Textarea
        placeholder="Write your review in less than 5000 characters..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="min-h-[200px] bg-playdamnit-dark border border-playdamnit-purple/20 text-white placeholder:text-gray-400 mb-8 rounded-lg p-4 focus:border-playdamnit-purple focus:ring-1 focus:ring-playdamnit-purple focus:outline-none"
      />

      {/* Create Game Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={cn(
          "w-full py-4 bg-playdamnit-cyan text-playdamnit-dark rounded-full font-semibold transition-colors",
          isSubmitting
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-playdamnit-cyan/80"
        )}
      >
        {isSubmitting ? "Adding game..." : "Add game"}
      </button>
    </div>
  );

  if (isEmbedded) {
    return <ModalContent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-playdamnit-darker border border-playdamnit-purple/20 text-white max-w-2xl p-0 overflow-hidden">
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
}
