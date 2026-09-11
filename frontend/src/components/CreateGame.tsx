import { useCreateGame } from "@/services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Trash2, Boxes, Loader2, ImagePlus } from "lucide-react";
import { useMemo, useState } from "react";

export interface PrizePool {
  prizeName: string;
  prize: string;
  amount: string;
  value: string;
  image: File | null;
}

export interface CreateGameProps {
  gameName: string;
  priceBox: string;
  totalBox: string;
  activeAt: string;
  prizePool: PrizePool[];
  onChange: (
    field: "gameName" | "priceBox" | "totalBox" | "activeAt",
    value: string,
  ) => void;
  onPrizeChange: (
    index: number,
    field: "prizeName" | "prize" | "amount" | "value",
    value: string,
  ) => void;
  onPrizeImageChange: (index: number, file: File | null) => void;
  onActiveDateChange: (value: string) => void;
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
  prizeImages?: Array<File | string | null>;
  activeAt?: string | null;
}

export default function CreateGameSessionModal({
  gameName,
  priceBox,
  totalBox,
  activeAt,
  prizePool,
  onChange,
  onPrizeChange,
  onPrizeImageChange,
  onActiveDateChange,
  onAddPrize,
  onRemovePrize,
  onClose,
}: CreateGameProps) {
  const { mutate: gameMutation, isPending: isCreatingGame } = useCreateGame();
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);

  const currentPrize = prizePool[currentPrizeIndex] ?? prizePool[0];
  const totalSteps = Math.max(1, prizePool.length);
  const isLastPrize = currentPrizeIndex === prizePool.length - 1;

  const previewUrl = useMemo(() => {
    if (!currentPrize?.image) return null;
    return URL.createObjectURL(currentPrize.image);
  }, [currentPrize?.image]);

  const handleCreateGame = () => {
    const numericPrice = Number(priceBox);
    const numericTotalBox = Number(totalBox);

    const normalizedPrize = prizePool
      .slice(0, 3)
      .map((item) => item.prize || item.prizeName || "Prize");
    const normalizedValue = Array.from({ length: 4 }, (_, index) => {
      const value = prizePool[index]?.value ?? "0";
      return Number(value) || 0;
    });

    const formData = new FormData();
    formData.append("gameName", gameName.trim());
    formData.append("price", String(numericPrice));
    formData.append("boxNumber", String(numericTotalBox));
    normalizedPrize.forEach((item) => formData.append("prize", item));
    normalizedValue.forEach((item) => formData.append("value", String(item)));

    prizePool.forEach((item) => {
      if (item.image) {
        formData.append("prizeImages", item.image);
      }
    });

    if (activeAt) {
      formData.append("activeAt", activeAt);
    }

    gameMutation(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161618] border border-[#26262a] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
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
          <div className="flex items-center justify-between rounded-xl border border-[#26262a] bg-[#121214] p-2.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e8e93]">
              Prize setup
            </span>
            <span className="text-[11px] font-semibold text-[#3b82f6]">
              {currentPrizeIndex + 1}/{totalSteps}
            </span>
          </div>

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

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-bold">
              Active date
            </label>
            <DatePicker
              selected={activeAt ? new Date(activeAt) : null}
              onChange={(date: Date | null) =>
                onActiveDateChange(date ? date.toISOString() : "")
              }
              dateFormat="dd MMM yyyy"
              minDate={new Date()}
              className="w-full rounded-xl border border-[#26262a] bg-[#121214] px-3 py-2.5 text-sm text-white focus:border-[#3b82f6] focus:outline-none transition-colors"
              placeholderText="Choose a date"
              popperClassName="react-datepicker-dark"
              calendarClassName="dark-datepicker"
              wrapperClassName="w-full"
              showPopperArrow={false}
              isClearable={false}
            />
          </div>

          <div className="rounded-2xl border border-[#26262a] bg-[#121214] p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8e8e93]">
                Prize {currentPrizeIndex + 1}
              </h4>
              <button
                type="button"
                className="text-[10px] font-semibold text-[#3b82f6]"
                onClick={() => onAddPrize()}
              >
                Add prize
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                <input
                  value={currentPrize?.prizeName ?? ""}
                  onChange={(e) =>
                    onPrizeChange(
                      currentPrizeIndex,
                      "prizeName",
                      e.target.value,
                    )
                  }
                  placeholder="Prize name"
                  className="w-full bg-[#1a1a1e] border border-[#26262a] rounded-xl px-3 py-2.5 text-white text-[11px]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={currentPrize?.amount ?? ""}
                    onChange={(e) =>
                      onPrizeChange(currentPrizeIndex, "amount", e.target.value)
                    }
                    placeholder="Amount"
                    className="w-full bg-[#1a1a1e] border border-[#26262a] rounded-xl px-3 py-2.5 text-[#10B981] font-mono text-[11px]"
                  />
                  <input
                    value={currentPrize?.value ?? ""}
                    onChange={(e) =>
                      onPrizeChange(currentPrizeIndex, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="w-full bg-[#1a1a1e] border border-[#26262a] rounded-xl px-3 py-2.5 text-white font-mono text-[11px]"
                  />
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-dashed border-[#3b82f6]/60 bg-[#111827]/20 px-3 py-2.5 text-white transition-colors hover:border-[#3b82f6]">
                  <span className="truncate text-[11px] text-[#d4d4d8]">
                    {currentPrize?.image
                      ? currentPrize.image.name
                      : "Upload prize image"}
                  </span>
                  <ImagePlus className="h-4 w-4 text-[#3b82f6]" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      onPrizeImageChange(
                        currentPrizeIndex,
                        event.target.files && event.target.files[0]
                          ? event.target.files[0]
                          : null,
                      )
                    }
                  />
                </label>
              </div>

              <div className="flex items-center justify-center rounded-2xl border border-[#26262a] bg-[#121214] p-2.5">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Prize preview"
                    className="h-32 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#26262a] text-[#8e8e93]">
                    <ImagePlus className="mb-2 h-5 w-5" />
                    <span>Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {prizePool.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-xl border px-2.5 py-2 ${
                  index === currentPrizeIndex
                    ? "border-[#3b82f6]/60 bg-[#0f172a]"
                    : "border-[#26262a] bg-[#121214]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a1e] text-[10px] font-bold text-[#8e8e93]">
                    {index + 1}
                  </span>
                  <span className="text-[11px] text-white">
                    {item.prizeName || `Prize ${index + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.image && (
                    <span className="text-[10px] text-[#10B981]">
                      Image ready
                    </span>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => onRemovePrize(index)}
                      className="text-[#8e8e93] hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isLastPrize && (
            <div className="rounded-xl border border-[#26262a] bg-[#121214] p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#8e8e93]">
                Preview summary
              </p>
              <div className="grid grid-cols-1 gap-2">
                {prizePool.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg bg-[#1a1a1e] p-2"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-lg border border-[#26262a] bg-[#121214]">
                      {item.image ? (
                        <img
                          src={URL.createObjectURL(item.image)}
                          alt={item.prizeName || `Prize ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] text-[#8e8e93]">
                          IMG
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-white">
                        {item.prizeName || `Prize ${index + 1}`}
                      </p>
                      <p className="text-[10px] text-[#8e8e93]">
                        {item.amount || "0"} / {item.value || "0"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#26262a] bg-[#121214] flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1a1a1e] hover:bg-[#222226] text-[#8e8e93] hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (isLastPrize) {
                handleCreateGame();
                return;
              }
              setCurrentPrizeIndex((value) =>
                Math.min(value + 1, prizePool.length - 1),
              );
            }}
            className="px-4 py-2 bg-[#1868DB] hover:bg-[#1456b8] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin hidden" />
            {isCreatingGame
              ? "Creating..."
              : isLastPrize
                ? "Create Game"
                : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
