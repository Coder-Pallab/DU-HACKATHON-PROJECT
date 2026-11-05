import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import "../../styles/authenticated.css";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="authenticated-app min-h-dvh min-w-0 bg-slate-50">

      <Navbar onMenuClick={openSidebar} />

      <div className="flex min-h-[calc(100dvh-72px)] min-w-0">

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        <main className="app-content min-w-0 flex-1 px-3 py-5 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-5 sm:py-7 md:px-7 lg:px-9 lg:pb-8">
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
