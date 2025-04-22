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
    <div className="p-3 border-t border-playdamnit-darker">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-playdamnit-dark/30 hover:bg-playdamnit-dark/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-playdamnit-purple/20 flex items-center justify-center text-playdamnit-cyan font-bold">
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
          <div className="text-sm font-medium text-playdamnit-light truncate">
            {user.username || user.name || user.email}
          </div>
          <div className="text-xs text-playdamnit-light/40 truncate">
            {user.email}
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <Button
        onClick={handleSignOut}
        disabled={signOut.isPending}
        variant="ghost"
        className="w-full mt-2 text-playdamnit-light/60 hover:text-playdamnit-light hover:bg-playdamnit-purple/10 flex items-center gap-2 py-2"
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
    <div className="p-3 border-t border-playdamnit-darker">
      <Button
        className="w-full bg-gradient-to-r from-playdamnit-purple to-playdamnit-cyan hover:opacity-90 transition-opacity text-white rounded-lg flex items-center justify-center gap-2 py-2.5"
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
        <Button className="w-full bg-playdamnit-dark hover:bg-playdamnit-dark/80 text-playdamnit-cyan border border-playdamnit-cyan/30 transition-colors rounded-lg flex items-center justify-center gap-2 py-2.5">
          <Bot className="w-5 h-5" />
          <span className="hidden md:block">Game Assistant</span>
        </Button>
      </AIChatButton>
    </div>
  );
};
