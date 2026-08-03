import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/icon";
import { TICKETS } from "./ticket";

const TicketEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = TICKETS.find((ticket) => ticket.id === id);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-6 shadow-2xl shadow-slate-200/70">
          <p className="text-sm font-semibold text-slate-600">
            Ticket not found
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <Icon name="arrow-left" size={16} />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-2xl shadow-slate-200/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Edit ticket
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Ticket #{ticket.id}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {ticket.game} — {ticket.price}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Icon name="arrow-left" size={16} />
              Back
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Icon name="save" size={16} />
              Save changes
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Ticket details
            </h2>
            <div className="mt-5 grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Game name
                </span>
                <input
                  type="text"
                  defaultValue={ticket.game}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Ticket price
                </span>
                <input
                  type="text"
                  defaultValue={ticket.price}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Status
                </span>
                <select
                  defaultValue={ticket.status}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Active</option>
                  <option>Won</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <Icon name="ticket" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Selected numbers
                </p>
                <p className="text-sm text-slate-500">
                  Tap to change which numbers are marked on the ticket.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {ticket.numbers.map((number) => {
                const isMarked = ticket.marked.includes(number);
                return (
                  <button
                    key={number}
                    type="button"
                    className={`aspect-square rounded-3xl border px-2 text-xs font-semibold transition ${
                      isMarked
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketEdit;
