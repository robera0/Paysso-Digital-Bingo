import { useState } from "react";
import CheckoutModal from "../components/CheckoutModal";
import { useGame } from "../src/services/api";
import { useTicket } from "../src/services/api";
import type { TicketApiResponse } from "../src/services/api";

const Game = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [checkoutNumber, setCheckoutNumber] = useState<number | null>(null);
  const { data: gameData } = useGame();
  const { data: ticketData } = useTicket();

  const toggleNumber = (number: number) => {
    setCheckoutNumber(number);
  };

  const handleConfirmPurchase = () => {
    if (checkoutNumber !== null && !selectedNumbers.includes(checkoutNumber)) {
      setSelectedNumbers((current) =>
        [...current, checkoutNumber].sort((a, b) => a - b),
      );
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Featured draw
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Pick your lucky numbers with style
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Tap any square to highlight it, build your favorite set, and enjoy
              a more polished bingo experience.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
            <p className="text-xs font-medium text-slate-400">Current picks</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedNumbers.slice(0, 6).map((number) => (
                <span
                  key={number}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-sm font-semibold text-slate-100"
                >
                  {number}
                </span>
              ))}
              {selectedNumbers.length > 6 && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-sm font-semibold text-slate-300">
                  +{selectedNumbers.length - 6}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-200 p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between px-1 sm:px-2">
          <div>
            <p className="text-xs font-medium text-slate-700">Bingo board</p>
            <h2 className="text-lg font-semibold text-black">100 numbers</h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNumbers([])}
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {gameData?.boxes?.map((box) => {
            const isSelected = selectedNumbers.includes(box?.boxNumber);
            return (
              <button
                key={box.boxNumber}
                type="button"
                disabled={box.isOpened}
                onClick={() => toggleNumber(box?.boxNumber)}
                className={`aspect-square rounded-xl border text-sm font-semibold transition-colors duration-200 ${
                  isSelected || box?.isOpened
                    ? "border-green-200 bg-green-600 text-white"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700"
                }`}
              >
                {box?.boxNumber}
              </button>
            );
          })}
        </div>
      </section>

      <CheckoutModal
        isOpen={checkoutNumber !== null}
        onClose={() => setCheckoutNumber(null)}
        onConfirm={handleConfirmPurchase}
        selectedNumber={checkoutNumber}
      />
    </div>
  );
};

export default Game;
