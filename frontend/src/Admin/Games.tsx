import React, { useState, useMemo } from "react";
import { Plus, Radio, Wallet, Ticket, Search, FileText } from "lucide-react";
import { useGameAnalytics } from "@/services/useAnalytics";
import CreateGameSessionModal, {
  type PrizePool,
} from "@/components/CreateGame";

export const Games: React.FC = () => {
  const [filter, setFilter] = useState<
    "All" | "ACTIVE" | "PAUSED" | "COMPLETED"
  >("All");
  const [search, setSearch] = useState("");
   
  const { data: Game } = useGameAnalytics();
  const [CreateGame, setCreateGame] = useState(false);
  
  const [createGameForm, setCreateGameForm] = useState({
    gameName: "",
    priceBox: "200",
    totalBox: "100",
    prizePool: [
      {
        prizeName: "iPhone",
        prize: "1st Prize",
        amount: "1",
        value: "5000",
      },
      {
        prizeName: "TV",
        prize: "2nd Prize",
        amount: "2",
        value: "3000",
      },
    ] as PrizePool[],
  });

  const handleCreateGameFieldChange = (
    field: "gameName" | "priceBox" | "totalBox",
    value: string,
  ) => {
    setCreateGameForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrizeChange = (
    index: number,
    field: keyof PrizePool,
    value: string,
  ) => {
    setCreateGameForm((prev) => ({
      ...prev,
      prizePool: prev.prizePool.map((prize, prizeIndex) =>
        prizeIndex === index
          ? {
              ...prize,
              [field]: value,
            }
          : prize,
      ),
    }));
  };

  const handleAddPrize = () => {
    setCreateGameForm((prev) => ({
      ...prev,
      prizePool: [
        ...prev.prizePool,
        {
          prizeName: "",
          prize: "",
          amount: "1",
          value: "0",
        },
      ],
    }));
  };

  const handleRemovePrize = (index: number) => {
    setCreateGameForm((prev) => ({
      ...prev,
      prizePool: prev.prizePool.filter((_, prizeIndex) => prizeIndex !== index),
    }));
  };

  const gamesList = Game?.Games || [];
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
  }, [Game, gamesList, filter, search]);

  
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
          <Plus className="w-4 h-4" />
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
            {" "}
            {Game?.activeGame}
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
            {Game?.OpenedBox}
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
            {Game?.unverifiedTicket}
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
                    Prize Pool
                  </p>
                  <p className="text-lg text-[#10B981] font-bold font-mono">
                    {game?.price}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#8e8e93] mb-0.5 font-medium">
                    {isScheduled
                      ? "Starts In"
                      : isCompleted
                        ? "Ended On"
                        : "Tickets Sold"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#121214] border-t border-[#26262a] flex justify-end gap-2 text-xs">
                <button className="px-3.5 py-1.5 rounded-lg text-[#8e8e93] font-semibold hover:text-white hover:bg-[#1a1a1e] transition-colors cursor-pointer">
                  Details
                </button>
                {isLive && (
                  <button className="px-3.5 py-1.5 rounded-lg border border-[#EF4444]/40 text-[#EF4444] font-semibold hover:bg-[#EF4444]/10 transition-colors cursor-pointer">
                    Pause Game
                  </button>
                )}
                {isScheduled && (
                  <button className="px-3.5 py-1.5 rounded-lg border border-[#1868DB] text-[#1868DB] font-semibold hover:bg-[#1868DB]/10 transition-colors cursor-pointer">
                    Force Start
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

     

      {CreateGame && (
        <>
          <CreateGameSessionModal
            gameName={createGameForm.gameName}
            priceBox={createGameForm.priceBox}
            totalBox={createGameForm.totalBox}
            prizePool={createGameForm.prizePool}
            onChange={handleCreateGameFieldChange}
            onPrizeChange={handlePrizeChange}
            onAddPrize={handleAddPrize}
            onRemovePrize={handleRemovePrize}
            onClose={() => setCreateGame(false)}
          />
        </>
      )}
    </div>
  );
};
export default Games;
