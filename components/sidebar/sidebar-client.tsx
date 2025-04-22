"use client";

import { LogOut, Plus, Bot } from "lucide-react";

import { Button } from "../ui/button";
import AIChatButton from "../ai-chat-button";
import { useSignOut } from "@/hooks/auth";
import { User } from "better-auth";

// Extend the User type to include username property
type ExtendedUser = User & {
  username?: string;
};

type UserSectionProps = {
  user: ExtendedUser | null;
};

export const UserSection = ({ user }: UserSectionProps) => {
  const { signOut } = useSignOut();

  const handleSignOut = async () => {
    await signOut.mutateAsync();
  };

  if (!user) return null;

  return (
    <div className="p-3 border-t border-quokka-darker">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-quokka-dark/30 hover:bg-quokka-dark/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-quokka-purple/20 flex items-center justify-center text-quokka-cyan font-bold">
          {user.image ? (
            <img
              src={
                user.image.startsWith("data:") || user.image.startsWith("http")
                  ? user.image
                  : `data:image/png;base64,${user.image}`
              }
              alt={user.username ?? user.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {user.username?.[0].toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="hidden md:block overflow-hidden">
          <div className="text-sm font-medium text-quokka-light truncate">
            {user.username || user.name || user.email}
          </div>
          <div className="text-xs text-quokka-light/40 truncate">
            {user.email}
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <Button
        onClick={handleSignOut}
        disabled={signOut.isPending}
        variant="ghost"
        className="w-full mt-2 text-quokka-light/60 hover:text-quokka-light hover:bg-quokka-purple/10 flex items-center gap-2 py-2"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:block">
          {signOut.isPending ? "Signing out..." : "Sign out"}
        </span>
      </Button>
    </div>
  );
};

export const AddGameButton = () => {
  return (
    <div className="p-3 border-t border-quokka-darker">
      <Button
        className="w-full bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 transition-opacity text-white rounded-lg flex items-center justify-center gap-2 py-2.5"
        // onClick={onAddGameClick}
      >
        <Plus className="w-5 h-5" />
        <span className="hidden md:block">Add Game</span>
      </Button>
    </div>
  );
};

export const GameAssistantButton = () => {
  return (
    <div className="p-3">
      <AIChatButton>
        <Button className="w-full bg-quokka-dark hover:bg-quokka-dark/80 text-quokka-cyan border border-quokka-cyan/30 transition-colors rounded-lg flex items-center justify-center gap-2 py-2.5">
          <Bot className="w-5 h-5" />
          <span className="hidden md:block">Game Assistant</span>
        </Button>
      </AIChatButton>
    </div>
  );
};
