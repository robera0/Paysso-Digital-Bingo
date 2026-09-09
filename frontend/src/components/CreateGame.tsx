import { useCreateGame } from "@/services/api";
import { X, Plus, Trash2, Boxes, Loader2 } from "lucide-react";

export interface PrizePool {
  prizeName: string;
  prize: string;
  amount: string;
  value: string;
}

export interface CreateGameProps {
  gameName: string;
  priceBox: string;
  totalBox: string;
  prizePool: PrizePool[];
  onChange: (field: "gameName" | "priceBox" | "totalBox", value: string) => void;
  onPrizeChange: (index: number, field: keyof PrizePool, value: string) => void;
  onAddPrize: () => void;
  onRemovePrize: (index: number) => void;
  onClose: () => void;
}

export interface CreateGamePayload {
  gameName: string;
  price: number;
  boxNumber: number;
  prize: string[];
  value: number[];
}

export default function CreateGameSessionModal({
  gameName,
  priceBox,
  totalBox,
  prizePool,
  onChange,
  onPrizeChange,
  onAddPrize,
  onRemovePrize,
  onClose,
}: CreateGameProps) {
  const { mutate: gameMutation, isPending: isCreatingGame } = useCreateGame();

  const handleCreateGame = () => {
    
    const numericPrice = Number(priceBox);
    const numericTotalBox = Number(totalBox);

    

   

    const normalizedPrize = prizePool.slice(0, 3).map((item) => item.prize || item.prizeName || "Prize");
    const normalizedValue = Array.from({ length: 4 }, (_, index) => {
      const value = prizePool[index]?.value ?? "0";
      return Number(value) || 0;
    });

    const payload: CreateGamePayload = {
      gameName: gameName.trim(),
      price: numericPrice,
      boxNumber: numericTotalBox,
      prize: normalizedPrize,
      value: normalizedValue,
    };

    gameMutation(payload);
  
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161618] border border-[#26262a] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-[#26262a] bg-[#121214] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1868DB]/15 flex items-center justify-center">
              <Boxes className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                PayssoBingo Box Game
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e8e93] hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          <div>
            <label className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-bold">
              Game Name
            </label>
            <input
              value={gameName}
              onChange={(e) => onChange("gameName", e.target.value)}
              placeholder="Game name"
              className="w-full bg-[#121214] border border-[#26262a] rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-bold">
                Price per box
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={priceBox}
                onChange={(e) => onChange("priceBox", e.target.value)}
                className="w-full bg-[#121214] border border-[#26262a] rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#3b82f6] transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-bold">
                Total boxes
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={totalBox}
                onChange={(e) => onChange("totalBox", e.target.value)}
                className="w-full bg-[#121214] border border-[#26262a] rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#3b82f6] transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-bold">
                Prize pool
              </label>
              <button
                type="button"
                onClick={onAddPrize}
                className="flex items-center gap-1 text-[11px] text-[#3b82f6] hover:text-[#5a9bf5] font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add prize
              </button>
            </div>

            {prizePool.map((item, index) => (
              <div
                key={index}
                className="bg-[#121214] border border-[#26262a] rounded-xl p-2.5 flex items-center gap-2"
              >
                <input
                  value={item.prizeName}
                  onChange={(e) => onPrizeChange(index, "prizeName", e.target.value)}
                  placeholder="Prize name"
                  className="flex-1 min-w-0 bg-[#1a1a1e] border border-[#26262a] rounded-lg px-2 py-1.5 text-white text-[11px]"
                />

                <input
                  value={item.prize}
                  onChange={(e) => onPrizeChange(index, "prize", e.target.value)}
                  placeholder="Prize"
                  className="bg-[#1a1a1e] border border-[#26262a] rounded-lg px-1.5 py-1.5 text-white text-[11px]"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  value={item.amount}
                  onChange={(e) => onPrizeChange(index, "amount", e.target.value)}
                  placeholder="Amount"
                  className="w-16 bg-[#1a1a1e] border border-[#26262a] rounded-lg px-2 py-1.5 text-[#10B981] font-mono text-[11px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  value={item.value}
                  onChange={(e) => onPrizeChange(index, "value", e.target.value)}
                  placeholder="Value"
                  className="w-14 bg-[#1a1a1e] border border-[#26262a] rounded-lg px-2 py-1.5 text-white font-mono text-[11px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <button type="button" onClick={() => onRemovePrize(index)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#121214] border border-[#26262a] rounded-xl p-3 text-center space-y-0.5">
              <span className="text-[9px] text-[#8e8e93] uppercase tracking-wider font-bold">
                Pool value
              </span>
              <div className="text-sm font-mono font-bold text-[#10B981]">
                5,000
              </div>
            </div>
            <div className="bg-[#121214] border border-[#26262a] rounded-xl p-3 text-center space-y-0.5">
              <span className="text-[9px] text-[#8e8e93] uppercase tracking-wider font-bold">
                Prize boxes
              </span>
              <div className="text-sm font-mono font-bold text-white">
                {prizePool.length}
              </div>
            </div>
            <div className="bg-[#121214] border border-[#26262a] rounded-xl p-3 text-center space-y-0.5">
              <span className="text-[9px] text-[#8e8e93] uppercase tracking-wider font-bold">
                Empty boxes
              </span>
              <div className="text-sm font-mono font-bold text-[#8e8e93]">
                {Number(totalBox || 0) - prizePool.length}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#26262a] bg-[#121214] flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1a1a1e] hover:bg-[#222226] text-[#8e8e93] hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGame}
            className="px-4 py-2 bg-[#1868DB] hover:bg-[#1456b8] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin hidden" />
            {isCreatingGame ? "Creating..." : "Create Game"}
          </button>
        </div>
      </div>
    </div>
  );
}
