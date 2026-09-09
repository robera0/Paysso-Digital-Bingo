import React, { useState } from "react";
import {
  Trophy,
  ShoppingCart,
  Clock,
  ShieldCheck,
  Plus,
  Download,
  Wallet,
  TrendingUp,
  Users,
  Radio,
  Ticket,
  Gamepad2,
  ChevronRight,
  BarChart3,
  X,
  Sparkles,
  Activity,
} from "lucide-react";
import { useGameAnalytics, useTicketAnalytics } from "@/services/useAnalytics";
export const Overview: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const { data: Game } = useGameAnalytics();
  const { data: ticket } = useTicketAnalytics();
  const activities = [
    {
      id: "1",
      title: "Game #849 Completed",
      subtitle: "Mega Jackpot ($50,000) concluded with verified seed #98FA",
      time: "10m ago",
      icon: Trophy,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#F59E0B]/10 border-[#F59E0B]/20",
      badge: "Payout Disbursed",
      badgeColor: "text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20",
    },
    {
      id: "2",
      title: "Large Purchase: User #4912",
      subtitle: "Acquired 100 tickets in Weekend Vault #850 ($1,000.00)",
      time: "24m ago",
      icon: ShoppingCart,
      iconColor: "text-[#1868DB]",
      iconBg: "bg-[#1868DB]/10 border-[#1868DB]/20",
      badge: "Confirmed",
      badgeColor: "text-[#1868DB] bg-[#1868DB]/10 border border-[#1868DB]/20",
    },
    {
      id: "3",
      title: "Game #852 Scheduled",
      subtitle: "Midweek Rush configured with $15,000 starting pool",
      time: "1h ago",
      icon: Clock,
      iconColor: "text-[#8e8e93]",
      iconBg: "bg-[#1e1e22] border-[#26262a]",
      badge: "Queued",
      badgeColor: "text-[#8e8e93] bg-[#1e1e22] border border-[#26262a]",
    },
    {
      id: "4",
      title: "Security Clearance Verified",
      subtitle: "Automated anti-sybil audit passed for 142 new registrations",
      time: "2h ago",
      icon: ShieldCheck,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10 border-[#10B981]/20",
      badge: "Audit Clean",
      badgeColor: "text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20",
    },
  ];

  return (
    <div className="p-3.5 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight font-sans">
            Payso Overview
            </h1>
            <Sparkles className="w-5 h-5 text-[#3b82f6] animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-[#8e8e93] mt-1 font-medium">
            Real-time platform metrics, live counters, and recent activity
            telemetry.
          </p>
        </div>
        
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-b from-[#18181c] to-[#141416] border border-[#26262a] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#1868DB]/50 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(24,104,219,0.15)] transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8e8e93] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1a5]">
              Total Revenue
            </span>
            <div className="w-9.5 h-9.5 rounded-xl bg-[#1868DB]/15 flex items-center justify-center border border-[#1868DB]/30 shadow-[0_0_12px_rgba(24,104,219,0.25)] group-hover:scale-105 transition-transform">
              <Wallet className="w-4.5 h-4.5 text-[#3b82f6]" />
            </div>
          </div>
          <div className="text-2.5xl font-black font-mono text-white tracking-tight">
            {ticket?.TotalRevenue[0].totalRevenue}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-[#10B981] font-mono font-bold flex items-center gap-0.5 bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
              <TrendingUp className="w-3.5 h-3.5" /> +12.5%
            </span>
            <span className="text-[#8e8e93]">vs last week</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-b from-[#18181c] to-[#141416] border border-[#26262a] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#10B981]/50 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(16,185,129,0.15)] transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8e8e93] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1a5]">
              Active Users
            </span>
            <div className="w-9.5 h-9.5 rounded-xl bg-[#10B981]/15 flex items-center justify-center border border-[#10B981]/30 shadow-[0_0_12px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform">
              <Users className="w-4.5 h-4.5 text-[#10B981]" />
            </div>
          </div>
          <div className="text-2.5xl font-black font-mono text-white tracking-tight">
            {Game?.ActiveUsers}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-[#10B981] font-mono font-bold flex items-center gap-0.5 bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
              <TrendingUp className="w-3.5 h-3.5" /> +5.2%
            </span>
            <span className="text-[#8e8e93]">daily active</span>
          </div>
        </div>

        {/* Live Games */}
        <div className="bg-gradient-to-b from-[#18181c] to-[#141416] border border-[#26262a] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#F59E0B]/50 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(245,158,11,0.15)] transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8e8e93] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1a5]">
              Live Games
            </span>
            <div className="w-9.5 h-9.5 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center border border-[#F59E0B]/30 shadow-[0_0_12px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform">
              <Radio className="w-4.5 h-4.5 text-[#F59E0B]" />
            </div>
          </div>
          <div className="text-2.5xl font-black font-mono text-white tracking-tight">
            {Game?.activeGame}{" "}
            <span className="text-sm text-[#8e8e93] font-normal">Active</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-[#F59E0B] font-mono font-bold bg-[#F59E0B]/15 px-2.5 py-0.5 rounded-full border border-[#F59E0B]/30 animate-pulse">
              1 imminent draw
            </span>
          </div>
        </div>

        {/* Total Tickets Sold */}
        <div className="bg-gradient-to-b from-[#18181c] to-[#141416] border border-[#26262a] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#3b82f6]/50 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(59,130,246,0.15)] transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8e8e93] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1a5]">
              Tickets Sold
            </span>
            <div className="w-9.5 h-9.5 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center border border-[#3b82f6]/30 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-105 transition-transform">
              <Ticket className="w-4.5 h-4.5 text-[#3b82f6]" />
            </div>
          </div>
          <div className="text-2.5xl font-black font-mono text-white tracking-tight">
            {ticket?.TicketSold}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-[#10B981] font-mono font-bold flex items-center gap-0.5 bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4%
            </span>
            <span className="text-[#8e8e93]">conversion rate</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Velocity & Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics Chart Card */}
        <div className="lg:col-span-2 bg-[#161618] border border-[#26262a] rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Revenue Analytics
              </h2>
              <p className="text-xs text-[#8e8e93] mt-0.5">
                Hourly ticket disbursement volume across all games
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#121214] p-1 rounded-xl border border-[#26262a]">
              <span className="px-2.5 py-1 rounded-lg bg-[#1868DB] text-white text-[10px] font-bold shadow-sm">
                24H
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[#8e8e93] text-[10px] font-semibold hover:text-white cursor-pointer transition-colors">
                7D
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[#8e8e93] text-[10px] font-semibold hover:text-white cursor-pointer transition-colors">
                30D
              </span>
            </div>
          </div>

          {/* Clean Visual Chart Bars */}
          <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 pt-4 px-1 sm:px-2 border-b border-[#26262a] overflow-x-auto min-w-0">
            {[35, 48, 62, 45, 80, 95, 70, 88, 65, 92, 100, 84].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-[#1868DB]/60 to-[#1868DB] hover:from-[#1868DB] hover:to-[#3b82f6] rounded-t-md transition-all shadow-[0_0_8px_rgba(24,104,219,0.3)]"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-[#8e8e93] font-mono">
                  {i * 2}:00
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#8e8e93] pt-1">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#1868DB]" /> Peak
              Traffic: 20:00 UTC ($42,100)
            </span>
            <span className="font-mono text-white font-semibold">
              Average: $26,450/hr
            </span>
          </div>
        </div>

        {/* Quick Actions & System Health */}
        <div className="bg-[#161618] border border-[#26262a] rounded-2xl p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            Quick Management
          </h2>
          <div className="space-y-2.5">
            <button className="w-full p-3 bg-[#121214] hover:bg-[#1c1c20] rounded-xl border border-[#26262a] flex items-center justify-between text-left transition-all group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1868DB]/10 text-[#1868DB] border border-[#1868DB]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-4 h-4 text-[#1868DB]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Create New Raffle
                  </p>
                  <p className="text-[10px] text-[#8e8e93]">
                    Setup prize pools and limits
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8e8e93] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            <button className="w-full p-3 bg-[#121214] hover:bg-[#1c1c20] rounded-xl border border-[#26262a] flex items-center justify-between text-left transition-all group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">User Accounts</p>
                  <p className="text-[10px] text-[#8e8e93]">
                    Manage limits and permissions
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8e8e93] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            <button className="w-full p-3 bg-[#121214] hover:bg-[#1c1c20] rounded-xl border border-[#26262a] flex items-center justify-between text-left transition-all group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Financial Audit
                  </p>
                  <p className="text-[10px] text-[#8e8e93]">
                    Generate revenue reconciliation
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8e8e93] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Activity Feed Table */}
      <div className="bg-[#161618] border border-[#26262a] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#26262a] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Live Telemetry Feed
            </h2>
            <p className="text-xs text-[#8e8e93] mt-0.5">
              Real-time operational events and system actions
            </p>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold border border-[#10B981]/20">
            <Activity className="w-3 h-3 animate-spin text-[#10B981]" />
            <span>LIVE STREAMING</span>
          </div>
        </div>

        <div className="divide-y divide-[#26262a]">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedEvent(item)}
                className="p-4 hover:bg-[#1a1a1e] transition-colors flex items-center justify-between gap-4 cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.iconBg} shrink-0`}
                  >
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex flex-wrap items-center gap-2">
                      <span className="truncate">{item.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-[#8e8e93] font-mono whitespace-nowrap shrink-0">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Preview Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161618] border border-[#26262a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#26262a] bg-[#121214] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Event Telemetry Log
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-[#8e8e93] hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1e] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="p-3.5 bg-[#121214] rounded-xl border border-[#26262a]">
                <span className="text-[10px] text-[#8e8e93] uppercase block font-semibold">
                  Event
                </span>
                <p className="text-sm font-bold text-white mt-1">
                  {selectedEvent.title}
                </p>
                <p className="text-xs text-[#8e8e93] mt-0.5">
                  {selectedEvent.subtitle}
                </p>
              </div>
              <div className="flex justify-between py-2 border-b border-[#26262a]">
                <span className="text-[#8e8e93]">Timestamp:</span>
                <span className="text-white font-mono">
                  {selectedEvent.time}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#26262a]">
                <span className="text-[#8e8e93]">Status Flag:</span>
                <span className="text-[#10B981] font-mono font-semibold">
                  {selectedEvent.badge}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8e8e93]">Verification:</span>
                <span className="text-[#3b82f6] font-mono">
                  0x74a...88cc (SHA256)
                </span>
              </div>
            </div>
            <div className="p-3 bg-[#121214] border-t border-[#26262a] flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
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
export default Overview;
