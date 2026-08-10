import { LogOut, User } from "lucide-react";
import { useLogout } from "../src/services/useLogin";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const Active: Boolean = true;
  const { mutate: logout, isPending } = useLogout();
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
          <div
            className={`hidden items-center gap-2 rounded-full border ${Active ? "bg-emerald-50  border-emerald-100" : "bg-red-00   border-red-200"} px-3 py-1.5 sm:flex`}
          >
            <span
              className={`h-2 w-2 rounded-full animate-ping ${Active ? "bg-emerald-500" : " bg-red-500"}`}
            />
            <span
              className={`text-xs font-medium ${Active ? "text-emerald-700" : "text-red-500"} `}
            >
              Active Game
            </span>
          </div>
          <button
            onClick={() => navigate("/game/account")}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 sm:pr-4 shadow-sm transition-colors hover:bg-slate-50 cursor-default"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <User size={18} strokeWidth={2.5} />
            </div>
            <div className="hidden flex-col items-start justify-center sm:flex">
              <span className="text-[13px] font-bold text-slate-900 leading-tight">
                user
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => logout()}
            disabled={isPending}
            aria-label="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
