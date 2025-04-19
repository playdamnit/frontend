"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ChevronDown,
  BarChart3,
  LayoutGrid,
  List,
  X,
} from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: "grid" | "row";
  onViewModeChange: (mode: "grid" | "row") => void;
}

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: SearchAndFilterProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div
        className={`relative flex-1 transition-all duration-300 ${
          isSearchFocused ? "ring-1 ring-quokka-purple" : ""
        }`}
      >
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quokka-light/40"
          size={18}
        />
        <Input
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="pl-10 bg-quokka-dark/30 border-quokka-purple/10 rounded-lg focus:border-quokka-purple/30 text-quokka-light"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-quokka-light/40 hover:text-quokka-light"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-quokka-dark/30 border border-quokka-purple/10 rounded-lg text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light transition-colors flex items-center gap-2">
          <Filter size={16} />
          <span>Filter</span>
          <ChevronDown size={16} />
        </button>
        <button className="px-4 py-2 bg-quokka-dark/30 border border-quokka-purple/10 rounded-lg text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light transition-colors flex items-center gap-2">
          <BarChart3 size={16} />
          <span>Sort</span>
          <ChevronDown size={16} />
        </button>
        {/* View Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-quokka-purple/10">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 flex items-center justify-center transition-colors ${
              viewMode === "grid"
                ? "bg-quokka-purple text-white"
                : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange("row")}
            className={`p-2 flex items-center justify-center transition-colors ${
              viewMode === "row"
                ? "bg-quokka-purple text-white"
                : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50"
            }`}
            aria-label="Row view"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
