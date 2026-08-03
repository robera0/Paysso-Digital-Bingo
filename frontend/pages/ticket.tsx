import { Link } from "react-router-dom";
import { Ticket as TicketIcon } from "lucide-react";

export const TICKETS = [
  {
    id: "014",
    game: "Sheger Bingo Night",
    price: "50 ETB",
    status: "Active",
    numbers: [
      3, 12, 27, 34, 41, 8, 19, 25, 38, 46, 1, 16, 22, 30, 44, 7, 20, 29, 37,
      49, 5, 14, 23, 33, 48,
    ],
    marked: [12, 25, 44, 20, 33],
  },
  {
    id: "027",
    game: "Sheger Bingo Night",
    price: "50 ETB",
    status: "Won",
    numbers: [
      2, 11, 26, 35, 42, 9, 18, 24, 39, 45, 4, 15, 21, 31, 43, 6, 17, 28, 36,
      47, 10, 13, 32, 40, 50,
    ],
    marked: [2, 11, 26, 35, 42, 9, 18, 24, 39, 45],
  },
  {
    id: "003",
    game: "Weekend Jackpot",
    price: "100 ETB",
    status: "Active",
    numbers: [
      55, 61, 78, 84, 92, 58, 67, 73, 89, 97, 52, 64, 71, 81, 95, 56, 69, 76,
      87, 99, 53, 62, 75, 83, 91,
    ],
    marked: [78, 67, 71],
  },
];

const COLORS = {
  page: "#EEF1F6",
  card: "#FFFFFF",
  border: "#E4E8EF",
  cell: "#1E2A3D",
  cellMarked: "#A9B3C1",
  textDark: "#111827",
  textMuted: "#6B7280",
  avatar: "#6C5CE7",
  activeBg: "#DCFCE7",
  activeText: "#16A34A",
  wonBg: "#FEF3C7",
  wonText: "#B45309",
};

interface StatusPillProps {
  status: string;
}
function StatusPill({ status }: StatusPillProps) {
  const bg = status === "Won" ? COLORS.wonBg : COLORS.activeBg;
  const color = status === "Won" ? COLORS.wonText : COLORS.activeText;
  return (
    <span
      className="text-xs font-medium px-3 py-1 rounded-full"
      style={{ backgroundColor: bg, color }}
    >
      {status === "Won" ? "Won" : "Active Game"}
    </span>
  );
}

interface Ticket {
  id: string;
  game: string;
  price: string;
  status: string;
  numbers: number[];
  marked: number[];
}

function TicketCard({ t }: { t: Ticket }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>
            Ticket
          </p>
          <h3
            className="text-lg font-semibold"
            style={{ color: COLORS.textDark }}
          >
            #{t.id}
          </h3>
        </div>
        <StatusPill status={t.status} />
      </div>

      <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>
        {t.game}
      </p>

      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {t?.numbers?.map((n) => {
          const isMarked = t?.marked.includes(n);
          return (
            <div
              key={n}
              className="aspect-square flex items-center justify-center rounded-lg text-xs font-medium"
              style={{
                backgroundColor: isMarked ? COLORS.cellMarked : COLORS.cell,
                color: "#FFFFFF",
              }}
            >
              {n}
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: `1px solid ${COLORS.border}` }}
      >
        <span className="text-sm" style={{ color: COLORS.textMuted }}>
          Entry fee
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: COLORS.textDark }}
        >
          {t.price}
        </span>
      </div>
    </div>
  );
}

const BingoTickets = () => {
  return (
    <div
      className="w-full min-h-screen p-6"
      style={{ backgroundColor: COLORS.page }}
    >
      {/* tickets section */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              Your tickets
            </p>
            <h2
              className="text-xl font-semibold"
              style={{ color: COLORS.textDark }}
            >
              {TICKETS.length} purchased
            </h2>
          </div>
          <button
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
            style={{
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textDark,
            }}
          >
            <TicketIcon size={14} />
            Buy ticket
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TICKETS.map((t) => (
            <TicketCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BingoTickets;
