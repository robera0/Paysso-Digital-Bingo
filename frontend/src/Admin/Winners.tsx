import React, { useState } from 'react';
import { Search, Filter, FileText, X, Trophy } from 'lucide-react';

export const Winners: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<any | null>(null);

  const winnersList = [
    {
      id: '1',
      winnerId: 'WIN-9901',
      name: 'Elena Rostova',
      username: '@elena_r',
      avatarInitials: 'ER',
      gameName: 'Cyber Diamond Vault',
      gameId: '#RAFFLE-849',
      prizeWon: '$250,000.00',
      date: 'Aug 28, 2026',
      time: '18:45 UTC',
      hash: '0x88f...921a',
      status: 'Paid',
    },
    {
      id: '2',
      winnerId: 'WIN-9902',
      name: 'Marcus Vance',
      username: '@vance_apex',
      avatarInitials: 'MV',
      gameName: 'Weekend Gold Rush',
      gameId: '#RAFFLE-848',
      prizeWon: '$50,000.00',
      date: 'Aug 27, 2026',
      time: '21:10 UTC',
      hash: '0x12a...77cd',
      status: 'Paid',
    },
    {
      id: '3',
      winnerId: 'WIN-9903',
      name: 'Aria Chen',
      username: '@ariachen',
      avatarInitials: 'AC',
      gameName: 'Midnight Sprint #14',
      gameId: '#RAFFLE-847',
      prizeWon: '$15,000.00',
      date: 'Aug 26, 2026',
      time: '00:04 UTC',
      hash: '0x99b...44ee',
      status: 'Paid',
    },
    {
      id: '4',
      winnerId: 'WIN-9904',
      name: 'Darius Thorne',
      username: '@thorne_d',
      avatarInitials: 'DT',
      gameName: 'Starter Surge #9',
      gameId: '#RAFFLE-846',
      prizeWon: '$5,000.00',
      date: 'Aug 25, 2026',
      time: '14:22 UTC',
      hash: '0x33e...11aa',
      status: 'Paid',
    },
  ];

  const filteredWinners = winnersList.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.gameName.toLowerCase().includes(search.toLowerCase()) ||
      w.winnerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3.5 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight font-sans">
              Winners Chronicle
            </h1>
            <Trophy className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <p className="text-xs sm:text-sm text-[#8e8e93] mt-1 font-medium">
            Historical record of all certified game victors and prize distributions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93]" />
            <input
              type="text"
              placeholder="Search winner or raffle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121214] border border-[#26262a] rounded-xl text-white pl-9 pr-3 py-2 text-xs focus:border-[#1868DB] focus:outline-none transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-1.5 px-4 py-2 border border-[#26262a] bg-[#161618] rounded-xl text-[#8e8e93] hover:text-white hover:bg-[#222226] transition-all text-xs font-semibold w-full sm:w-auto cursor-pointer">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Winners Table */}
      <div className="bg-[#161618] rounded-2xl border border-[#26262a] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121214] border-b border-[#26262a] text-xs font-bold text-[#8e8e93] uppercase tracking-wider">
                <th className="p-4">Winner</th>
                <th className="p-4">Game Event</th>
                <th className="p-4">Prize Won</th>
                <th className="p-4">Date &amp; Time</th>
                <th className="p-4 text-right">Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26262a] text-xs text-white">
              {filteredWinners.map((winner) => (
                <tr
                  key={winner.id}
                  onClick={() => setSelectedWinner(winner)}
                  className="hover:bg-[#1a1a1e] transition-colors cursor-pointer"
                >
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1868DB]/20 to-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] font-bold text-xs border border-[#1868DB]/30 shadow-sm">
                        {winner.avatarInitials}
                      </div>
                      <div>
                        <div className="font-bold text-white">{winner.name}</div>
                        <div className="text-[11px] text-[#8e8e93] mt-0.5">{winner.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-white font-semibold">{winner.gameName}</div>
                    <div className="text-[11px] text-[#1868DB] font-mono mt-0.5">{winner.gameId}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap font-mono text-[#10B981] font-bold text-sm">
                    {winner.prizeWon}
                  </td>
                  <td className="p-4 whitespace-nowrap font-mono text-[#8e8e93]">
                    <div>{winner.date}</div>
                    <div className="text-[11px] text-[#6e6e73]">{winner.time}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWinner(winner);
                      }}
                      className="text-[#3b82f6] hover:text-white p-2 rounded-lg hover:bg-[#1868DB]/20 transition-colors"
                      title="View Voucher"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="bg-[#121214] p-4 border-t border-[#26262a] flex items-center justify-between text-xs text-[#8e8e93]">
          <span>Showing 1-4 of 1,204 winners</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded-lg bg-[#1868DB] text-white font-bold">1</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[#1a1a1e] text-[#8e8e93] hover:text-white transition-colors">2</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[#1a1a1e] text-[#8e8e93] hover:text-white transition-colors">3</button>
          </div>
        </div>
      </div>

      {/* Winner Voucher Modal */}
      {selectedWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161618] border border-[#26262a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#26262a] bg-[#121214] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#8e8e93] uppercase font-semibold">Certificate #{selectedWinner.winnerId}</span>
                <h3 className="text-base font-bold text-white">Disbursement Voucher</h3>
              </div>
              <button
                onClick={() => setSelectedWinner(null)}
                className="text-[#8e8e93] hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1e] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-[#121214] rounded-xl border border-[#26262a] text-center space-y-1">
                <span className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-bold">Certified Prize Amount</span>
                <div className="text-2xl font-mono font-bold text-[#10B981]">{selectedWinner.prizeWon}</div>
                <span className="text-[11px] text-[#3b82f6] font-medium">{selectedWinner.gameName}</span>
              </div>
              <div className="space-y-2 bg-[#121214] p-3.5 rounded-xl border border-[#26262a]">
                <div className="flex justify-between border-b border-[#26262a] pb-2">
                  <span className="text-[#8e8e93]">Beneficiary:</span>
                  <span className="text-white font-bold">{selectedWinner.name} ({selectedWinner.username})</span>
                </div>
                <div className="flex justify-between border-b border-[#26262a] pb-2">
                  <span className="text-[#8e8e93]">Concluded Date:</span>
                  <span className="text-white font-mono">{selectedWinner.date}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#8e8e93]">Disbursement Hash:</span>
                  <span className="text-[#3b82f6] font-mono">{selectedWinner.hash}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#26262a] bg-[#121214] flex justify-end gap-2">
              <button
                onClick={() => setSelectedWinner(null)}
                className="px-4 py-2 bg-[#1868DB] hover:bg-[#1456b8] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Winners;
