import { redirect } from "next/navigation";
import { Shield, User, Bell, Gamepad2, CreditCard } from "lucide-react";

import { getServerUser } from "@/utils/supabase/server-auth";
import { UserSettingsForm } from "./user-settings-form";

const SettingsPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const username = (await params).username;
  const user = await getServerUser();

  if (!user) {
    redirect("/auth");
  }

  // Check if the user is trying to access someone else's settings
  if (user.user_metadata.username !== username) {
    redirect("/");
  }

  const initialData = {
    fullName: user.user_metadata.full_name,
    username: user.user_metadata.username,
    bio: user.user_metadata.bio,
    avatarUrl: user.user_metadata.avatar_url,
  };

  const settingsTabs = [
    { name: "Profile", iconName: "User", active: true },
    { name: "Account", iconName: "Shield", active: false },
    { name: "Notifications", iconName: "Bell", active: false },
    { name: "Gaming", iconName: "Gamepad2", active: false },
    { name: "Billing", iconName: "CreditCard", active: false },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "User":
        return <User className="w-4 h-4" />;
      case "Shield":
        return <Shield className="w-4 h-4" />;
      case "Bell":
        return <Bell className="w-4 h-4" />;
      case "Gamepad2":
        return <Gamepad2 className="w-4 h-4" />;
      case "CreditCard":
        return <CreditCard className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Settings Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-quokka-light">Settings</h1>
          <p className="text-quokka-light/60 mt-2">
            Manage your account preferences and profile
          </p>
        </div>

        {/* Settings Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {settingsTabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                tab.active
                  ? "bg-quokka-purple text-white"
                  : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light"
              }`}
            >
              {renderIcon(tab.iconName)}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <UserSettingsForm initialData={initialData} />
      </div>
    </div>
  );
};

export default SettingsPage;
