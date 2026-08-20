import { useState, useEffect } from "react";
import { useLanguage } from "../src/LanguageContext";
import { translations } from "../src/translations";

interface Prize {
  image: string;
  label: string;
  gradient: string;
  borderColor: string;
}

const PrizeMarquee = () => {
  const { language } = useLanguage();
  const t = translations[language].prizes;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const prizes: Prize[] = [
    {
      image: "/prize-1.png",
      label: t.firstPrize,
      gradient: "from-green-500/15 to-green-400/5",
      borderColor: "border-green-400/40",
    },
    {
      image: "/prize-2.png",
      label: t.secondPrize,
      gradient: "from-slate-400/15 to-slate-300/5",
      borderColor: "border-slate-400/40",
    },
    {
      image: "/prize-3.png",
      label: t.thirdPrize,
      gradient: "from-yellow-500/15 to-yellow-400/5",
      borderColor: "border-yellow-400/40",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // After fade-out completes, switch prize and fade in
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % prizes.length);
        setIsVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [prizes.length]);

  const prize = prizes[activeIndex];

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm">
      {/* Prize card with fade transition */}
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-3 p-4 transition-all duration-400 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${prize.gradient} ${prize.borderColor} p-3`}>
          <img
          loading="lazy"
            src={prize.image}
            alt={prize.label}
            className="h-20 w-20 rounded-xl object-contain sm:h-24 sm:w-24"
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 sm:text-sm">
          {prize.label}
        </span>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-1.5 pb-3">
        {prizes.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setActiveIndex(index);
                setIsVisible(true);
              }, 300);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-4 bg-slate-700"
                : "w-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PrizeMarquee;
