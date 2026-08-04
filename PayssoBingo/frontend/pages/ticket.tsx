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

function TicketCard({ t }: { t: TicketArray }) {
  const shortId = t?._id.slice(-8).toUpperCase();
  const expiry = new Date(t?.verificationExpiresAt);
  const isExpired = !isNaN(expiry.getTime()) && expiry.getTime() < Date.now();

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 w-full max-w-sm mx-auto sm:mx-0"
      style={{
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <div>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>
            Ticket
          </p>
          <h3
            className="text-base sm:text-lg font-semibold break-all"
            style={{ color: COLORS.textDark }}
          >
            #{shortId}
          </h3>
        </div>
        <StatusPill isVerified={t.isVerified} />
      </div>

      {!t.isVerified && (
        <div
          className="flex items-start gap-2 rounded-lg p-3 mt-3"
          style={{
            backgroundColor: COLORS.warnBg,
            border: `1px solid ${COLORS.warnBorder}`,
          }}
        >
          <ShieldAlert
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: COLORS.warnText }}
          />
          <div className="min-w-0">
            <p
              className="text-sm font-medium"
              style={{ color: COLORS.warnText }}
            >
              This ticket isn't verified yet
            </p>
            <p className="text-xs mt-0.5" style={{ color: COLORS.warnText }}>
              {isExpired
                ? "The verification window has expired."
                : `Verify before ${formatDateTime(t.verificationExpiresAt)}.`}
            </p>
            {/* No verify endpoint wired up yet — hook this to your mutation */}
            <button
              type="button"
              className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-md w-full sm:w-auto"
              style={{ backgroundColor: COLORS.warnText, color: "#FFFFFF" }}
            >
              Verify ticket
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 mt-4">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="text-sm" style={{ color: COLORS.textMuted }}>
            Purchased
          </span>
          <span
            className="text-sm text-right"
            style={{ color: COLORS.textDark }}
          >
            {formatDateTime(t.createdAt)}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="text-sm" style={{ color: COLORS.textMuted }}>
            Verification {isExpired ? "expired" : "expires"}
          </span>
          <span
            className="text-sm text-right"
            style={{ color: isExpired ? COLORS.pendingText : COLORS.textDark }}
          >
            {formatDateTime(t.verificationExpiresAt)}
          </span>
        </div>
      </div>

      <div
        className="pt-3 mt-3"
        style={{ borderTop: `1px solid ${COLORS.border}` }}
      >
        <p className="text-xs" style={{ color: COLORS.textMuted }}>
          Box ID
        </p>
        <p
          className="text-sm font-mono break-all"
          style={{ color: COLORS.textDark }}
        >
          {t.boxId}
        </p>
      </div>
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

  const ticket = ticketData?.ticket?.[0];

  return (
    <div
      className="w-full min-h-screen p-3 sm:p-6"
      style={{ backgroundColor: COLORS.page }}
    >
      <div
        className="rounded-2xl p-4 sm:p-6"
        style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <TicketIcon size={18} style={{ color: COLORS.textMuted }} />
          <p className="text-sm" style={{ color: COLORS.textMuted }}>
            Your ticket
          </p>
        </div>

        {ticket ? (
          <TicketCard t={ticket} />
        ) : (
          <p style={{ color: COLORS.textMuted }}>No ticket yet.</p>
        )}
      </div>
    </div>
  );
};

export default BingoTickets;
