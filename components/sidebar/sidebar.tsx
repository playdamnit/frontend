import { getSession } from "@/lib/authServer";
import SidebarLink from "./sidebar-link";
import {
  UserSection,
  AddGameButton,
  GameAssistantButton,
} from "./sidebar-client";

const Sidebar = async () => {
  const session = await getSession();
  const user = session?.data?.user ?? null;

  const navigation = [
    { name: "Home", href: "/", iconName: "Home", description: "Dashboard" },
    ...(user
      ? [
          {
            name: "My Games",
            href: `/${user.username}`,
            iconName: "Gamepad2",
            description: "Your collection",
          },
          {
            name: "Settings",
            href: `/${user.username}/settings`,
            iconName: "Settings",
            description: "Preferences",
          },
        ]
      : []),
  ];

  return (
    <div className="w-20 md:w-64 border-r border-quokka-purple/10 bg-quokka-darker/50 flex flex-col h-screen sticky top-0">
      <div className="px-3 py-6 flex-1 overflow-y-auto scrollbar-hide">
        <nav className="space-y-1.5">
          {navigation.map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        <AddGameButton />
        <GameAssistantButton />
        <UserSection user={user} />
      </div>
    </div>
  );
};

export default Sidebar;
