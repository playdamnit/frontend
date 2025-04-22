"use client";

import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignIn, useSignUp } from "@/hooks/auth";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

type AuthMode = "signin" | "signup" | "forgot";

// Replace the slide animation with a simple fade
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Auth hooks
  const { emailSignIn, passkeySignIn } = useSignIn();
  const { emailSignUp } = useSignUp();

  // Reset form when changing modes
  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const identifier = email.trim();
        const result = await emailSignIn.mutateAsync({
          identifier,
          password,
        });

        if (!result.error) {
          router.push(`/${result.data?.user?.username || ""}`);
        } else {
          setError(result.error.message || "Failed to sign in");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await emailSignUp.mutateAsync({
          email,
          password,
          username,
          name: username,
        });

        if (!result.error) {
          router.push(`/${username}`);
        } else {
          setError(result.error.message || "Failed to create account");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
    });
  };

  const handlePasskeySignIn = async () => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await passkeySignIn.mutateAsync();

        if (!result.error) {
          router.push(`/${result.data?.user?.username || ""}`);
        } else {
          setError(result.error.message || "Failed to sign in with passkey");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-playdamnit-light to-playdamnit-purple/10 dark:from-playdamnit-dark dark:to-playdamnit-purple/20">
      <div className="w-[100vw] flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-playdamnit-purple/20 bg-background/90 backdrop-blur-xl shadow-lg">
          <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 md:p-8 lg:p-10">
            <Link
              href="/"
              className="mb-8 transition-transform hover:scale-105"
            >
              <Logo size={120} />
            </Link>

            <AnimatePresence mode="wait">
              {mode === "signin" && (
                <motion.div
                  key="signin"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md mx-auto"
                >
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-playdamnit-purple">
                        Sign in
                      </h1>
                      <div className="mt-2 flex justify-center gap-1 text-sm text-muted-foreground">
                        <span>New user?</span>
                        <button
                          type="button"
                          onClick={() => changeMode("signup")}
                          className="font-medium text-playdamnit-purple hover:text-playdamnit-cyan transition-colors"
                        >
                          Create account
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base">
                          Email or Username
                        </Label>
                        <Input
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="h-12 border-input/50 focus-visible:ring-playdamnit-purple/50 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="text-base">
                            Password
                          </Label>
                          <button
                            type="button"
                            onClick={() => changeMode("forgot")}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <Input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                          required
                          className="h-12 border-input/50 focus-visible:ring-playdamnit-purple/50 text-base"
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <p>{error}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isPending || emailSignIn.isPending}
                        className="w-full h-12 mt-2 bg-playdamnit-purple hover:bg-playdamnit-purple/90 text-white text-base"
                      >
                        {emailSignIn.isPending ? "Signing in..." : "Sign in"}
                      </Button>

                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-playdamnit-purple/20"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-background px-2 text-muted-foreground">
                            OR
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={handlePasskeySignIn}
                        disabled={isPending || passkeySignIn.isPending}
                        variant="outline"
                        className="w-full h-12 border-playdamnit-purple/20 hover:bg-playdamnit-purple/10 text-playdamnit-light flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">🔑</span>
                        {passkeySignIn.isPending
                          ? "Signing in..."
                          : "Sign in with Passkey"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {mode === "signup" && (
                <motion.div
                  key="signup"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md mx-auto"
                >
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-playdamnit-purple">
                        Create account
                      </h1>
                      <div className="mt-2 flex justify-center gap-1 text-sm text-muted-foreground">
                        <span>Already registered?</span>
                        <button
                          type="button"
                          onClick={() => changeMode("signin")}
                          className="font-medium text-playdamnit-purple hover:text-playdamnit-cyan transition-colors"
                        >
                          Sign in
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-base">
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          type="email"
                          required
                          className="h-12 border-input/50 focus-visible:ring-playdamnit-purple/50 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-username" className="text-base">
                          Username
                        </Label>
                        <Input
                          id="signup-username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Choose a username"
                          required
                          pattern="^[a-zA-Z0-9_]{3,15}$"
                          title="Username must be 3-15 characters long and can only contain letters, numbers, and underscores"
                          className="h-12 border-input/50 focus-visible:ring-playdamnit-purple/50 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-base">
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="signup-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          minLength={8}
                          required
                          className="h-12 border-input/50 focus-visible:ring-playdamnit-purple/50 text-base"
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <p>{error}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isPending || emailSignUp.isPending}
                        className="w-full h-12 mt-2 bg-playdamnit-purple hover:bg-playdamnit-purple/90 text-white text-base"
                      >
                        {emailSignUp.isPending
                          ? "Creating account..."
                          : "Create account"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {mode === "forgot" && (
                <motion.div
                  key="forgot"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md mx-auto"
                >
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-playdamnit-purple">
                        Reset password
                      </h1>
                      <div className="mt-2 flex justify-center gap-1 text-sm text-muted-foreground">
                        <span>Remember your password?</span>
                        <button
                          type="button"
                          onClick={() => changeMode("signin")}
                          className="font-medium text-playdamnit-purple hover:text-playdamnit-cyan transition-colors"
                        >
                          Sign in
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="mt-6 text-center text-playdamnit-light/70">
                        <p>Password reset functionality is coming soon.</p>
                        <p className="mt-2">
                          Please contact support for assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
