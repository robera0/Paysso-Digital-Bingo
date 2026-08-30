import React, { useState } from 'react';
import { Search, X, Receipt } from 'lucide-react';

export const History: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'FAILED'>('ALL');
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  const transactions = [
    {
      id: '1',
      timestamp: '2026-08-30 18:24:10',
      txnId: 'TXN-904128',
      userId: 'USR-8821',
      gameName: 'Cyber Diamond Vault',
      tickets: 50,
      totalAmount: '$500.00',
      status: 'CONFIRMED',
    },
    {
      id: '2',
      timestamp: '2026-08-30 18:19:44',
      txnId: 'TXN-904127',
      userId: 'USR-3419',
      gameName: 'Apex Midnight Sprint',
      tickets: 10,
      totalAmount: '$100.00',
      status: 'CONFIRMED',
    },
    {
      id: '3',
      timestamp: '2026-08-30 18:12:02',
      txnId: 'TXN-904126',
      userId: 'USR-7710',
      gameName: 'Cyber Diamond Vault',
      tickets: 5,
      totalAmount: '$50.00',
      status: 'PENDING',
    },
    {
      id: '4',
      timestamp: '2026-08-30 17:58:33',
      txnId: 'TXN-904125',
      userId: 'USR-9024',
      gameName: 'Weekend Gold Rush',
      tickets: 20,
      totalAmount: '$200.00',
      status: 'CONFIRMED',
    },
    {
      id: '5',
      timestamp: '2026-08-30 17:40:19',
      txnId: 'TXN-904124',
      userId: 'USR-1102',
      gameName: 'Apex Midnight Sprint',
      tickets: 15,
      totalAmount: '$150.00',
      status: 'FAILED',
    },
  ];

  const filteredTxns = transactions.filter((t) => {
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchSearch =
      t.txnId.toLowerCase().includes(search.toLowerCase()) ||
      t.userId.toLowerCase().includes(search.toLowerCase()) ||
      t.gameName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-3.5 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight font-sans">
              Purchase History
            </h1>
            <Receipt className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <p className="text-xs sm:text-sm text-[#8e8e93] mt-1 font-medium">
            Detailed ledger of all ticket orders, checkout settlements, and audit records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93]" />
            <input
              type="text"
              placeholder="Search Txn ID, User, Game..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121214] border border-[#26262a] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#6e6e73] focus:border-[#1868DB] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap bg-[#121214] p-1 rounded-xl border border-[#26262a] w-full sm:w-auto">
            {(['ALL', 'CONFIRMED', 'PENDING', 'FAILED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-[#1868DB] text-white shadow-sm' : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#161618] border border-[#26262a] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#121214] border-b border-[#26262a] text-[#8e8e93] font-sans font-bold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Txn ID</th>
                <th className="px-4 py-3.5">User ID</th>
                <th className="px-4 py-3.5">Game Name</th>
                <th className="px-4 py-3.5 text-right">Tickets</th>
                <th className="px-4 py-3.5 text-right">Total</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26262a] text-white">
              {filteredTxns.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTxn(tx)}
                  className="hover:bg-[#1a1a1e] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5 text-[#8e8e93] whitespace-nowrap">{tx.timestamp}</td>
                  <td className="px-4 py-3.5 font-bold text-white">{tx.txnId}</td>
                  <td className="px-4 py-3.5 text-[#3b82f6] font-semibold">{tx.userId}</td>
                  <td className="px-4 py-3.5 font-sans font-semibold">{tx.gameName}</td>
                  <td className="px-4 py-3.5 text-right font-semibold">{tx.tickets}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-[#10B981]">{tx.totalAmount}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        tx.status === 'CONFIRMED'
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                          : tx.status === 'PENDING'
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                          : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-[#121214] border-t border-[#26262a] px-4 py-3 flex items-center justify-between text-xs text-[#8e8e93]">
          <span>Showing 1-{filteredTxns.length} of 1,248 transactions</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded-lg bg-[#1868DB] text-white font-bold">1</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[#1a1a1e] text-[#8e8e93] hover:text-white transition-colors">2</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[#1a1a1e] text-[#8e8e93] hover:text-white transition-colors">3</button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161618] border border-[#26262a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#26262a] bg-[#121214] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#8e8e93] font-semibold">Transaction Audit</span>
                <h3 className="text-base font-bold text-white font-mono">{selectedTxn.txnId}</h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-[#8e8e93] hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1e] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="p-3.5 bg-[#121214] rounded-xl border border-[#26262a] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#8e8e93] uppercase font-semibold">Amount Paid</span>
                  <p className="text-lg font-bold font-mono text-white">{selectedTxn.totalAmount}</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  {selectedTxn.status}
                </span>
              </div>
              <div className="space-y-2 bg-[#121214] p-3.5 rounded-xl border border-[#26262a]">
                <div className="flex justify-between border-b border-[#26262a] pb-2">
                  <span className="text-[#8e8e93]">User Account:</span>
                  <span className="text-[#3b82f6] font-mono font-semibold">{selectedTxn.userId}</span>
                </div>
                <div className="flex justify-between border-b border-[#26262a] pb-2">
                  <span className="text-[#8e8e93]">Target Game:</span>
                  <span className="text-white font-semibold">{selectedTxn.gameName}</span>
                </div>
                <div className="flex justify-between border-b border-[#26262a] pb-2">
                  <span className="text-[#8e8e93]">Tickets Bought:</span>
                  <span className="text-white font-mono">{selectedTxn.tickets} entries</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#8e8e93]">Timestamp:</span>
                  <span className="text-white font-mono">{selectedTxn.timestamp}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#26262a] bg-[#121214] flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 bg-[#1868DB] hover:bg-[#1456b8] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default History;
