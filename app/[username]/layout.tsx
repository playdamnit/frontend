import React from "react";

import Sidebar from "@/components/sidebar/sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-playdamnit-darker text-playdamnit-light">
      <div className="flex">
        <div className="fixed h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 ml-20 md:ml-64">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
