import React, { useState, useMemo } from "react";
import {
  Plus,
  Radio,
  Wallet,
  Ticket,
  Search,
  FileText,
  Dices,
} from "lucide-react";
import {
  useAllGameAnalytics,
  useGameAnalytics,
  useUpdateGame,
} from "@/services/useAnalytics";
import CreateGameSessionModal from "@/components/CreateGame";

export const Games: React.FC = () => {
  const [filter, setFilter] = useState<
    "All" | "ACTIVE" | "PAUSED" | "COMPLETED"
  >("All");
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const {
    mutate: UpdateGameMutation,
    isPending: isUpdatingGame,
    variables: pendingVariables,
  } = useUpdateGame();
  const [search, setSearch] = useState("");
  const { data: liveGameData } = useGameAnalytics();
  const { data: gameListResponse } = useAllGameAnalytics();
  const [CreateGame, setCreateGame] = useState(false);
  const gamesList = gameListResponse?.Games || [];

  const filteredGames = useMemo(() => {
    return gamesList.filter((g) => {
      const matchFilter = filter === "All" || g.status === filter;

      const searchLower = search.toLowerCase().trim();
      const matchName = g.gameName?.toLowerCase().includes(searchLower);
      const matchId = String(g.gameId || "")
        .toLowerCase()
        .includes(searchLower);

      const matchSearch = matchName || matchId;

      return matchFilter && matchSearch;
    });
  }, [gamesList, filter, search]);

  return (
    <div className="p-3.5 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight font-sans">
            Games Management
          </h1>
          <p className="text-xs sm:text-sm text-[#8e8e93] mt-1 font-medium">
            Monitor, edit, and launch live and upcoming raffle instances.
          </p>
        </div>
        <button
          onClick={() => setCreateGame(true)}
          className="bg-gradient-to-r from-[#1868DB] to-[#1251ad] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:from-[#1456b8] hover:to-[#0f4392] transition-all shadow-[0_4px_16px_rgba(24,104,219,0.35)] w-full sm:w-auto cursor-pointer border border-[#3b82f6]/30"
        >
          <Plus className="w-6" />
          <span>Start New Game</span>
        </button>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-b from-[#18181c] to-[#141416] border border-[#26262a] rounded-2xl p-5 shadow-sm hover:border-[#10B981]/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between text-[#8e8e93] mb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#a1a1a5]">
              LIVE INSTANCES
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-[#10B981]/15 flex items-center justify-center border border-[#10B981]/30">
              <Radio className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {liveGameData?.activeGame ?? 0}
          </div>
          <p className="text-xs text-[#10B981] mt-1 font-mono font-semibold">
            +1 since yesterday
          </p>
        </div>

        <div className="bg-gradient-to-b from-[#18181c] to-[#141416] border border-[#26262a] rounded-2xl p-5 shadow-sm hover:border-[#F59E0B]/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between text-[#8e8e93] mb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#a1a1a5]">
              OPENED BOXES
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center border border-[#F59E0B]/30">
              <Wallet className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {liveGameData?.OpenedBox ?? 0}
          </div>
          <p className="text-xs text-[#8e8e93] mt-1 font-medium">
            Across all running pools
          </p>
        </div>

        <div className="bg-gradient-to-b from-[#18181c] to-[#141416] border border-[#26262a] rounded-2xl p-5 shadow-sm hover:border-[#1868DB]/40 hover:-translate-y-0.5 transition-all duration-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#8e8e93] mb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#a1a1a5]">
              UNVERIFIED TICKETS
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-[#1868DB]/15 flex items-center justify-center border border-[#1868DB]/30">
              <Ticket className="w-4 h-4 text-[#3b82f6]" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {liveGameData?.unverifiedTicket ?? 0}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93]" />
          <input
            type="text"
            placeholder="Search game ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121214] border border-[#26262a] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-[#6e6e73] focus:border-[#1868DB] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-[#121214] rounded-xl border border-[#26262a] w-full sm:w-auto">
          {(["All", "ACTIVE", "PAUSED", "COMPLETED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-1 sm:flex-initial text-center ${
                filter === status
                  ? "bg-gradient-to-r from-[#1868DB] to-[#1251ad] text-white shadow-sm font-bold"
                  : "text-[#8e8e93] hover:text-white hover:bg-[#1a1a1e]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Games Card Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredGames?.map((game) => {
          const isLive = game.status === "ACTIVE";
          const isScheduled = game.status === "PAUSED";
          const isCompleted = game.status === "COMPLETED";
          const totalTicketAmount =
            (game?.price ?? 0) * (game?.boxes?.length ?? 0);
          const soldTicketRevenue =
            (game?.ticketSold ?? 0) * (game?.price ?? 0);

          // Only THIS card's button shows the loading state
          const isThisCardUpdating =
            isUpdatingGame && pendingVariables?.gameId === game.gameId;

          return (
            <div
              key={game?.gameId}
              className="bg-[#161618] border border-[#26262a] rounded-2xl overflow-hidden flex flex-col hover:border-[#3b82f6]/40 transition-all shadow-sm"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-[#26262a] bg-[#121214] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        isLive
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                          : isScheduled
                            ? "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30"
                            : "bg-[#26262a] text-[#8e8e93] border-[#38383e]"
                      }`}
                    >
                      {game.status}
                    </span>
                    <span className="font-mono text-xs text-[#8e8e93]">
                      {game.gameId}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {game.gameName}
                  </h3>
                </div>
              </div>

              {/* Card Metrics */}
              <div className="p-4 flex-1 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-[#8e8e93] mb-0.5 font-medium">
                    Ticket Price
                  </p>
                  <p className="text-lg text-[#10B981] font-bold font-mono">
                    {game?.price ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#8e8e93] mb-0.5 font-medium">
                    {isScheduled
                      ? "Starts In"
                      : isCompleted
                        ? "Ended On"
                        : "Amount Sold / Total Ticket Value"}
                  </p>
                  <p className="text-lg text-[#10B981] font-bold font-mono">
                    {soldTicketRevenue} / {totalTicketAmount}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#121214] border-t border-[#26262a] flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setSelectedGame(game)}
                  className="px-3.5 py-1.5 rounded-lg text-[#8e8e93] font-semibold hover:text-white hover:bg-[#1a1a1e] transition-colors cursor-pointer"
                >
                  Details
                </button>

                {!isCompleted && (
                  <button
                    disabled={isThisCardUpdating}
                    onClick={() =>
                      UpdateGameMutation({
                        gameId: game.gameId,
                        status: isLive ? "PAUSED" : "ACTIVE",
                      })
                    }
                    className={`px-3.5 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 min-w-[100px] justify-center ${
                      isLive
                        ? "border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/10"
                        : "border-[#1868DB] text-[#1868DB] hover:bg-[#1868DB]/10"
                    }`}
                  >
                    {isThisCardUpdating ? (
                      <>
                        <Dices className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : isLive ? (
                      "Pause Game"
                    ) : (
                      "Force Start"
                    )}
                  </button>
                )}

                {isCompleted && (
                  <button className="px-3.5 py-1.5 rounded-lg text-[#3b82f6] font-semibold hover:text-white hover:bg-[#3b82f6]/10 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <FileText className="w-4 h-4" />
                    <span>Audit Report</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-[#26262a] bg-[#161618] p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8e8e93]">
                  Game Details
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">
                  {selectedGame.gameName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGame(null)}
                className="rounded-lg border border-[#26262a] px-2.5 py-1.5 text-xs font-semibold text-[#8e8e93] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-[#d1d5db]">
              <div className="rounded-xl border border-[#26262a] bg-[#121214] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8e8e93]">
                  Ticket Price
                </p>
                <p className="mt-2 text-lg font-bold text-[#10B981]">
                  {selectedGame.price ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-[#26262a] bg-[#121214] p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8e8e93]">
                  Boxes Sold
                </p>
                <p className="mt-2 text-lg font-bold text-[#10B981]">
                  {selectedGame.ticketSold ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#26262a] bg-[#121214] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#8e8e93]">
                Purchased Numbers
              </p>
              <div className="flex flex-wrap gap-2">
                {(selectedGame.boxes || [])
                  .filter((box: any) => box?.isOpened)
                  .map((box: any) => (
                    <span
                      key={box?._id || box?.boxNumber}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#10B981]/40 bg-[#10B981] text-sm font-bold text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                    >
                      {box?.boxNumber}
                    </span>
                  ))}
              </div>
              {!(selectedGame.boxes || []).some(
                (box: any) => box?.isOpened,
              ) && (
                <p className="mt-3 text-sm text-[#8e8e93]">
                  No boxes have been purchased for this game yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {CreateGame && (
        <>
          <CreateGameSessionModal
            gameName={""}
            priceBox={200}
            totalBox={100}
            prizePool={[
              {
                prizeName: "iPhone",
                prize: "1st Prize",
                amount: 1,
                value: 5000,
              },
              {
                prizeName: "TV",
                prize: "2nd Prize",
                amount: 2,
                value: 3000,
              },
            ]}
            onClose={() => setCreateGame(false)}
          />
        </>
      )}
    </div>
  );
};
export default Games;
