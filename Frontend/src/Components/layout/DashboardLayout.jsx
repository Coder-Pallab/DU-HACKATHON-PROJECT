import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-dvh min-w-0 bg-slate-50">

      <Navbar onMenuClick={openSidebar} />

      <div className="flex">

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        <main className="min-w-0 flex-1 px-3 py-5 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-4 sm:py-6 md:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-[var(--content-max-width)]">
            <Outlet />
            <Footer />
          </div>

        </main>

      </div>

      <MobileNavigation />

    </div>
  );
}

export default DashboardLayout;
