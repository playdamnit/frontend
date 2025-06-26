"use client";

import { useState, useRef } from "react";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getGetApiUserByUsernameGamesQueryKey,
  postApiUserByUsernameGamesImport,
} from "@playdamnit/api-client";

interface ImportButtonProps {
  username: string;
}

interface ImportProgress {
  stage: "importing" | "completed" | "error";
  message: string;
  details?: {
    imported?: number;
    skipped?: number;
    errors?: number;
    errorGames?: Array<{
      gameId: number;
      error: string;
    }>;
  };
}

export function ImportButton({ username }: ImportButtonProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showFailedGames, setShowFailedGames] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    stage: "importing",
    message: "Preparing import...",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async ({
      file,
      overwriteExisting,
    }: {
      file: File;
      overwriteExisting: boolean;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("overwriteExisting", overwriteExisting.toString());

      return postApiUserByUsernameGamesImport(username, formData as any);
    },
    onSuccess: (result) => {
      setImportProgress({
        stage: "completed",
        message: "Import completed successfully!",
        details: {
          imported: result.data.imported,
          skipped: result.data.skipped,
          errors: result.data.errors,
          errorGames: result.data.details.errorGames || [],
        },
      });

      // Show success toast and refresh data immediately
      toast.success(
        `Import completed: ${result.data.imported} imported, ${result.data.skipped} skipped, ${result.data.errors} errors`
      );
      queryClient.invalidateQueries({
        queryKey: getGetApiUserByUsernameGamesQueryKey(username),
      });
    },
    onError: (error) => {
      setImportProgress({
        stage: "error",
        message: "Import failed",
      });
    },
  });

  const handleImport = async (
    file: File,
    overwriteExisting: boolean = false
  ) => {
    setIsImporting(true);
    setShowProgressDialog(true);

    // Set initial importing state
    setImportProgress({
      stage: "importing",
      message: "Importing games to your library...",
    });

    try {
      await importMutation.mutateAsync({
        file,
        overwriteExisting,
      });
    } catch (error) {
      console.error("Import error:", error);
      setImportProgress({
        stage: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to import games. Please try again.",
      });

      // Show error toast immediately
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to import games. Please try again."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isValidType =
      file.type === "application/json" ||
      file.type === "text/csv" ||
      file.name.endsWith(".json") ||
      file.name.endsWith(".csv");

    if (!isValidType) {
      toast.error("Please select a JSON or CSV file");
      return;
    }

    // Ask about overwriting existing games
    const overwrite = window.confirm(
      "Do you want to overwrite existing games in your library? Click OK to overwrite, Cancel to skip existing games."
    );

    handleImport(file, overwrite);
  };

  const getProgressIcon = () => {
    switch (importProgress.stage) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return (
          <Loader2 className="w-6 h-6 text-playdamnit-cyan animate-spin" />
        );
    }
  };

  return (
    <>
      {/* Import Button */}
      <Button
        variant="outline"
        size="sm"
        className="border-playdamnit-cyan/30 text-playdamnit-light hover:bg-playdamnit-cyan/10"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isImporting ? "Importing..." : "Import"}
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv,application/json,text/csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="bg-playdamnit-dark border-playdamnit-purple/30 text-playdamnit-light max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {getProgressIcon()}
              Importing Games
            </DialogTitle>
            <DialogDescription className="text-playdamnit-light/60">
              {importProgress.stage === "completed"
                ? "Your games have been successfully imported!"
                : importProgress.stage === "error"
                  ? "There was an error importing your games."
                  : "Please wait while we import your games..."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Simple Loading Message */}
            {importProgress.stage === "importing" && (
              <div className="text-center py-4">
                <div className="text-playdamnit-light/80 mb-2">
                  {importProgress.message}
                </div>
                <div className="text-xs text-playdamnit-light/60">
                  Please wait while we process your file...
                </div>
              </div>
            )}

            {/* Results Summary */}
            {importProgress.details && importProgress.stage === "completed" && (
              <div className="space-y-4">
                {/* Success Header */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-playdamnit-light">
                    Import Completed Successfully!
                  </h3>
                  <p className="text-sm text-playdamnit-light/60">
                    Your games have been added to your library
                  </p>
                </div>

                {/* Detailed Results */}
                <div className="bg-playdamnit-purple/10 rounded-lg p-4 space-y-4">
                  <div className="text-sm font-medium text-playdamnit-light mb-3">
                    Import Summary
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-green-400">
                        {importProgress.details.imported || 0}
                      </div>
                      <div className="text-xs text-playdamnit-light/60">
                        Games Imported
                      </div>
                      <div className="w-full h-1 bg-green-500/20 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${((importProgress.details.imported || 0) / Math.max(1, (importProgress.details.imported || 0) + (importProgress.details.skipped || 0) + (importProgress.details.errors || 0))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-yellow-400">
                        {importProgress.details.skipped || 0}
                      </div>
                      <div className="text-xs text-playdamnit-light/60">
                        Games Skipped
                      </div>
                      <div className="w-full h-1 bg-yellow-500/20 rounded-full">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${((importProgress.details.skipped || 0) / Math.max(1, (importProgress.details.imported || 0) + (importProgress.details.skipped || 0) + (importProgress.details.errors || 0))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-red-400">
                        {importProgress.details.errors || 0}
                      </div>
                      <div className="text-xs text-playdamnit-light/60">
                        Errors
                      </div>
                      <div className="w-full h-1 bg-red-500/20 rounded-full">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${((importProgress.details.errors || 0) / Math.max(1, (importProgress.details.imported || 0) + (importProgress.details.skipped || 0) + (importProgress.details.errors || 0))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Processed */}
                  <div className="border-t border-playdamnit-light/10 pt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-playdamnit-light/60">
                        Total Processed:
                      </span>
                      <span className="font-medium text-playdamnit-light">
                        {(importProgress.details.imported || 0) +
                          (importProgress.details.skipped || 0) +
                          (importProgress.details.errors || 0)}{" "}
                        games
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-playdamnit-light/60">
                        Success Rate:
                      </span>
                      <span className="font-medium text-green-400">
                        {Math.round(
                          ((importProgress.details.imported || 0) /
                            Math.max(
                              1,
                              (importProgress.details.imported || 0) +
                                (importProgress.details.skipped || 0) +
                                (importProgress.details.errors || 0)
                            )) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(importProgress.details.skipped || 0) > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-yellow-200">
                          <div className="font-medium mb-1">
                            Games were skipped
                          </div>
                          <div className="text-yellow-200/80">
                            These games already exist in your library and were
                            not overwritten.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(importProgress.details.errors || 0) > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-red-200 flex-1">
                          <div className="font-medium mb-1">
                            Some games had errors
                          </div>
                          <div className="text-red-200/80">
                            These games could not be imported due to data issues
                            or validation errors.
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Failed Games List */}
                      {importProgress.details.errorGames &&
                        importProgress.details.errorGames.length > 0 && (
                          <div className="border-t border-red-500/20 pt-3">
                            <button
                              onClick={() =>
                                setShowFailedGames(!showFailedGames)
                              }
                              className="flex items-center gap-2 text-xs text-red-200 hover:text-red-100 transition-colors w-full text-left"
                            >
                              {showFailedGames ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                              <span className="font-medium">
                                View failed games (
                                {importProgress.details.errorGames.length})
                              </span>
                            </button>

                            {showFailedGames && (
                              <div className="mt-3 space-y-3 max-h-40 overflow-y-auto">
                                {importProgress.details.errorGames.map(
                                  (errorGame, index) => (
                                    <div
                                      key={index}
                                      className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-xs"
                                    >
                                      <div className="flex items-start gap-2">
                                        <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <div
                                            className="font-semibold text-red-100 mb-1 truncate"
                                            title={`Game ID: ${errorGame.gameId}`}
                                          >
                                            Game ID: {errorGame.gameId}
                                          </div>
                                          <div className="text-red-200/80 text-[11px] leading-relaxed">
                                            {errorGame.error}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Simple Results for In-Progress */}
            {importProgress.details && importProgress.stage !== "completed" && (
              <div className="bg-playdamnit-purple/10 rounded-lg p-3 space-y-1">
                <div className="text-sm font-medium text-playdamnit-light">
                  Import Summary
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {importProgress.details.imported !== undefined && (
                    <div className="text-center">
                      <div className="text-green-400 font-medium">
                        {importProgress.details.imported}
                      </div>
                      <div className="text-playdamnit-light/60">Imported</div>
                    </div>
                  )}
                  {importProgress.details.skipped !== undefined && (
                    <div className="text-center">
                      <div className="text-yellow-400 font-medium">
                        {importProgress.details.skipped}
                      </div>
                      <div className="text-playdamnit-light/60">Skipped</div>
                    </div>
                  )}
                  {importProgress.details.errors !== undefined && (
                    <div className="text-center">
                      <div className="text-red-400 font-medium">
                        {importProgress.details.errors}
                      </div>
                      <div className="text-playdamnit-light/60">Errors</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Close button - always available */}
            <div className="mt-4">
              {importProgress.stage === "completed" ||
              importProgress.stage === "error" ? (
                <Button
                  onClick={() => setShowProgressDialog(false)}
                  className="w-full"
                  variant={
                    importProgress.stage === "completed"
                      ? "default"
                      : "destructive"
                  }
                >
                  {importProgress.stage === "completed" ? "Done" : "Close"}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowProgressDialog(false)}
                  className="w-full"
                  variant="outline"
                >
                  Cancel Import
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
