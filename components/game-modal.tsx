"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Edit3 } from "lucide-react";
import {
  Game,
  UserGameWithUserData,
} from "@playdamnit/api-client";
import GameForm from "./game-form";

type GameModalMode = "add" | "update";
type GameData = Game | UserGameWithUserData;

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: GameModalMode;
  game: GameData;
  isEmbedded?: boolean;
  onBackToSearch?: () => void;
}

export default function GameModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  game,
  isEmbedded = false,
  onBackToSearch,
}: GameModalProps) {
  const modalContent = (
    <GameForm
      mode={mode}
      game={game}
      onSuccess={onSuccess}
      onCancel={onClose}
      onBackToSearch={onBackToSearch}
    />
  );

  if (isEmbedded) {
    return modalContent;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-playdamnit-dark border-playdamnit-purple/30 text-playdamnit-light max-w-lg h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-playdamnit-light flex items-center gap-2">
            {mode === "add" ? (
              <>
                <Star className="w-5 h-5 text-playdamnit-cyan" />
                Add Game to Library
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 text-playdamnit-cyan" />
                Update Game
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-6 pb-6">
            {modalContent}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 