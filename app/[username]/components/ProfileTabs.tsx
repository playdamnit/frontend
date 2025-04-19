interface TabItem {
  name: string;
  count: number;
  icon: string;
  color: string;
}

interface ProfileTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export function ProfileTabs({
  tabs,
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabChange(tab.name)}
          className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === tab.name
              ? "bg-quokka-purple text-white"
              : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light"
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.name}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === tab.name ? "bg-white/20" : "bg-quokka-dark/50"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
