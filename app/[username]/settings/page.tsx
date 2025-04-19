"use client";
import { useState } from "react";
import {
  Shield,
  User,
  Bell,
  Gamepad2,
  CreditCard,
  Key,
  Mail,
  Trash2,
} from "lucide-react";
import { UserSettingsForm } from "./user-settings-form";
import { useUserSettings } from "@/hooks/user";
import { AccountSettings, EmailSettings, PasskeySettings } from "./components";

export default function SettingsPage() {
  const { data: user, isLoading, error } = useUserSettings();
  const [activeTab, setActiveTab] = useState("Profile");

  const settingsTabs = [
    { name: "Profile", iconName: "User", active: activeTab === "Profile" },
    { name: "Email", iconName: "Mail", active: activeTab === "Email" },
    // { name: "Security", iconName: "Shield", active: activeTab === "Security" },
    { name: "Passkeys", iconName: "Key", active: activeTab === "Passkeys" },
    // {
    //   name: "Notifications",
    //   iconName: "Bell",
    //   active: activeTab === "Notifications",
    // },
    // { name: "Gaming", iconName: "Gamepad2", active: activeTab === "Gaming" },
    // {
    //   name: "Billing",
    //   iconName: "CreditCard",
    //   active: activeTab === "Billing",
    // },
    {
      name: "Account",
      iconName: "Trash2",
      active: activeTab === "Account",
    },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "User":
        return <User className="w-4 h-4" />;
      case "Mail":
        return <Mail className="w-4 h-4" />;
      case "Shield":
        return <Shield className="w-4 h-4" />;
      case "Bell":
        return <Bell className="w-4 h-4" />;
      case "Gamepad2":
        return <Gamepad2 className="w-4 h-4" />;
      case "CreditCard":
        return <CreditCard className="w-4 h-4" />;
      case "Key":
        return <Key className="w-4 h-4" />;
      case "Trash2":
        return <Trash2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-quokka-light/60">
        Loading settings...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load settings.
      </div>
    );
  }

  const initialData = {
    fullName: user.name || "",
    username: user.username || "",
    avatarUrl: user.image || "",
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-quokka-light">Settings</h1>
          <p className="text-quokka-light/60 mt-2">
            Manage your account preferences and profile
          </p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {settingsTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
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

        {activeTab === "Profile" && (
          <UserSettingsForm initialData={initialData} />
        )}
        {activeTab === "Email" && <EmailSettings user={user} />}
        {activeTab === "Passkeys" && <PasskeySettings user={user} />}
        {activeTab === "Account" && <AccountSettings user={user} />}
        {activeTab !== "Profile" &&
          activeTab !== "Passkeys" &&
          activeTab !== "Email" &&
          activeTab !== "Account" && (
            <div className="bg-quokka-dark/30 border border-quokka-purple/10 rounded-xl p-6 md:p-8 text-center">
              <h2 className="text-xl font-semibold text-quokka-light/70 mb-2">
                Coming Soon
              </h2>
              <p className="text-quokka-light/50">
                This feature is currently under development.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
