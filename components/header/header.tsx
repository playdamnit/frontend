import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import HeaderClient from "./header-client";
import { getSession } from "@/lib/authServer";

export default async function Header() {
  const session = await getSession();
  const user = session?.data?.user ?? null;

  return (
    <header className="w-full">
      {/* Accent line */}
      <div className="h-2 w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple"></div>

      {/* Main header content */}
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

            {/* Client-side interactive elements */}
            <HeaderClient user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
