import React, { useState, useMemo } from "react";
import { Plus, Radio, Wallet, Ticket, Search, FileText } from "lucide-react";
import { useGameAnalytics } from "@/services/useAnalytics";

export const Games: React.FC = () => {
  const [filter, setFilter] = useState<
    "All" | "Live" | "Scheduled" | "Completed"
  >("All");
  const [search, setSearch] = useState("");
  const { data: Game } = useGameAnalytics();
  const gamesList = [
    {
      id: "1",
      gameId: "#RAFFLE-850",
      name: "Cyberpunk Diamond Vault",
      status: "Live",
      prizePool: "$250,000",
      ticketsSold: "18,490",
      maxTickets: "20,000",
      progress: 92,
      imminent: true,
      category: "Major Mega",
    },
    {
      id: "2",
      gameId: "#RAFFLE-851",
      name: "Apex Midnight Sprint",
      status: "Live",
      prizePool: "$45,000",
      ticketsSold: "2,840",
      maxTickets: "5,000",
      progress: 56,
      imminent: false,
      category: "Daily Flash",
    },
    {
      id: "3",
      gameId: "#RAFFLE-852",
      name: "Midweek Supercharge",
      status: "Scheduled",
      prizePool: "$75,000",
      ticketsSold: "0",
      maxTickets: "10,000",
      progress: 0,
      startsIn: "04h 12m",
      category: "Weekly Standard",
    },
    {
      id: "4",
      gameId: "#RAFFLE-849",
      name: "Global Highroller Showdown",
      status: "Completed",
      prizePool: "$500,000",
      ticketsSold: "50,000",
      maxTickets: "50,000",
      progress: 100,
      endedDate: "Aug 28, 2026",
      category: "Special Event",
    },
  ];

  const filteredGames = useMemo(() => {
    return gamesList.filter((g) => {
      const matchFilter = filter === "All" || g.status === filter;

      const matchSearch =
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.gameId.toLowerCase().includes(search.toLowerCase());

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
        <button className="bg-gradient-to-r from-[#1868DB] to-[#1251ad] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:from-[#1456b8] hover:to-[#0f4392] transition-all shadow-[0_4px_16px_rgba(24,104,219,0.35)] w-full sm:w-auto cursor-pointer border border-[#3b82f6]/30">
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
          <div className="w-full bg-[#121214] h-2 rounded-full mt-2.5 overflow-hidden border border-[#26262a]">
            <div className="bg-gradient-to-r from-[#1868DB] to-[#3b82f6] h-full w-[83%] rounded-full shadow-[0_0_10px_rgba(24,104,219,0.5)]" />
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
          {(["All", "Live", "Scheduled", "Completed"] as const).map(
            (status) => (
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
            ),
          )}
        </div>
      </div>

      {/* Games Card Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredGames.map((game) => {
          const isLive = game.status === "Live";
          const isScheduled = game.status === "Scheduled";
          const isCompleted = game.status === "Completed";

          return (
            <div
              key={game.id}
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
                    {game.name}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#8e8e93] bg-[#1a1a1e] px-2.5 py-1 rounded-lg border border-[#26262a]">
                  {game.category}
                </span>
              </div>

              {/* Card Metrics */}
              <div className="p-4 flex-1 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-[#8e8e93] mb-0.5 font-medium">
                    Prize Pool
                  </p>
                  <p className="text-lg text-[#10B981] font-bold font-mono">
                    {game.prizePool}
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
                  <p className="text-base text-white font-mono font-semibold">
                    {isScheduled
                      ? game.startsIn
                      : isCompleted
                        ? game.endedDate
                        : `${game.ticketsSold} / ${game.maxTickets}`}
                  </p>
                </div>

                {isLive && (
                  <div className="col-span-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[11px] text-[#8e8e93]">
                        Progress to Draw
                      </span>
                      <span className="text-xs font-bold font-mono text-[#1868DB]">
                        {game.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-[#121214] h-2 rounded-full overflow-hidden border border-[#26262a]">
                      <div
                        className={`h-full rounded-full ${
                          game.imminent
                            ? "bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                            : "bg-[#1868DB] shadow-[0_0_10px_rgba(24,104,219,0.5)]"
                        }`}
                        style={{ width: `${game.progress}%` }}
                      />
                    </div>
                    {game.imminent && (
                      <p className="text-[10px] text-[#F59E0B] mt-1 text-right font-semibold animate-pulse">
                        Draw Imminent (Capacity &gt; 90%)
                      </p>
                    )}
                  </div>
                )}
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
    </div>
  );
};
export default Games;
