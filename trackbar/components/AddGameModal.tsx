"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { GameSearchResult } from "@/utils/types/game";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAddUserGame, useUpdateUserGame } from "@/hooks/useUserGames";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  game: GameSearchResult & {
    userStatus?: string;
    userRating?: number;
    userReview?: string;
    userGameId?: number;
  };
  isEditing?: boolean;
  isEmbedded?: boolean;
}

export default function AddGameModal({
  isOpen,
  onClose,
  onSuccess,
  game,
  isEditing = false,
  isEmbedded = false,
}: AddGameModalProps) {
  const [status, setStatus] = useState<
    "Finished" | "Playing" | "Dropped" | "Want"
  >("Want");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Use our custom hooks
  const addGameMutation = useAddUserGame();
  const updateGameMutation = useUpdateUserGame(
    isEditing && game.userGameId ? String(game.userGameId) : ""
  );

  // Determine if we're in a submitting state
  const isSubmitting =
    addGameMutation.isPending || updateGameMutation.isPending;

  // Initialize with existing data if editing or from AI chat
  useEffect(() => {
    if (
      (isEditing || game.userRating || game.userStatus || game.userReview) &&
      game
    ) {
      // Try to extract status from game data if available
      if (game.userStatus) {
        const statusMap: Record<
          string,
          "Finished" | "Playing" | "Dropped" | "Want"
        > = {
          finished: "Finished",
          playing: "Playing",
          dropped: "Dropped",
          want_to_play: "Want",
        };
        setStatus(statusMap[game.userStatus] || "Want");
      }

      // Set rating if available
      if (game.userRating !== undefined) {
        setRating(game.userRating);
      } else if (game.total_rating) {
        // Use game's total rating as a fallback
        setRating(game.total_rating / 10); // Convert from 0-100 to 0-10
      }

      // Set review if available
      if (game.userReview) {
        setReview(game.userReview);
      }
    }
  }, [game, isEditing]);

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

      if (isEditing && game.userGameId) {
        // Update existing game using the mutation
        await updateGameMutation.mutateAsync({
          status: dbStatus,
          rating: Math.round(rating * 10), // Convert to 0-100 range for storage
          review: review,
        });
      } else {
        // Add new game using the mutation
        await addGameMutation.mutateAsync({
          gameId: game.id,
          status: dbStatus,
          rating: Math.round(rating * 10), // Convert to 0-100 range for storage
          review: review,
          platformId: game.platforms?.[0]?.id || 0, // Use first platform as default
          source: "manual",
          gameDetails: game,
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving game:", error);
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
            <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
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
              "py-2 px-4 rounded-full border border-quokka-purple/20 text-center",
              status === statusOption
                ? "bg-quokka-purple/10"
                : "hover:bg-quokka-purple/5"
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
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-quokka-cyan rounded-full transition-all duration-200 ${
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
        className="min-h-[200px] bg-quokka-dark border border-quokka-purple/20 text-white placeholder:text-gray-400 mb-8 rounded-lg p-4 focus:border-quokka-purple focus:ring-1 focus:ring-quokka-purple focus:outline-none"
      />

      {/* Add/Update Game Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={cn(
          "w-full py-4 bg-quokka-cyan text-quokka-dark rounded-full font-semibold transition-colors",
          isSubmitting
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-quokka-cyan/80"
        )}
      >
        {isSubmitting
          ? isEditing
            ? "Updating game..."
            : "Adding game..."
          : isEditing
            ? "Update game"
            : "Add game"}
      </button>
    </div>
  );

  // If embedded, just return the content
  if (isEmbedded) {
    return <ModalContent />;
  }

  // Otherwise, wrap in Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-quokka-darker border border-quokka-purple/20 text-white max-w-2xl p-0 overflow-hidden">
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
}
