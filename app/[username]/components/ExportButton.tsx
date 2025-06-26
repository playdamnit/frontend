"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { getApiUserByUsernameGamesExport } from "@playdamnit/api-client";

interface ExportButtonProps {
  username: string;
}

export function ExportButton({ username }: ExportButtonProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async ({ format }: { format: "json" | "csv" }) => {
      return getApiUserByUsernameGamesExport(username, {
        format,
        download: true,
      });
    },
  });

  const handleExport = async (format: "json" | "csv") => {
    try {
      const response = await exportMutation.mutateAsync({ format });
      const data = response.data;

      // Create blob from the response data
      const blob =
        data instanceof Blob
          ? data
          : new Blob([typeof data === "string" ? data : JSON.stringify(data)], {
              type: response.headers["content-type"],
            });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `games-export-${username}-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Games exported successfully as ${format.toUpperCase()}`);
      setIsExportOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export games. Please try again.");
    }
  };

  return (
    <Popover open={isExportOpen} onOpenChange={setIsExportOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-playdamnit-purple/30 text-playdamnit-light hover:bg-playdamnit-purple/10"
          disabled={exportMutation.isPending}
        >
          <Download className="w-4 h-4 mr-2" />
          {exportMutation.isPending ? "Exporting..." : "Export"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-playdamnit-dark border-playdamnit-purple/30">
        <div className="space-y-2">
          <p className="text-sm text-playdamnit-light/60 mb-3">
            Choose export format:
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-playdamnit-light hover:bg-playdamnit-purple/10"
            onClick={() => handleExport("json")}
            disabled={exportMutation.isPending}
          >
            <FileText className="w-4 h-4 mr-2" />
            JSON Format
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-playdamnit-light hover:bg-playdamnit-purple/10"
            onClick={() => handleExport("csv")}
            disabled={exportMutation.isPending}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV Format
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
