"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, LogOut, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSignOut } from "@/hooks/auth";

// Simplified nav links
const navLinks = [{ name: "Home", href: "/", icon: Home }];

type HeaderClientProps = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    username?: string | null;
    displayUsername?: string | null;
  } | null;
};

export default function HeaderClient({ user }: HeaderClientProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const { signOut } = useSignOut();

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsVisible(true);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          className="rounded-lg bg-playdamnit-purple/20 text-white hover:bg-playdamnit-purple/40"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href={`/${user.username || user.id}`}
              className="flex items-center gap-3 bg-playdamnit-purple/20 hover:bg-playdamnit-purple/40 px-3 py-2 rounded-lg text-white"
            >
              {user.image ? (
                <img
                  src={
                    user.image.startsWith("data:") ||
                    user.image.startsWith("http")
                      ? user.image
                      : `data:image/png;base64,${user.image}`
                  }
                  alt={user.username ?? user.name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-playdamnit-purple text-white font-bold">
                  {(user.username || user.name || "U")[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium hidden sm:block">
                {user.username || user.name}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                try {
                  signOut.mutate();
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
              className="rounded-lg bg-playdamnit-purple/20 text-white hover:bg-red-500/40"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Button
            asChild
            className="rounded-lg bg-playdamnit-purple hover:bg-playdamnit-purple/90 text-white"
          >
            <Link href="/auth">
              <User className="h-5 w-5 mr-2" />
              Login
            </Link>
          </Button>
        )}

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-lg bg-playdamnit-purple/20 text-white hover:bg-playdamnit-purple/40"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-playdamnit-darker shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3
                      ${
                        activeLink === link.href
                          ? "text-white bg-playdamnit-purple/30"
                          : "text-white/80 hover:bg-playdamnit-purple/20"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
