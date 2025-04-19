"use client";
import { useState } from "react";
import { Key, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePasskeys, useAddPasskey, useDeletePasskey } from "@/hooks/auth";
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

export function PasskeySettings({ user }: { user: any }) {
  const { passkeys, isLoadingPasskeys } = usePasskeys(user);
  const addPasskeyMutation = useAddPasskey();
  const { deletePasskeyMutation, deletingId } = useDeletePasskey();
  const [passkeyToDelete, setPasskeyToDelete] = useState<string | null>(null);

  const handlePasskeyLogin = () => {
    addPasskeyMutation.mutate();
  };

  const handleDeletePasskey = (id: string) => {
    deletePasskeyMutation.mutate(id);
    setPasskeyToDelete(null);
  };

  // Find passkey name by id
  const getPasskeyName = (id: string) => {
    const passkey = passkeys?.find((p) => p.id === id);
    return passkey?.name || `Passkey ${id.substring(0, 8)}`;
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
          Passkey Management
        </h2>
        <p className="text-quokka-light/60">
          Manage your passkeys for secure, passwordless login
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-quokka-dark/50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold text-quokka-light">
              Your Passkeys
            </h3>
            <Button
              onClick={handlePasskeyLogin}
              disabled={addPasskeyMutation.isPending}
              className="bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 text-white"
            >
              {addPasskeyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Register New Passkey
                </>
              )}
            </Button>
          </div>

          {isLoadingPasskeys ? (
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-quokka-purple" />
              <p className="text-quokka-light/60">Loading passkeys...</p>
            </div>
          ) : passkeys && passkeys.length > 0 ? (
            <div className="space-y-3">
              {passkeys.map((passkey) => (
                <div
                  key={passkey.id}
                  className="bg-quokka-darker/50 border border-quokka-purple/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div>
                    <span className="text-quokka-light font-medium truncate block">
                      {passkey.name || `Passkey ${passkey.id.substring(0, 8)}`}
                    </span>
                    <p className="text-xs text-quokka-light/50 mt-1">
                      Created:{" "}
                      {new Date(passkey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => setPasskeyToDelete(passkey.id)}
                    disabled={deletingId === passkey.id}
                    variant="destructive"
                    className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white"
                  >
                    {deletingId === passkey.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-quokka-darker/30 rounded-lg">
              <Key className="w-10 h-10 mx-auto mb-3 text-quokka-light/30" />
              <p className="text-quokka-light/60 mb-2">
                You don&apos;t have any passkeys yet
              </p>
              <p className="text-sm text-quokka-light/40 max-w-md mx-auto">
                Passkeys provide a secure, passwordless way to sign in to your
                account using your device&apos;s authentication.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-quokka-dark/40 p-4 rounded-lg">
            <h4 className="font-semibold text-quokka-light mb-2">
              What are passkeys?
            </h4>
            <p className="text-sm text-quokka-light/60">
              Passkeys are a safer alternative to passwords. They use biometrics
              or device PIN for verification.
            </p>
          </div>
          <div className="bg-quokka-dark/40 p-4 rounded-lg">
            <h4 className="font-semibold text-quokka-light mb-2">
              Why use passkeys?
            </h4>
            <p className="text-sm text-quokka-light/60">
              Passkeys can&apos;t be phished or stolen in data breaches, and
              work across your devices with the same security.
            </p>
          </div>
          <div className="bg-quokka-dark/40 p-4 rounded-lg">
            <h4 className="font-semibold text-quokka-light mb-2">How to use</h4>
            <p className="text-sm text-quokka-light/60">
              Click &quot;Register New Passkey&quot; and follow the prompts on
              your device to set up passwordless login.
            </p>
          </div>
        </div>
      </div>

      {/* Add the Alert Dialog */}
      <AlertDialog
        open={!!passkeyToDelete}
        onOpenChange={(open) => !open && setPasskeyToDelete(null)}
      >
        <AlertDialogContent className="bg-quokka-darker border-quokka-purple/20 text-quokka-light">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-500/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl text-quokka-light">
              Delete Passkey
            </AlertDialogTitle>
            <AlertDialogDescription className="text-quokka-light/70">
              Are you sure you want to delete this passkey? This action cannot
              be undone and you will need to register a new passkey if you want
              to use passwordless login again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-quokka-dark/50 border-quokka-purple/20 text-quokka-light hover:bg-quokka-dark hover:text-quokka-light/90">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                passkeyToDelete && handleDeletePasskey(passkeyToDelete)
              }
              className="bg-red-500/80 hover:bg-red-500 text-white border-none"
            >
              Delete Passkey
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
