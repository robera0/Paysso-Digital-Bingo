import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./icon";

interface NavItemsProps {
  key: string;
  label: string;
  icon: string;
  path: string;
}
const NAV_ITEMS: NavItemsProps[] = [
  { key: "bingo", label: "Bingo", icon: "grid", path: "/game" },
  { key: "tickets", label: "Tickets", icon: "ticket", path: "/game/ticket" },
  // { key: "winners", label: "Winners", icon: "trophy", path: "/game/winners" },
  // { key: "settings", label: "Settings", icon: "gear", path: "/game/settings" },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith("/game/ticket")) return "tickets";
    if (location.pathname.startsWith("/game/winners")) return "winners";
    if (location.pathname.startsWith("/game/settings")) return "settings";
    return "bingo";
  }, [location.pathname]);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 flex flex-col sm:top-1/2 sm:right-6 sm:bottom-auto sm:left-auto sm:-translate-y-1/2 sm:w-auto sm:items-end">
      <div className="w-full border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md sm:rounded-[28px] sm:border sm:w-auto sm:min-w-[120px] sm:px-3 sm:shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
        <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-2 transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="col-span-2 mt-2 flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-2 py-2 text-center text-[10px] font-medium text-slate-500 sm:col-span-1">
          PDB
        </div>
      </div>
    </footer>
  );
}
