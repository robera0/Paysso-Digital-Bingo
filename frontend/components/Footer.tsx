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
  { key: "bingo", label: "Bingo", icon: "grid", path: "/" },
  { key: "tickets", label: "Tickets", icon: "ticket", path: "/ticket" },
  { key: "winners", label: "Winners", icon: "trophy", path: "/winners" },
  { key: "settings", label: "Settings", icon: "gear", path: "/settings" },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith("/ticket")) return "tickets";
    if (location.pathname === "/") return "bingo";
    if (location.pathname.startsWith("/winners")) return "winners";
    if (location.pathname.startsWith("/settings")) return "settings";
    return "bingo";
  }, [location.pathname]);

  return (
    <footer className="flex-shrink-0 border-t border-slate-200 bg-white px-4 pb-3 pt-3 sm:px-6">
      <nav className="grid grid-cols-4 gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-1 py-2 transition ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-[34px] w-[34px] items-center justify-center rounded-[10px] ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon name={item.icon} size={20} />
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <p className="mt-3 mb-0.5 text-center text-xs font-medium text-slate-500">
        Paysso Digital Bingo &copy; 2026
      </p>
    </footer>
  );
}
