import { useEffect, useState } from "react";
import { Ticket as TicketIcon, ShieldAlert } from "lucide-react";
import { useTicket } from "../src/services/api";
import type { TicketApiResponse } from "../src/services/api";

const COLORS = {
  page: "#EEF1F6",
  card: "#FFFFFF",
  border: "#E4E8EF",
  textDark: "#111827",
  textMuted: "#6B7280",
  verifiedBg: "#DCFCE7",
  verifiedText: "#16A34A",
  pendingBg: "#FEF3C7",
  pendingText: "#B45309",
  warnBg: "#FEF2F2",
  warnBorder: "#FECACA",
  warnText: "#B91C1C",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface StatusPillProps {
  isVerified: boolean;
}
function StatusPill({ isVerified }: StatusPillProps) {
  const bg = isVerified ? COLORS.verifiedBg : COLORS.pendingBg;
  const color = isVerified ? COLORS.verifiedText : COLORS.pendingText;
  return (
    <span
      className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {isVerified ? "Verified" : "Unverified"}
    </span>
  );
}
type TicketArray = TicketApiResponse["ticket"][number];

function getRemainingTime(verificationExpiresAt: string | Date) {
  const expiry = new Date(verificationExpiresAt);
  const now = Date.now();

  // Validate date
  if (isNaN(expiry.getTime())) {
    return { minutes: 0, seconds: 0, totalMs: 0, isExpired: true };
  }

  const diff = expiry.getTime() - now;
  const isExpired = diff <= 0;

  if (isExpired) {
    return { minutes: 0, seconds: 0, totalMs: 0, isExpired: true };
  }

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { minutes, seconds, totalMs: diff, isExpired: false };
}

function TicketCard({ t }: { t: TicketArray }) {
  const ticketRef = t._id.slice(-8).toUpperCase();
  const sessionRef = t.boxId.slice(-8).toUpperCase();
  const [timeLeft, setTimeLeft] = useState(() =>
    getRemainingTime(t.verificationExpiresAt),
  );
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [verifyLink, setVerifyLink] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getRemainingTime(t.verificationExpiresAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [t.verificationExpiresAt]);

  const isExpired = timeLeft.isExpired;
  const { minutes, seconds } = timeLeft;

  return (
    <div
      className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)]"
      style={{ backgroundColor: COLORS.card }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Ticket reference
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">
            #{ticketRef}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            This is your active bingo ticket. Keep it safe and verify before the
            window expires.
          </p>
        </div>
        <StatusPill isVerified={t.isVerified} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Purchased
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {formatDateTime(t.createdAt)}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {isExpired ? "Verification expired" : "Verification expires"}
          </p>
          <p
            className={`mt-3 text-sm font-semibold ${
              isExpired ? "text-rose-600" : "text-slate-900"
            }`}
          >
            {formatDateTime(t.verificationExpiresAt)}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Game session reference
        </p>
        <p className="mt-2 text-sm font-mono text-slate-900 break-all">
          {sessionRef}
        </p>
      </div>

      {!t.isVerified && (
        <div className="mt-6 rounded-[28px]  p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="mt-1 text-red-500" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-500">
                {isExpired ? (
                  "Verification window expired"
                ) : (
                  <>
                    Verify your ticket now
                    <span className="font-mono text-red-400">
                      {`  - ${minutes}m ${seconds}s remaining`}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-orange-700">
                {isExpired &&
                  "Your verification window has ended. Go and buy the box again."}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isExpired}
            onClick={() => setShowVerifyInput(true)}
            className={`mt-4 w-42 rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${
              isExpired
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-700"
            }`}
          >
            {isExpired ? "buy ticket" : "Verify ticket"}
          </button>

          {showVerifyInput && !isExpired && (
            <div className="mt-4 space-y-8 rounded-3xl border border-slate-200 bg-white p-4">
              <label className="block text-sm font-semibold text-slate-700">
                Verification link
              </label>
              <input
                type="url"
                value={verifyLink}
                onChange={(event) => setVerifyLink(event.target.value)}
                placeholder="Enter verification URL"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
              <div className="w-full text-center flex justify-center items-center">
                <button
                  type="button"
                  className="w-89   rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Submit verification link
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BingoTickets = () => {
  const {
    data: ticketData,
    isLoading: ticketIsLoading,
    isError: ticketError,
  } = useTicket();

  if (ticketIsLoading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLORS.page }}
      >
        <p style={{ color: COLORS.textMuted }}>Loading ticket...</p>
      </div>
    );
  }

  if (ticketError) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLORS.page }}
      >
        <p className="text-center" style={{ color: COLORS.textMuted }}>
          Couldn't load your ticket. Please try again.
        </p>
      </div>
    );
  }

  const tickets = ticketData?.ticket;

  return (
    <div
      className="w-full min-h-[calc(100vh-12rem)] flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: COLORS.page }}
    >
      <div
        className="w-full max-w-5xl rounded-2xl p-4 sm:p-6"
        style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TicketIcon size={18} style={{ color: COLORS.textMuted }} />
              <p className="text-sm font-semibold text-slate-900">
                Your tickets
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {tickets?.length
                ? `${tickets.length} ticket${tickets.length > 1 ? "s" : ""} purchased`
                : "No tickets purchased yet."}
            </p>
          </div>
        </div>

        {tickets && tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} t={ticket} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No ticket yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default BingoTickets;
