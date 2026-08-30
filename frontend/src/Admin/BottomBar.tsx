import React from 'react';
import { LayoutDashboard, Gamepad2, Trophy, Receipt } from 'lucide-react';

interface BottomBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'winners', label: 'Winners', icon: Trophy },
    { id: 'history', label: 'History', icon: Receipt },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#121215]/95 backdrop-blur-xl border-t border-[#26262a] flex items-center justify-around px-3 z-40 shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-white bg-gradient-to-r from-[#1868DB] to-[#1251ad] font-bold scale-105 shadow-[0_0_12px_rgba(24,104,219,0.4)] border border-[#3b82f6]/30'
                : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            <Icon className="w-4.5 h-4.5" />
            <span className="text-[10px] tracking-tight font-medium font-sans">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
export default BottomBar;
