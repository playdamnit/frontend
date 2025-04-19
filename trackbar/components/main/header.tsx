"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, LogOut, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "../ui/logo";
import SearchModal from "../search/search-modal";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

// Simplified nav links
const navLinks = [{ name: "Home", href: "/", icon: Home }];

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    // Set active link based on current path
    if (typeof window !== "undefined") {
      setActiveLink(window.location.pathname);
    }

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > 100) {
          // Reduced threshold for better visibility
          if (window.scrollY > lastScrollY && !isMobileMenuOpen) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        } else {
          setIsVisible(true);
        }

        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY, isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsVisible(true);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Simplified header with more visible accent line */}
        <div className="h-2 w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple"></div>

        {/* Main header content - simplified background */}
        <div className="bg-quokka-darker shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="relative z-10 flex items-center gap-2 group"
              >
                <Logo size={40} />
                <span className="text-2xl font-bold text-white">QUOKKA</span>
              </Link>

              {/* Right side actions - simplified */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="rounded-lg bg-quokka-purple/20 text-white hover:bg-quokka-purple/40"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>

                {loading ? (
                  <div className="h-10 w-10 rounded-lg bg-quokka-purple/20 animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${user.username}`}
                      className="flex items-center gap-3 bg-quokka-purple/20 hover:bg-quokka-purple/40 px-3 py-2 rounded-lg text-white"
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username || user.fullName}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-quokka-purple text-white font-bold">
                          {(user.username ||
                            user.fullName ||
                            "U")[0].toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium hidden sm:block">
                        {user.username || user.fullName}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => signOut()}
                      className="rounded-lg bg-quokka-purple/20 text-white hover:bg-red-500/40"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="rounded-lg bg-quokka-purple hover:bg-quokka-purple/90 text-white"
                  >
                    <Link href="/auth">
                      <User className="h-5 w-5 mr-2" />
                      Login
                    </Link>
                  </Button>
                )}

                {/* Mobile menu button - simplified */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-lg bg-quokka-purple/20 text-white hover:bg-quokka-purple/40"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-quokka-darker shadow-lg"
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
                                                    ? "text-white bg-quokka-purple/30"
                                                    : "text-white/80 hover:bg-quokka-purple/20"
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
      </header>

      {/* Spacer to prevent content from hiding under the fixed header */}
      <div className="h-16"></div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
