"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Bot, User, Send, Loader2, Filter } from "lucide-react";
import { GameSearchResult } from "@/utils/types/game";
import GameResult from "./chat/GameResult";
import GameResultsList from "./chat/GameResultsList";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  gameData?: GameSearchResult | null;
  gameResults?: GameSearchResult[];
  userRating?: number;
  userStatus?: string;
  userReview?: string;
  gameId?: number; // Add gameId to track which game this message refers to
}

export default function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showOnlyGames, setShowOnlyGames] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastGameMentionedRef = useRef<number | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Function to check if this is an update to the last mentioned game
  const isGameUpdateMessage = (userInput: string): boolean => {
    // Simple heuristic: if the message is short and contains rating indicators
    // and we have a recently mentioned game, it's likely an update
    const isRatingUpdate = /\b([0-9](\.[0-9])?|10)\/10\b/.test(userInput);
    const isStatusUpdate = /(finished|playing|dropped|want to play)/i.test(
      userInput
    );
    const isShortMessage = userInput.split(" ").length < 15;

    return (
      (isRatingUpdate || isStatusUpdate) &&
      isShortMessage &&
      lastGameMentionedRef.current !== null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const isUpdate = isGameUpdateMessage(input);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    if (isUpdate) {
      // For updates, we'll keep all messages but mark that this is an update
      setMessages((prev) => [...prev, userMessage]);
    } else {
      // For new topics, just add the message normally
      setMessages((prev) => [...prev, userMessage]);
    }

    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Send message to API
      const response = await axios.post("/api/chat", {
        messages: messages
          .concat(userMessage)
          .map(({ role, content }) => ({ role, content })),
        showOnlyGames, // Pass the filter preference to the API
      });

      // Get assistant response
      const assistantMessage = response.data.message;
      const gameData = assistantMessage.gameData || null;
      const gameResults = assistantMessage.gameResults || null;
      const gameId = gameData?.id || null;

      // Store user rating, status, and review for later use with game selection
      const userRating = assistantMessage.userRating;
      const userStatus = assistantMessage.userStatus;
      const userReview = assistantMessage.userReview;

      if (gameResults) {
        // This is a response with multiple game options
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: assistantMessage.content,
            gameResults: gameResults,
            userRating: userRating,
            userStatus: userStatus,
            userReview: userReview,
          },
        ]);
      } else if (isUpdate && lastGameMentionedRef.current === gameId) {
        // This is an update to the last game - replace the last assistant message
        setMessages((prev) => {
          // Find the index of the last assistant message about this game
          const lastAssistantIndex = [...prev]
            .reverse()
            .findIndex(
              (msg) => msg.role === "assistant" && msg.gameData?.id === gameId
            );

          if (lastAssistantIndex !== -1) {
            // Convert from reverse index to actual index
            const actualIndex = prev.length - 1 - lastAssistantIndex;

            // Create a new array with the updated message
            const newMessages = [...prev];
            newMessages[actualIndex] = {
              ...newMessages[actualIndex],
              content: assistantMessage.content,
              gameData: gameData,
              id: (Date.now() + 1).toString(), // New ID to force re-render
            };

            // Add the user's update message
            return newMessages;
          }

          // If we couldn't find a message to update, just add as new
          return [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: assistantMessage.role,
              content: assistantMessage.content,
              gameData: gameData,
              gameId: gameId,
            },
          ];
        });
      } else {
        // This is a new game or topic - add as a new message
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: assistantMessage.role,
            content: assistantMessage.content,
            gameData: gameData,
            gameId: gameId,
          },
        ]);

        // Update the last mentioned game reference
        if (gameId) {
          lastGameMentionedRef.current = gameId;
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle game selection from the list
  const handleGameSelection = async (
    messageId: string,
    selectedGame: GameSearchResult
  ) => {
    // Find the message that contains the game results
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) return;

    setIsLoading(true);

    try {
      // Create a game data object with the user's rating, status, and review
      const gameData = {
        ...selectedGame,
        userRating: message.userRating,
        userStatus: message.userStatus,
        userReview: message.userReview,
      };

      // Create a response message
      let responseContent = `You selected "${selectedGame.name}".`;

      if (message.userRating) {
        responseContent += ` You rated it ${message.userRating}/10.`;
      }

      if (message.userStatus) {
        const statusMap: Record<string, string> = {
          finished: "finished",
          playing: "currently playing",
          dropped: "dropped",
          want_to_play: "want to play",
        };
        responseContent += ` You've marked it as ${statusMap[message.userStatus] || message.userStatus}.`;
      }

      if (message.userReview) {
        responseContent += ` Your thoughts: "${message.userReview}"`;
      }

      // Replace the game results message with the selected game
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: responseContent,
                gameData: gameData,
                gameResults: undefined,
                gameId: selectedGame.id,
                id: (Date.now() + 1).toString(), // New ID to force re-render
              }
            : msg
        )
      );

      // Update the last mentioned game reference
      lastGameMentionedRef.current = selectedGame.id;
    } catch (err) {
      console.error("Error selecting game:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("An error occurred while selecting the game")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter toggle change
  const handleFilterChange = (checked: boolean) => {
    setShowOnlyGames(checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-quokka-darker border border-quokka-purple/20 text-white max-w-2xl p-0 h-[80vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-quokka-purple/20 flex items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white">
            Game Assistant
          </DialogTitle>

          {/* Game Type Filter Toggle - Compact in header */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 bg-quokka-dark/80 hover:bg-quokka-dark/90 transition-colors px-3 py-1.5 rounded-full border border-quokka-purple/40 mr-6 w-[140px] justify-between">
                  <Filter className="h-3.5 w-3.5 text-quokka-cyan" />
                  <Switch
                    id="game-filter"
                    checked={showOnlyGames}
                    onCheckedChange={handleFilterChange}
                    className="data-[state=checked]:bg-quokka-purple/40 data-[state=unchecked]:bg-quokka-purple/40 [&>span]:bg-quokka-cyan"
                  />
                  <span
                    className={cn(
                      "text-xs font-medium py-0 min-w-[70px] text-center",
                      showOnlyGames ? "text-quokka-cyan" : "text-quokka-light"
                    )}
                  >
                    {showOnlyGames ? "Games only" : "All types"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-quokka-dark border-quokka-purple/30 text-quokka-light"
              >
                <p className="text-xs max-w-[250px]">
                  {showOnlyGames
                    ? "Showing only Main Games, Remakes, Remasters, and Expanded Games"
                    : "Showing all content including DLCs, Expansions, Bundles, etc."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 my-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-quokka-cyan" />
              <p className="text-lg font-medium">
                How can I help you with games?
              </p>
              <p className="text-sm mt-2">
                Try saying something like "I played Baldur's Gate 3 and finished
                it yesterday, I give it 8/10"
              </p>

              {/* Filter info for empty state - simplified to just text */}
              <p className="mt-6 text-xs text-quokka-light bg-quokka-dark/40 py-1.5 px-3 rounded-full inline-flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-quokka-cyan" />
                <span
                  className={
                    showOnlyGames ? "text-quokka-cyan" : "text-quokka-light"
                  }
                >
                  Filter: {showOnlyGames ? "Games only" : "All game types"}
                </span>
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <AnimatePresence key={message.id} mode="wait">
                <motion.div
                  className="w-full"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      message.role === "user"
                        ? "bg-quokka-purple/10"
                        : "bg-quokka-dark/30"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-quokka-purple/20">
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-quokka-light" />
                      ) : (
                        <Bot className="w-4 h-4 text-quokka-cyan" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">
                        {message.role === "user" ? "You" : "Assistant"}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>

                  {/* Render game results list if available */}
                  {message.gameResults && message.gameResults.length > 0 && (
                    <div className="mt-2 ml-11">
                      <GameResultsList
                        games={message.gameResults}
                        onSelectGame={(game) =>
                          handleGameSelection(message.id, game)
                        }
                      />
                    </div>
                  )}

                  {/* Render single game data if available */}
                  {message.gameData && (
                    <div className="mt-2 ml-11">
                      <GameResult
                        game={message.gameData}
                        key={`game-${message.id}`}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ))
          )}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 text-quokka-cyan animate-spin" />
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error.message}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-quokka-purple/20 p-4"
        >
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Tell me about a game you've played..."
              className="w-full bg-quokka-dark border border-quokka-purple/20 rounded-full py-3 px-4 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-quokka-purple"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center",
                input.trim()
                  ? "bg-quokka-cyan text-quokka-dark"
                  : "bg-quokka-purple/20 text-gray-400"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
