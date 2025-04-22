"use client";
import { useState } from "react";
import { Trash2, AlertTriangle, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSignOut } from "@/hooks/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AccountSettings({ user }: { user: any }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signOut } = useSignOut();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // In a real implementation, we would use Better Auth's deleteUser function
      // This is a placeholder to show the UI flow
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate calling authClient.deleteUser({password})
      // const result = await authClient.deleteUser({
      //   password,
      // });

      await signOut.mutateAsync();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    router.push("/");
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
          Account Management
        </h2>
        <p className="text-playdamnit-light/60">
          Manage your account settings and delete your account
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-playdamnit-dark/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-playdamnit-light mb-4">
            Sign Out
          </h3>
          <p className="text-playdamnit-light/60 mb-4">
            Sign out from your current session on this device
          </p>

          <Button
            onClick={handleSignOut}
            className="bg-playdamnit-dark border border-playdamnit-purple/20 text-playdamnit-light hover:bg-playdamnit-dark/80"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="bg-playdamnit-dark/50 p-6 rounded-lg border-red-500/10">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Danger Zone
          </h3>
          <p className="text-playdamnit-light/60 mb-6">
            Once you delete your account, there is no going back. This action
            permanently deletes your account, profile, and all associated data.
          </p>

          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="destructive"
            className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-playdamnit-darker border-playdamnit-purple/20 text-playdamnit-light">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-500/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl text-playdamnit-light">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-playdamnit-light/70">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-playdamnit-light/90"
              >
                Enter your password to confirm
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your current password"
                className="bg-playdamnit-dark/50 border-playdamnit-purple/20 focus-visible:ring-playdamnit-purple/30"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-playdamnit-dark/50 border-playdamnit-purple/20 text-playdamnit-light hover:bg-playdamnit-dark hover:text-playdamnit-light/90">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting || !password}
              className="bg-red-500/80 hover:bg-red-500 text-white border-none"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
