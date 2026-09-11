import React from "react";
import {
  ShieldCheck,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Receipt,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/services/useLogin";

interface TopBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  mobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
}) => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "winners", label: "Winners", icon: Trophy },
    { id: "history", label: "Purchase History", icon: Receipt },
  ];

  return (
    <>
      <header className="h-16 border-b border-[#26262a] bg-[#121215]/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#26262a] bg-[#18181c] text-[#d1d5db] transition-colors hover:border-[#3b82f6]/40 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1868DB] to-[#0d4599] flex items-center justify-center text-white shadow-[0_0_12px_rgba(24,104,219,0.4)] border border-[#3b82f6]/30">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xs tracking-wider text-white uppercase font-sans">
                PAYSOO
              </span>
              <span className="bg-[#1868DB]/20 text-[#60a5fa] text-[8px] font-bold px-1 py-0.5 rounded border border-[#1868DB]/40">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            className="p-2.5 rounded-xl bg-[#18181c] border border-[#26262a] text-[#8e8e93] hover:text-white hover:border-[#3b82f6]/40 transition-all relative group cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1868DB] ring-2 ring-[#121214] shadow-[0_0_8px_#1868DB]" />
          </button>

          <div className="flex items-center gap-3 pl-3.5 border-l border-[#26262a]">
            <div className="relative">
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-[#1868DB] to-[#0d4599] text-white font-black text-xs flex items-center justify-center border border-[#3b82f6]/40 shadow-[0_0_12px_rgba(24,104,219,0.3)]">
                AD
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#121215]" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-none">
                Admin Controller
              </p>
              <p className="text-[10px] text-[#8e8e93] font-medium mt-0.5">
                Superuser Access
              </p>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={onCloseMobileMenu}
        >
          <div
            className="h-full w-[82%] max-w-xs border-r border-[#26262a] bg-[#121215] p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1868DB] to-[#0d4599] flex items-center justify-center text-white shadow-[0_0_10px_rgba(24,104,219,0.4)] border border-[#3b82f6]/30">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[0.24em] text-white uppercase">
                    PAYSOO
                  </p>
                  <p className="text-[9px] text-[#8e8e93]">Admin panel</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseMobileMenu}
                className="rounded-lg border border-[#26262a] p-1.5 text-[#8e8e93] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobileMenu();
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-[#1868DB] to-[#1251ad] text-white"
                        : "text-[#b7b7bb] hover:bg-[#1a1a1e] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-[#26262a] pt-4">
              <button
                type="button"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#1a1a1e] px-3 py-3 text-sm font-semibold text-[#FCA5A5] transition-colors hover:bg-[#EF4444]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default TopBar;
