"use client";

import {
  signInAction,
  signUpAction,
  forgotPasswordAction,
} from "@/app/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { SmtpMessage } from "../smtp-message";

type AuthMode = "signin" | "signup" | "forgot";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export function AuthForm({ searchParams }: { searchParams: Message }) {
  const [mode, setMode] = useState<AuthMode>("signin");

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-quokka-light to-quokka-purple/10 dark:from-quokka-dark dark:to-quokka-purple/20">
      <div className="w-[100vw] flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            custom={mode === "signin" ? 1 : -1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full max-w-3xl overflow-hidden rounded-xl border border-quokka-purple/20 bg-background/90 backdrop-blur-xl shadow-lg"
          >
            <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 md:p-8 lg:p-10">
              <Link href="/" className="mb-8 transition-transform hover:scale-105">
                <Logo size={120} />
              </Link>
              
              {mode === "signin" && (
                <form className="w-full max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-quokka-purple">Sign in</h1>
                    <div className="mt-2 flex justify-center gap-1 text-sm text-muted-foreground">
                      <span>New user?</span>
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="font-medium text-quokka-purple hover:text-quokka-cyan transition-colors"
                      >
                        Create account
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">Email</Label>
                      <Input 
                        name="email" 
                        id="email"
                        placeholder="you@example.com" 
                        required 
                        className="h-12 border-input/50 focus-visible:ring-quokka-purple/50 text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-base">Password</Label>
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Your password"
                        required
                        className="h-12 border-input/50 focus-visible:ring-quokka-purple/50 text-base"
                      />
                    </div>
                    
                    <SubmitButton
                      pendingText="Signing in..."
                      formAction={signInAction}
                      className="w-full h-12 mt-2 bg-quokka-purple hover:bg-quokka-purple/90 text-white text-base"
                    >
                      Sign in
                    </SubmitButton>
                    
                    <FormMessage message={searchParams} />
                  </div>
                </form>
              )}

              {mode === "signup" && (
                <form className="w-full max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-quokka-purple">Create account</h1>
                    <div className="mt-2 flex justify-center gap-1 text-sm text-muted-foreground">
                      <span>Already registered?</span>
                      <button
                        type="button"
                        onClick={() => setMode("signin")}
                        className="font-medium text-quokka-purple hover:text-quokka-cyan transition-colors"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">Email</Label>
                      <Input 
                        name="email" 
                        id="email"
                        placeholder="you@example.com" 
                        required 
                        className="h-12 border-input/50 focus-visible:ring-quokka-purple/50 text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-base">Username</Label>
                      <Input
                        name="username"
                        id="username"
                        placeholder="Choose a username"
                        required
                        pattern="^[a-zA-Z0-9_]{3,15}$"
                        title="Username must be 3-15 characters long and can only contain letters, numbers, and underscores"
                        className="h-12 border-input/50 focus-visible:ring-quokka-purple/50 text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Create a password"
                        minLength={8}
                        required
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\^&*])[A-Za-z0-9!@#$%\^&*]{8,}$"
                        title="Must contain at least 8 characters, including: uppercase letter, lowercase letter, number, and special character (!@#$%^&*)"
                        className="h-12 border-input/50 focus-visible:ring-quokka-purple/50 text-base"
                      />
                    </div>
                    
                    <SubmitButton
                      formAction={signUpAction}
                      pendingText="Creating account..."
                      className="w-full h-12 mt-2 bg-quokka-purple hover:bg-quokka-purple/90 text-white text-base"
                    >
                      Create account
                    </SubmitButton>
                    
                    <FormMessage message={searchParams} />
                  </div>
                </form>
              )}

              {mode === "forgot" && (
                <form className="w-full max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-quokka-purple">Reset password</h1>
                    <div className="mt-2 flex justify-center gap-1 text-sm text-muted-foreground">
                      <span>Remember your password?</span>
                      <button
                        type="button"
                        onClick={() => setMode("signin")}
                        className="font-medium text-quokka-purple hover:text-quokka-cyan transition-colors"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">Email</Label>
                      <Input 
                        name="email" 
                        id="email"
                        placeholder="you@example.com" 
                        required 
                        className="h-12 border-input/50 focus-visible:ring-quokka-purple/50 text-base"
                      />
                    </div>
                    
                    <SubmitButton 
                      formAction={forgotPasswordAction}
                      pendingText="Sending reset link..."
                      className="w-full h-12 mt-2 bg-quokka-purple hover:bg-quokka-purple/90 text-white text-base"
                    >
                      Send reset link
                    </SubmitButton>
                    
                    <FormMessage message={searchParams} />
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        <SmtpMessage />
      </div>
    </div>
  );
}
