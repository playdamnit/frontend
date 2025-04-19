"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Settings, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  iconName: string;
  description: string;
}

const SidebarLink = ({ item }: { item: NavigationItem }) => {
  const pathname = usePathname();

  const renderIcon = () => {
    switch (item.iconName) {
      case "Home":
        return <Home className="w-5 h-5" />;
      case "Gamepad2":
        return <Gamepad2 className="w-5 h-5" />;
      case "Settings":
        return <Settings className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const isActive = () => {
    if (item.href === "/") {
      return pathname === "/";
    }

    const itemPathSegments = item.href.split("/").filter(Boolean);
    const currentPathSegments = pathname.split("/").filter(Boolean);

    if (itemPathSegments.length > currentPathSegments.length) {
      return false;
    }

    for (let i = 0; i < itemPathSegments.length; i++) {
      if (itemPathSegments[i] !== currentPathSegments[i]) {
        return false;
      }
    }

    return itemPathSegments.length === currentPathSegments.length;
  };

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
        isActive()
          ? "text-quokka-cyan bg-quokka-purple/10 border-l-2 border-quokka-cyan"
          : "text-quokka-light/60 hover:text-quokka-light hover:bg-quokka-purple/5"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
          isActive()
            ? "bg-quokka-purple/20 text-quokka-cyan"
            : "text-quokka-light/40 group-hover:text-quokka-cyan"
        )}
      >
        {renderIcon()}
      </div>
      <span className="hidden md:block">{item.name}</span>

      {/* Tooltip for mobile view */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-quokka-dark text-quokka-light text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 md:hidden">
        {item.name}
      </div>
    </Link>
  );
};

export default SidebarLink;
