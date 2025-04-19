import { Home, Gamepad2, Settings, Plus, LogOut, Bot } from "lucide-react";

import { Button } from "./ui/button";
import SidebarLink from "./SidebarLink";

import { getServerUser } from "@/utils/supabase/server-auth";
import { signOutAction } from "@/app/actions";
import AIChatButton from "./AIChatButton";

const Sidebar = async () => {
  const user = await getServerUser();

  const navigation = [
    { name: "Home", href: "/", iconName: "Home", description: "Dashboard" },
    ...(user
      ? [
          {
            name: "My Games",
            href: `/${user.user_metadata.username}`,
            iconName: "Gamepad2",
            description: "Your collection",
          },
          {
            name: "Settings",
            href: `/${user.user_metadata.username}/settings`,
            iconName: "Settings",
            description: "Preferences",
          },
        ]
      : []),
  ];

  return (
    <div className="w-20 md:w-64 border-r border-quokka-purple/10 bg-quokka-darker/50 flex flex-col h-screen sticky top-0 pt-20">
      {/* Main Navigation */}
      <div className="px-3 py-6 flex-1 overflow-y-auto scrollbar-hide">
        <nav className="space-y-1.5">
          {navigation.map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
        </nav>
      </div>

      {/* Add Game Button */}
      <div className="p-3 border-t border-quokka-darker">
        <Button className="w-full bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 transition-opacity text-white rounded-lg flex items-center justify-center gap-2 py-2.5">
          <Plus className="w-5 h-5" />
          <span className="hidden md:block">Add Game</span>
        </Button>
      </div>

      {/* AI Assistant Button */}
      <div className="p-3">
        <AIChatButton>
          <Button className="w-full bg-quokka-dark hover:bg-quokka-dark/80 text-quokka-cyan border border-quokka-cyan/30 transition-colors rounded-lg flex items-center justify-center gap-2 py-2.5">
            <Bot className="w-5 h-5" />
            <span className="hidden md:block">Game Assistant</span>
          </Button>
        </AIChatButton>
      </div>

      {/* User Section */}
      {user && (
        <div className="p-3 border-t border-quokka-darker">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-quokka-dark/30 hover:bg-quokka-dark/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-quokka-purple/20 flex items-center justify-center text-quokka-cyan font-bold">
              {user.user_metadata.username?.[0].toUpperCase() || "U"}
            </div>
            <div className="hidden md:block overflow-hidden">
              <div className="text-sm font-medium text-quokka-light truncate">
                {user.user_metadata.username ||
                  user.user_metadata.full_name ||
                  user.email}
              </div>
              <div className="text-xs text-quokka-light/40 truncate">
                {user.email}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <form action={signOutAction} className="mt-2">
            <Button
              type="submit"
              variant="ghost"
              className="w-full text-quokka-light/60 hover:text-quokka-light hover:bg-quokka-purple/10 flex items-center gap-2 py-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">Sign out</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
