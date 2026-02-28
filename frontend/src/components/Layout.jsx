import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Don't show layout on onboarding
  const isOnboarding = location.pathname === '/onboarding';

  if (isOnboarding) {
    return <div className="min-h-screen bg-[#0A0A0A]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-[margin-left] duration-250 ${
          sidebarCollapsed ? 'ml-0' : 'ml-[280px]'
        }`}
      >
        <Topbar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(prev => !prev)} />
        <main className="flex-1 overflow-auto">
          <div className="px-10 py-8 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
