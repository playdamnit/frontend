import { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Bot, User, Send, Loader2, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@ai-sdk/react";
import GameResult from "./chat/GameResult";
import GameResultsList from "./chat/GameResultsList";
import { Game } from "@playdamnit/api-client";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showOnlyGames, setShowOnlyGames] = useState(true);

  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({
      api: "http://localhost:3030/api/chat/ai",
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          credentials: "include",
        }),
    });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleGameSelection = (messageId: string, game: Game) => {
    // TODO: add additional logic here
    console.log("Selected game:", game);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-playdamnit-darker border border-playdamnit-purple/20 text-white max-w-2xl p-0 h-[80vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-playdamnit-purple/20 flex items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white">
            Game Assistant
          </DialogTitle>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 bg-playdamnit-dark/80 hover:bg-playdamnit-dark/90 transition-colors px-3 py-1.5 rounded-full border border-playdamnit-purple/40 mr-6 w-[140px] justify-between">
                  <Filter className="h-3.5 w-3.5 text-playdamnit-cyan" />
                  <Switch
                    id="game-filter"
                    checked={showOnlyGames}
                    onCheckedChange={setShowOnlyGames}
                    className="data-[state=checked]:bg-playdamnit-purple/40 data-[state=unchecked]:bg-playdamnit-purple/40 [&>span]:bg-playdamnit-cyan"
                  />
                  <span
                    className={cn(
                      "text-xs font-medium py-0 min-w-[70px] text-center",
                      showOnlyGames
                        ? "text-playdamnit-cyan"
                        : "text-playdamnit-light"
                    )}
                  >
                    {showOnlyGames ? "Games only" : "All types"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-playdamnit-dark border-playdamnit-purple/30 text-playdamnit-light"
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 my-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-playdamnit-cyan" />
              <p className="text-lg font-medium">
                How can I help you with games?
              </p>
              <p className="text-sm mt-2">
                Try saying something like &quot;I played Doom and gave it
                9/10&quot;
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
                  {message.role === "user" || message.role === "assistant" ? (
                    <div
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg",
                        message.role === "user"
                          ? "bg-playdamnit-purple/10"
                          : "bg-playdamnit-dark/30"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-playdamnit-purple/20">
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-playdamnit-light" />
                        ) : (
                          <Bot className="w-4 h-4 text-playdamnit-cyan" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">
                          {message.role === "user" ? "You" : "Assistant"}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {message.parts.map((part, index) => {
                            switch (part.type) {
                              case "text":
                                return <p key={index}>{part.text}</p>;

                              case "tool-invocation": {
                                const { toolInvocation: tool } = part;

                                // one result → GameResult
                                if (tool.state === "result") {
                                  const result = tool.result;
                                  if (result?.results?.length === 1) {
                                    return (
                                      <div key={index} className="mt-2 ml-11">
                                        <GameResult game={result.results[0]} />
                                      </div>
                                    );
                                  }

                                  // few results → GameResultsList
                                  if (result?.results?.length > 1) {
                                    return (
                                      <div key={index} className="mt-2 ml-11">
                                        <GameResultsList
                                          games={result.results}
                                          onSelectGame={(game) => {
                                            handleGameSelection(
                                              message.id,
                                              game
                                            );
                                          }}
                                        />
                                      </div>
                                    );
                                  }

                                  // single object without an array (e.g. selected game) → GameResult
                                  if (result?.id) {
                                    return (
                                      <div key={index} className="mt-2 ml-11">
                                        <GameResult game={result} />
                                      </div>
                                    );
                                  }
                                }

                                return (
                                  <p
                                    key={index}
                                    className="text-sm italic text-playdamnit-light ml-11"
                                  >
                                    Calling tool: {tool.toolName}...
                                  </p>
                                );
                              }

                              default:
                                return null;
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            ))
          )}

          {status === "streaming" && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 text-playdamnit-cyan animate-spin" />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error.message}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-playdamnit-purple/20 p-4"
        >
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Tell me about a game you've played..."
              className="w-full bg-playdamnit-dark border border-playdamnit-purple/20 rounded-full py-3 px-4 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-playdamnit-purple"
              disabled={status === "streaming"}
            />
            <button
              type="submit"
              disabled={!input.trim() || status === "streaming"}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center",
                input.trim()
                  ? "bg-playdamnit-cyan text-playdamnit-dark"
                  : "bg-playdamnit-purple/20 text-gray-400"
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
