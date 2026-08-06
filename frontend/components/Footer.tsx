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
    <footer className="flex flex-col items-center border-t border-slate-200 bg-white px-4 pb-3 pt-3 sm:px-6 sm:border-none sm:fixed sm:top-1/2 sm:right-4 sm:z-50 sm:max-w-none sm:min-w-[220px] sm:-translate-y-1/2 sm:rounded-3xl sm:border sm:border-slate-200 sm:bg-white sm:shadow-xl">
      <nav className="grid w-full grid-cols-2 gap-4 sm:grid-cols-1 sm:gap-3">
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
