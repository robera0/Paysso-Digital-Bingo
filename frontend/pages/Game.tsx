import { useState, useEffect } from "react";
import CheckoutModal from "../components/CheckoutModal";
import PrizeMarquee from "../components/PrizeMarquee";
import { useGame, useTicket } from "../src/services/api";
import { usePurchaseTicket } from "../src/services/api";
import { toast } from "sonner";
import { useLanguage } from "../src/LanguageContext";
import { translations } from "../src/translations";
import { RefreshCw } from "lucide-react";
import DiceAnimation from "../components/RollingDice";
const Game = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [checkoutNumber, setCheckoutNumber] = useState<number | null>(null);
  const {
    data: gameData,
    isLoading: isGameLoading,
    refetch: refetchGame,
    isRefetching,
  } = useGame();
  const [rolling, setRolling] = useState(false);
  const { data: ticketData, isLoading: ticketIsLoading } = useTicket();
  const { mutate: purchaseTicket, isPending } = usePurchaseTicket();
  const isLoading = isGameLoading || ticketIsLoading;
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].game;

  useEffect(() => {
    if (gameData?.remainingBoxes === 0) {
      setRolling(true);
    }
  }, [gameData?.remainingBoxes]);
  const toggleNumber = (number: number) => {
    setSelectedNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((value) => value !== number)
        : [number],
    );
    setCheckoutNumber(number);
  };

  const handleConfirmPurchase = async () => {
    if (checkoutNumber === null) {
      toast.error(t.selectBoxFirst);
      return;
    }

    if (!gameData?.gameId) {
      toast.error(t.gameDataNotLoaded);
      return;
    }

    purchaseTicket({ boxNumber: checkoutNumber, gameId: gameData.gameId });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        <button
          onClick={toggleLanguage}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {language === "en" ? "አማርኛ" : "English"}
        </button>
      </div>

      {/* Header + Prizes side by side */}
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
        {/* Main header */}
        <section className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {t.featuredDraw}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                {t.description}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
              <p className="text-xs text-center font-medium text-slate-400">
                {t.currentPicks}
              </p>
              <div className="mt-2 flex  items-center justify-center flex-wrap gap-2">
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

        {/* Prize marquee column */}
        <div className="w-full lg:w-64 xl:w-72">
          <PrizeMarquee />
        </div>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-200 p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between px-1 sm:px-2">
          <div>
            <p className="text-xs font-medium text-slate-700">{t.bingoBoard}</p>
            <h2 className="text-lg font-semibold text-black">
              {t.numbersCount}
            </h2>
          </div>
          <button
            type="button"
            disabled={isRefetching}
            onClick={() => {
              setSelectedNumbers([]);
              refetchGame();
            }}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isRefetching ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw
                  size={16}
                  className={isRefetching ? "animate-spin" : ""}
                />

                {t.refresh}
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {isLoading ? (
            Array.from({ length: 50 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="aspect-square animate-pulse rounded-xl border border-slate-700 bg-slate-800/50"
              />
            ))
          ) : gameData?.remainingBoxes === 0 ? (
            <DiceAnimation rolling={rolling} />
          ) : (
            gameData?.boxes?.map((box) => {
              const isSelected = selectedNumbers.includes(box?.boxNumber);
              const ticketForBox = ticketData?.ticket?.find(
                (ticket) => ticket.boxId === box?._id?.toString(),
              );
              const hasActiveTicket = Boolean(
                ticketForBox &&
                (ticketForBox.isVerified ||
                  new Date(ticketForBox.verificationExpiresAt).getTime() >
                    Date.now()),
              );

              const buttonClass = isSelected
                ? "border-green-200 bg-green-600 text-white"
                : box?.isOpened || hasActiveTicket
                  ? "border-green-200 bg-green-600 text-white cursor-not-allowed opacity-80"
                  : "border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700";

              return (
                <button
                  key={box.boxNumber}
                  type="button"
                  disabled={box?.isOpened || isSelected}
                  onClick={() => toggleNumber(box?.boxNumber)}
                  className={`aspect-square rounded-xl border text-sm font-semibold transition-colors duration-200 ${buttonClass}`}
                >
                  {box?.boxNumber}
                </button>
              );
            })
          )}
        </div>
      </section>

      <CheckoutModal
        isOpen={checkoutNumber !== null}
        isPending={isPending}
        onClose={() => setCheckoutNumber(null)}
        onConfirm={handleConfirmPurchase}
        selectedNumber={checkoutNumber}
        price={gameData?.price ?? 50}
      />
    </div>
  );
};

export default Game;
