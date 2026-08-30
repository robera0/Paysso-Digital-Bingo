import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
import { Overview } from './Overview';
import { Games } from './Games';
import { Winners } from './Winners';
import { History } from './History';

export const AdminApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#e4e2e4] antialiased selection:bg-[#1868DB] selection:text-white font-sans flex w-full">
      {/* Desktop Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-h-screen pb-20 md:pb-6 transition-all duration-300 min-w-0">
        {/* Top Header */}
        <TopBar />

        {/* Active Screen View */}
        <main className="flex-1 w-full overflow-x-hidden">
          {currentTab === 'overview' && <Overview />}
          {currentTab === 'games' && <Games />}
          {currentTab === 'winners' && <Winners />}
          {currentTab === 'history' && <History />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomBar currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
};

export default AdminApp;
