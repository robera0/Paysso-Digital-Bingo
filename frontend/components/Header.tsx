import Icon from "./icon";

const Header = () => {
  return (
    <header className="sticky top-0 z-20 flex-shrink-0 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-[16px] font-bold text-white">
            P
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-slate-900">Paysso</span>
            <span className="text-xs font-medium text-slate-500">
              Digital Bingo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">
              Live draw
            </span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          >
            <Icon name="bell" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
