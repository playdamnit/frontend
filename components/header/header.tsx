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
      <div className="h-2 w-full bg-gradient-to-r from-playdamnit-purple via-playdamnit-cyan to-playdamnit-purple"></div>

      {/* Main header content */}
      <div className="bg-black shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-10 flex items-center gap-2 group"
            >
              {/* <Logo size={40} /> */}
              <img src="/logo.svg" alt="PlayDamnIt Logo" className="w-32" />
              {/* <span className="text-2xl font-bold text-white">PlayDamnIt</span> */}
            </Link>

            {/* Client-side interactive elements */}
            <HeaderClient user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
