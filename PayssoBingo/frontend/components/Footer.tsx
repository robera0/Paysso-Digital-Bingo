import React from "react";
import Icon from "./icon";

interface NavItemsProps {
  key: string;
  label: string;
  icon: string;
}
const NAV_ITEMS: NavItemsProps[] = [
  { key: "bingo", label: "Bingo", icon: "grid" },
  { key: "tickets", label: "Tickets", icon: "ticket" },
  { key: "winners", label: "Winners", icon: "trophy" },
  { key: "settings", label: "Settings", icon: "gear" },
];

interface FooterProps {
  selectedCount: number;
  active: string;
  setActive: (key: string) => void;
}

export default function Footer({
  selectedCount,
  active,
  setActive,
}: FooterProps) {
  return (
    <footer className="flex-shrink-0 border-t border-line bg-white px-4 pb-2.5 pt-3.5 font-poppins">
      <div className="mb-2.5 flex items-center justify-between rounded-2xl bg-ink px-4 py-2.5">
        <span className="text-[13px] font-semibold text-white">
          {selectedCount} {selectedCount === 1 ? "Number" : "Numbers"}
        </span>
        <button
          type="button"
          className="rounded-[10px] bg-white px-4.5 py-2 text-[13px] font-bold text-ink"
        >
          Play
        </button>
      </div>

      <nav className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={[
                "flex flex-col items-center gap-1 px-1 py-2",
                isActive ? "text-ink" : "text-muted",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-[34px] w-[34px] items-center justify-center rounded-[10px]",
                  isActive ? "bg-ink text-white" : "",
                ].join(" ")}
              >
                <Icon name={item.icon} size={20} />
              </span>
              <span className="text-[10.5px] font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <p className="mt-2.5 mb-0.5 text-center text-[10px] font-medium text-muted">
        Paysso Digital Bingo &copy; 2026
      </p>
    </footer>
  );
}
