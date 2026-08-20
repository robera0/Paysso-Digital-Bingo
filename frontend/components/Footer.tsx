import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./icon";
import { useLanguage } from "../src/LanguageContext";
import { translations } from "../src/translations";

interface NavItemsProps {
  key: string;
  icon: string;
  path: string;
}

const NAV_ITEMS: NavItemsProps[] = [
  { key: "bingo", icon: "grid", path: "/game" },
  { key: "tickets", icon: "ticket", path: "/game/ticket" },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language].footer;

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith("/game/account")) return null;
    if (location.pathname.startsWith("/game/ticket")) return "tickets";
    if (location.pathname.startsWith("/game/winners")) return "winners";
    if (location.pathname.startsWith("/game/settings")) return "settings";
    if (location.pathname === "/game" || location.pathname.startsWith("/game/"))
      return "bingo";
    return null;
  }, [location.pathname]);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 flex flex-col lg:top-1/2 lg:right-6 lg:bottom-auto lg:left-auto lg:-translate-y-1/2 lg:w-auto lg:items-end">
      <div className="w-full border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md lg:rounded-[28px] lg:border lg:w-auto lg:min-w-[110px] lg:px-2 lg:py-2 lg:shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
        <nav className="grid grid-cols-2 gap-1.5 lg:flex lg:flex-col lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeKey === item.key;
            const label = item.key === "bingo" ? t.bingo : t.tickets;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-1.5 py-1.5 transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-[10px] ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                </span>
                <span className="text-[9px] font-medium leading-none">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="col-span-2 mt-1.5 flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-2 py-1.5 text-center text-[9px] font-medium text-slate-500 lg:col-span-1">
          PDB
        </div>
      </div>
    </footer>
  );
}
