import SidebarLinkClient from "./sidebar-link-client";

interface NavigationItem {
  name: string;
  href: string;
  iconName: string;
  description: string;
}

const SidebarLink = ({ item }: { item: NavigationItem }) => {
  return <SidebarLinkClient item={item} />;
};

export default SidebarLink;
