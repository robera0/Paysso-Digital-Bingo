import React from 'react';
import { ShieldCheck, Bell } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-16 border-b border-[#26262a] bg-[#121215]/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md w-full">
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1868DB] to-[#0d4599] flex items-center justify-center text-white shadow-[0_0_12px_rgba(24,104,219,0.4)] border border-[#3b82f6]/30">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-xs tracking-wider text-white uppercase font-sans">PAYSOO</span>
            <span className="bg-[#1868DB]/20 text-[#60a5fa] text-[8px] font-bold px-1 py-0.5 rounded border border-[#1868DB]/40">ADMIN</span>
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
            <p className="text-xs font-bold text-white leading-none">Admin Controller</p>
            <p className="text-[10px] text-[#8e8e93] font-medium mt-0.5">Superuser Access</p>
          </div>
        </div>
      </div>
    </header>
  );
};
export default TopBar;
