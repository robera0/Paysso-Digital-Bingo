import { useEffect, useState } from "react";
import {
  Ticket as TicketIcon,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useTicket } from "../src/services/api";
import type { TicketApiResponse } from "../src/services/api";
import { useVerify } from "../src/services/useVerify";
import { useLanguage } from "../src/LanguageContext";
import { translations } from "../src/translations";
import { TwinOrbit } from "@/components/loading-ui/twin-orbit";

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
  t: any;
}
function StatusPill({ isVerified, t }: StatusPillProps) {
  const bg = isVerified ? COLORS.verifiedBg : COLORS.pendingBg;
  const color = isVerified ? COLORS.verifiedText : COLORS.pendingText;
  return (
    <span
      className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {isVerified ? t.verified : t.unverified}
    </span>
  );
}
type TicketArray = TicketApiResponse["ticket"][number];

function getRemainingTime(verificationExpiresAt: string | Date) {
  const expiry = new Date(verificationExpiresAt);
  const now = Date.now();

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

function TicketCard({ t: ticketDataStr }: { t: TicketArray }) {
  const { language } = useLanguage();
  const t = translations[language].ticket;

  const ticketRef = ticketDataStr._id.slice(-8).toUpperCase();
  const sessionRef = ticketDataStr.boxId.slice(-8).toUpperCase();
  const [timeLeft, setTimeLeft] = useState(() =>
    getRemainingTime(ticketDataStr.verificationExpiresAt),
  );
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [verifyLink, setVerifyLink] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getRemainingTime(ticketDataStr.verificationExpiresAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [ticketDataStr.verificationExpiresAt]);

  const isExpired = timeLeft.isExpired;
  const { minutes, seconds } = timeLeft;
  const verificationDate = ticketDataStr.isVerified
    ? ticketDataStr.updatedAt
    : ticketDataStr.verificationExpiresAt;

  const {
    mutate: verifyDate,
    isPending,
    isSuccess,
    isError,
    reset: resetVerify,
  } = useVerify();

  const handleOpenVerify = () => {
    setShowVerifyInput(true);
  };

  const handleSubmitVerify = () => {
    if (!verifyLink.trim() || isPending) return;
    verifyDate({ receiptUrl: verifyLink, boxId: ticketDataStr.boxId });
  };

  return (
    <div
      className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)]"
      style={{ backgroundColor: COLORS.card }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {t.ticketReference}
          </p>
          <h3 className="mt-3 flex items-baseline gap-3 text-3xl font-semibold text-slate-900">
            {t.box} {ticketDataStr.boxNumber ?? "-"}
            <span className="text-sm font-medium text-slate-500">
              <span>#{ticketRef}</span>
            </span>
          </h3>
          <p className="mt-2 text-sm text-slate-500">{t.activeTicketDesc}</p>
        </div>
        <StatusPill isVerified={ticketDataStr.isVerified} t={t} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {t.purchased}
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {formatDateTime(ticketDataStr.createdAt)}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {ticketDataStr.isVerified
              ? t.verifiedOn
              : isExpired
                ? t.verificationExpired
                : t.verificationExpires}
          </p>
          <p
            className={`mt-3 text-sm font-semibold ${
              !ticketDataStr.isVerified && isExpired
                ? "text-rose-600"
                : "text-slate-900"
            }`}
          >
            {formatDateTime(verificationDate)}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          {t.gameSessionReference}
        </p>
        <p className="mt-2 text-sm font-mono text-slate-900 break-all">
          {sessionRef}
        </p>
      </div>

      {!ticketDataStr.isVerified && (
        <div className="mt-6 rounded-[28px] p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="mt-1 text-red-500" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-500">
                {isExpired ? (
                  t.verifyWindowExpired
                ) : (
                  <>
                    {t.verifyNow}
                    <span className="font-mono text-red-400">
                      {`  - ${minutes}m ${seconds}s ${t.remaining}`}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-orange-700">
                {isExpired && t.windowEnded}
              </p>
            </div>
          </div>

          {!showVerifyInput && (
            <button
              type="button"
              disabled={isExpired}
              onClick={handleOpenVerify}
              className={`mt-4 w-46 rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${
                isExpired
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-700"
              }`}
            >
              {isExpired ? t.buyTicket : t.verifyTicket}
            </button>
          )}

          {showVerifyInput && !isExpired && (
            <div className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-white p-4 transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-slate-700">
                {t.verificationLink}
              </label>
              <input
                type="url"
                value={verifyLink}
                onChange={(event) => {
                  setVerifyLink(event.target.value);
                  if (isError) resetVerify();
                }}
                placeholder={t.enterUrl}
                disabled={isPending || isSuccess}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-60"
              />

              <div className="w-full text-center flex justify-center items-center">
                <button
                  type="button"
                  disabled={!verifyLink.trim() || isPending || isSuccess}
                  onClick={handleSubmitVerify}
                  className="w-full sm:w-72 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending && (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t.verifying}
                    </>
                  )}
                  {!isPending && isSuccess && (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      {t.verified}
                    </>
                  )}
                  {!isPending && !isSuccess && t.submitVerification}
                </button>
              </div>

              {isError && (
                <p className="text-center text-sm text-rose-600 animate-in fade-in">
                  {t.verifyError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BingoTickets = () => {
  const { language } = useLanguage();
  const t = translations[language].ticket;

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
        <TwinOrbit />
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
          {t.loadError}
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
                {t.yourTickets}
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {tickets?.length
                ? `${tickets.length} ${tickets.length > 1 ? t.ticketsPurchased : t.ticketPurchased}`
                : t.noTicketsYet}
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
            {t.noTicketsYet}
          </div>
        )}
      </div>
    </div>
  );
};

export default BingoTickets;
