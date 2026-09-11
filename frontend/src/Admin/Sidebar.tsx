import React from "react";
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Receipt,
  ShieldCheck,
  Activity,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/services/useLogin";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "winners", label: "Winners", icon: Trophy },
    { id: "history", label: "Purchase History", icon: Receipt },
  ];
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <aside className="hidden md:flex flex-col w-[250px] bg-[#121215]/95 backdrop-blur-2xl border-r border-[#26262a] h-screen sticky left-0 top-0 z-40 select-none shadow-2xl shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#26262a]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1868DB] via-[#1456b8] to-[#0a3778] flex items-center justify-center text-white shadow-[0_0_20px_rgba(24,104,219,0.5)] border border-[#3b82f6]/40">
            <ShieldCheck className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-widest text-white uppercase font-sans">
                PAYSOO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-6 space-y-1.5">
        <div className="px-3 pb-2.5 text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                isActive
                  ? "bg-gradient-to-r from-[#1868DB] to-[#1251ad] text-white shadow-[0_4px_20px_rgba(24,104,219,0.4)] border border-[#3b82f6]/30"
                  : "text-[#9e9ea3] hover:text-white hover:bg-[#1a1a1e] border border-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_#ffffff]" />
              )}
              <Icon
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-white"
                    : "text-[#8e8e93] group-hover:text-white"
                }`}
              />
              <span className="tracking-wide font-sans">{item.label}</span>
              {isActive && (
                <Sparkles className="w-3.5 h-3.5 ml-auto text-white/80 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footprint */}
      <div className="p-4 border-t border-[#26262a]/80 space-y-3">
        <div className="bg-[#18181c]/90 rounded-2xl p-3.5 border border-[#26262a] flex items-center gap-3 shadow-inner">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            <div className="absolute w-4 h-4 rounded-full bg-[#10B981]/30 animate-ping" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-white tracking-tight">
                System Operational
              </p>
              <Activity className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <p className="text-[10px] text-[#8e8e93] font-mono mt-0.5">
              Core v2.4.0 • Active
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#1a1a1e] px-3 py-2.5 text-[11px] font-semibold text-[#FCA5A5] hover:bg-[#EF4444]/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
