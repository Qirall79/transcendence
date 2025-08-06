import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../dashboard/Navbar";
import { Sidebar } from "../dashboard/Sidebar";
import { InboxBar } from "../social/InboxBar";

function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const isChatPage = location.pathname.includes('/dashboard/chat');
  
  function toggleSidebar() {
    setSidebarOpen(!isSidebarOpen);
  }
  
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 h-full lg:ml-80 overflow-auto">
          <Outlet />
        </div>
      </div>

      {!isChatPage && (
        <div className="flex-shrink-0">
          <InboxBar />
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;