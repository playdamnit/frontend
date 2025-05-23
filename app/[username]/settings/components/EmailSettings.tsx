"use client";
import { useState } from "react";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

export function EmailSettings({ user }: { user: any }) {
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create a mutation for sending verification email
  const sendVerificationEmail = useMutation({
    mutationFn: async () => {
      // Since we don't know the exact Better-Auth API,
      // we'll use a placeholder for demonstration
      await new Promise((resolve) => setTimeout(resolve, 800));
      // In a real app, this would call the appropriate auth service method:
      // return authClient.sendVerificationEmail();
      return { success: true };
    },
    onError: (err: any) => {
      console.error("Failed to send verification email:", err);
    },
  });

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real implementation, we would use Better Auth's changeEmail function
      // This is a placeholder to show the UI flow
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate calling authClient.changeEmail({newEmail, currentPassword})
      // const result = await authClient.changeEmail({
      //   newEmail,
      //   currentPassword,
      // });

      setSuccess(
        "Verification email has been sent to your new email address. Please check your inbox to complete the email change."
      );
      setIsChangingEmail(false);
      setNewEmail("");
      setCurrentPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to change email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendVerificationEmail = () => {
    sendVerificationEmail.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-playdamnit-dark/30 border border-playdamnit-purple/10 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-playdamnit-purple/5 hover:border-playdamnit-purple/30 transition-all"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-playdamnit-light mb-2 flex items-center">
          <span className="inline-block w-1 h-6 bg-gradient-to-b from-playdamnit-purple to-playdamnit-cyan rounded-full mr-3"></span>
          Email Management
        </h2>
        <p className="text-playdamnit-light/60">
          Update your email address and email preferences
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-playdamnit-dark/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-playdamnit-light mb-4">
            Current Email
          </h3>

          <div className="mb-2">
            <div className="flex items-center gap-2 bg-playdamnit-darker/50 py-3 px-4 rounded-lg border border-playdamnit-purple/10">
              <Mail className="w-5 h-5 text-playdamnit-purple/70" />
              <span className="text-playdamnit-light">{user.email}</span>
              {user.emailVerified ? (
                <div className="ml-2 flex items-center text-green-500 text-xs bg-green-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </div>
              ) : (
                <div className="ml-2 flex items-center text-amber-500 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unverified
                </div>
              )}
            </div>
          </div>

          {!user.emailVerified && (
            <div className="mb-6">
              <p className="text-playdamnit-light/60 text-sm mb-2">
                Please verify your email to access all features
              </p>

              <Button
                onClick={handleSendVerificationEmail}
                disabled={sendVerificationEmail.isPending}
                size="sm"
                variant="outline"
                className="bg-transparent border-amber-500/30 text-amber-400 hover:bg-amber-500/10 mr-4"
              >
                {sendVerificationEmail.isPending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Email"
                )}
              </Button>

              {sendVerificationEmail.isSuccess && (
                <div className="mt-3 bg-green-500/10 text-green-400 p-2 rounded-md text-sm">
                  Verification email sent! Please check your inbox and follow
                  the instructions.
                </div>
              )}

              {sendVerificationEmail.isError && (
                <div className="mt-3 bg-red-500/10 text-red-400 p-2 rounded-md text-sm">
                  Failed to send verification email. Please try again later.
                </div>
              )}
            </div>
          )}

          {!isChangingEmail ? (
            <Button
              onClick={() => setIsChangingEmail(true)}
              className="bg-gradient-to-r from-playdamnit-purple to-playdamnit-cyan hover:opacity-90 text-white"
            >
              Change Email
            </Button>
          ) : (
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="your-new-email@example.com"
                  required
                  className="bg-playdamnit-darker/70 border-playdamnit-purple/20 focus-visible:ring-playdamnit-purple/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="bg-playdamnit-darker/70 border-playdamnit-purple/20 focus-visible:ring-playdamnit-purple/30"
                />
                <p className="text-xs text-playdamnit-light/50">
                  For security reasons, we need to verify your identity
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-playdamnit-purple to-playdamnit-cyan hover:opacity-90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Update Email"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsChangingEmail(false);
                    setNewEmail("");
                    setCurrentPassword("");
                    setError(null);
                  }}
                  variant="outline"
                  className="bg-transparent border-playdamnit-purple/20 text-playdamnit-light/80 hover:bg-playdamnit-dark/50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {success && !isChangingEmail && (
            <div className="mt-4 bg-green-500/10 text-green-400 p-3 rounded-md text-sm">
              {success}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
