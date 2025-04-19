import Link from "next/link";
import { Mail, Globe } from "lucide-react";
import Image from "next/image";

// Modern social links with SVG icons
const socialLinks = [
  {
    name: "Discord",
    href: "https://discord.gg/quokka",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.286a18.73 18.73 0 0 0-5.487 0 12.57 12.57 0 0 0-.617-1.287.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://twitter.com/quokka",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/quokka",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-quokka-darker py-8 border-t border-quokka-purple/20">
      {/* Simple accent line at top */}
      <div className="h-1 w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple absolute top-0 left-0"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Brand */}
          <div className="mb-6 md:mb-0">
            <Link
              href="/"
              className="text-3xl font-bold text-white flex items-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 mr-2 text-quokka-purple"
              >
                <path
                  fill="currentColor"
                  d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19h0c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75h0c1.56 0 2.75-1.37 2.53-2.91zm-2.1.72c-.08.49-.49.84-.99.84-.14 0-.26-.05-.39-.15L15.55 14H8.45L5.9 17.5c-.12.1-.25.15-.39.15-.5 0-.91-.35-.99-.84l-1.09-7.66C3.31 8.1 4.26 7 5.31 7h13.38c1.05 0 2 1.1 1.88 2.15l-1.09 7.66z"
                />
              </svg>
              QUOKKA
            </Link>
            <p className="text-quokka-light/70 mt-2 max-w-md">
              Your ultimate gaming companion. Discover, collect, and share your
              gaming experiences.
            </p>
          </div>

          {/* Social Links - Modern Style */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-quokka-cyan font-bold text-lg mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-quokka-purple/20 flex items-center justify-center hover:bg-quokka-purple transition-all duration-300 group"
                  aria-label={link.name}
                >
                  <span className="text-white group-hover:text-white">
                    <link.icon />
                  </span>
                </Link>
              ))}
            </div>

            {/* Newsletter - Simplified */}
            <div className="mt-6 w-full max-w-xs">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-quokka-dark border-none rounded-l-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-quokka-purple w-full"
                />
                <button className="bg-quokka-purple hover:bg-quokka-purple/90 text-white rounded-r-lg px-4 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Simplified */}
        <div className="pt-6 border-t border-quokka-dark/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-quokka-light/50 mb-4 md:mb-0">
            © {new Date().getFullYear()} Quokka Gaming. All rights reserved.
          </p>
          <div className="flex items-center text-quokka-light/50 text-sm">
            <Globe className="w-4 h-4 mr-2" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
