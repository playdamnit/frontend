"use client";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export function EmailSettings({ user }: { user: any }) {
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-quokka-dark/30 border border-quokka-purple/10 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-quokka-purple/5 hover:border-quokka-purple/30 transition-all"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-quokka-light mb-2 flex items-center">
          <span className="inline-block w-1 h-6 bg-gradient-to-b from-quokka-purple to-quokka-cyan rounded-full mr-3"></span>
          Email Management
        </h2>
        <p className="text-quokka-light/60">
          Update your email address and email preferences
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-quokka-dark/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-quokka-light mb-4">
            Current Email
          </h3>

          <div className="mb-6">
            <div className="flex items-center gap-2 bg-quokka-darker/50 py-3 px-4 rounded-lg border border-quokka-purple/10">
              <Mail className="w-5 h-5 text-quokka-purple/70" />
              <span className="text-quokka-light">{user.email}</span>
            </div>
          </div>

          {!isChangingEmail ? (
            <Button
              onClick={() => setIsChangingEmail(true)}
              className="bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 text-white"
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
                  className="bg-quokka-darker/70 border-quokka-purple/20 focus-visible:ring-quokka-purple/30"
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
                  className="bg-quokka-darker/70 border-quokka-purple/20 focus-visible:ring-quokka-purple/30"
                />
                <p className="text-xs text-quokka-light/50">
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
                  className="bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 text-white"
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
                  className="bg-transparent border-quokka-purple/20 text-quokka-light/80 hover:bg-quokka-dark/50"
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

        <div className="bg-quokka-dark/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-quokka-light mb-2">
            Email Verification
          </h3>
          <p className="text-quokka-light/60 mb-4">
            {user.emailVerified
              ? "Your email has been verified."
              : "Your email is not verified. Verify your email to access all features."}
          </p>

          {!user.emailVerified && (
            <Button className="bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 text-white">
              Send Verification Email
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
