import React from "react";
import Icon from "./icon";
const Header = () => {
  return (
    <header className="flex-shrink-0 border-b border-line bg-white px-5 pt-5 pb-[18px] font-poppins">
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ink text-[16px] font-bold text-white">
            P
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[17px] font-bold text-ink">Paysso</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Digital Bingo
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink"
        >
          <Icon name="bell" />
        </button>
      </div>
    </header>
  );
};
export default Header;
