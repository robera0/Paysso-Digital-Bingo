import React, { useEffect, useRef, useState, useCallback } from "react";
import { Hand, Award } from "lucide-react";

export interface Prize {
  id: string;
  name: string;
  amharicName: string;
  emoji: string;
  color: string;
  textColor: string;
  probability: number;
}

const PRIZES: Prize[] = [
  {
    id: "freespin",
    name: "FREE SPIN",
    amharicName: "ነጻ ዕጣ",
    emoji: "🎁",
    color: "#4F46E5",
    textColor: "#FFFFFF",
    probability: 30,
  },
  {
    id: "ethio",
    name: "ETHIO TELECOM",
    amharicName: "ኢትዮ ቴሌኮም",
    emoji: "📱",
    color: "#059669",
    textColor: "#FFFFFF",
    probability: 10,
  },
  {
    id: "surprise",
    name: "SURPRISE BOX",
    amharicName: "ድንቅ ሳጥን",
    emoji: "🎉",
    color: "#D97706",
    textColor: "#FFFFFF",
    probability: 15,
  },
  {
    id: "bonus",
    name: "100 ETB BONUS",
    amharicName: "100 ብር ቦነስ",
    emoji: "💰",
    color: "#0284C7",
    textColor: "#FFFFFF",
    probability: 10,
  },
  {
    id: "thankyou",
    name: "THANK YOU",
    amharicName: "እናመሰግናለን",
    emoji: "🙏",
    color: "#475569",
    textColor: "#F8FAFC",
    probability: 20,
  },
  {
    id: "ticket",
    name: "BINGO TICKET",
    amharicName: "ቢንጎ ቲኬት",
    emoji: "🎟️",
    color: "#7C3AED",
    textColor: "#FFFFFF",
    probability: 15,
  },
];

const FEATURED_PRIZES = [
  { emoji: "📱", title: "Ethio Telecom", subtitle: "10GB + 300 Min" },
  { emoji: "💰", title: "100 ETB Bonus", subtitle: "Direct Telebirr" },
  { emoji: "🎉", title: "Surprise Box", subtitle: "Instant Gadgets" },
  { emoji: "🎟️", title: "Bingo Ticket", subtitle: "Free Entry Card" },
];

const CANVAS_SIZE = 600;
const CENTER = CANVAS_SIZE / 2;
const WHEEL_RADIUS = 280;
const HUB_RADIUS = 36; // Scaled down center circle for a tighter, professional footprint

interface SpinWheelProps {
  language?: "en" | "am";
  onResult?: (prize: Prize) => void;
}

function selectPrizeByWeightedOdds(): number {
  const random = Math.random() * 100;
  let cumulative = 0;
  for (let i = 0; i < PRIZES.length; i++) {
    cumulative += PRIZES[i].probability;
    if (random < cumulative) return i;
  }
  return PRIZES.length - 1;
}

const SpinGame = ({ language = "en", onResult }: SpinWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef<number>(0);
  const spinningRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickSegmentRef = useRef<number>(-1);

  const [spinning, setSpinning] = useState<boolean>(false);

  const segmentAngle = (Math.PI * 2) / PRIZES.length;

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  const playTickSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio is non-critical / best-effort
    }
  }, [getAudioContext]);

  const playWinFanfare = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") ctx.resume();
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.08;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.38);
      });
    } catch {
      // Audio is non-critical / best-effort
    }
  }, [getAudioContext]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    ctx.translate(CENTER, CENTER);
    ctx.rotate(rotationRef.current);

    // 1. Draw Segments
    for (let i = 0; i < PRIZES.length; i++) {
      const prize = PRIZES[i];
      const startAngle = -Math.PI / 2 + i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, WHEEL_RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Sector Label & Emoji
      const midAngle = startAngle + segmentAngle / 2;
      const textRadius = WHEEL_RADIUS * 0.65;
      const textX = Math.cos(midAngle) * textRadius;
      const textY = Math.sin(midAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      let textRotation = midAngle + Math.PI / 2;
      if (textRotation > Math.PI / 2 && textRotation < (Math.PI * 3) / 2) {
        textRotation += Math.PI;
      }
      ctx.rotate(textRotation);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Render Emoji
      ctx.font = "32px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
      ctx.fillText(prize.emoji, 0, -18);

      // Render Typography
      ctx.fillStyle = prize.textColor;
      ctx.font = "800 13px system-ui, -apple-system, sans-serif";
      const label = language === "am" ? prize.amharicName : prize.name;

      if (label.includes(" ")) {
        const words = label.split(" ");
        ctx.fillText(words[0], 0, 10);
        ctx.font = "700 11px system-ui, -apple-system, sans-serif";
        ctx.fillText(words.slice(1).join(" "), 0, 24);
      } else {
        ctx.fillText(label, 0, 12);
      }

      ctx.restore();
    }

    // 2. Draw Compact Center Hub
    ctx.beginPath();
    ctx.arc(0, 0, HUB_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#0F172A"; // Slate-900 border accent
    ctx.stroke();

    ctx.restore();
  }, [language, segmentAngle]);

  useEffect(() => {
    drawWheel();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawWheel]);

  const handleSpin = () => {
    if (spinningRef.current) return;

    spinningRef.current = true;
    setSpinning(true);

    const winningIndex = selectPrizeByWeightedOdds();
    const winningPrize = PRIZES[winningIndex];

    // Compute pointer offset (-Math.PI / 2 corresponds to top center indicator)
    const prizeCenterAngle =
      -Math.PI / 2 + winningIndex * segmentAngle + segmentAngle / 2;
    const targetPointerAngle = -Math.PI / 2;

    let deltaRotation =
      targetPointerAngle - prizeCenterAngle - rotationRef.current;
    deltaRotation =
      ((deltaRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    const fullSpins = 5 + Math.floor(Math.random() * 2);
    const totalRotationIncrement = deltaRotation + fullSpins * Math.PI * 2;

    const startRotation = rotationRef.current;
    const finalRotation = startRotation + totalRotationIncrement;
    const duration = 5000;
    const startTime = performance.now();
    lastTickSegmentRef.current = -1;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quintic ease-out function
      const easedProgress = 1 - Math.pow(1 - progress, 5);

      rotationRef.current =
        startRotation + totalRotationIncrement * easedProgress;

      // Calculate tick interval crossing
      const currentNormalizedAngle =
        ((rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const currentSegmentIndex = Math.floor(
        (currentNormalizedAngle / (Math.PI * 2)) * PRIZES.length,
      );

      if (
        currentSegmentIndex !== lastTickSegmentRef.current &&
        progress < 0.98
      ) {
        playTickSound();
        lastTickSegmentRef.current = currentSegmentIndex;
      }

      drawWheel();

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = finalRotation;
        drawWheel();

        if (winningPrize.id !== "thankyou") {
          playWinFanfare();
        }

        spinningRef.current = false;
        setSpinning(false);
        onResult?.(winningPrize);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 px-3 select-none">
      {/* Main Wheel Container */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col items-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
          {/* Top Pointer Needle */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center filter drop-shadow-md">
            <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-slate-900 -mt-1.5" />
          </div>

          {/* Wheel Frame Canvas */}
          <div className="w-full h-full rounded-full p-1.5 bg-slate-900 ring-4 ring-slate-100 shadow-xl flex items-center justify-center relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="w-full h-full rounded-full"
            />

            {/* Centered Spin Trigger Button */}
            <button
              type="button"
              onClick={handleSpin}
              disabled={spinning}
              className="absolute z-20 w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-xs tracking-wider border-2 border-white shadow-md flex flex-col items-center justify-center transition-all disabled:opacity-90 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-[10px] uppercase font-black text-amber-400">
                {spinning ? "..." : language === "am" ? "አሽከርክር" : "SPIN"}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Instructional Callout */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2">
          <Hand size={14} className="text-indigo-600 shrink-0" />
          <span>
            {language === "am"
              ? "መንኰራኵሩን ለማሽከርከር መሃሉን ይጫኑ"
              : "Tap SPIN in the center to test your luck"}
          </span>
        </div>
      </div>

      {/* Prize Pool Display */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Award size={15} className="text-amber-500" />
            <span>
              {language === "am" ? "ሽልማቶች እና ዕድሎች" : "Prize Pool & Odds"}
            </span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">
            {PRIZES.length} Segments
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {FEATURED_PRIZES.map((item) => (
            <div
              key={item.title}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 min-w-0"
            >
              <span className="text-lg shrink-0">{item.emoji}</span>
              <div className="leading-tight min-w-0">
                <div className="font-bold text-slate-800 truncate">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {item.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpinGame;
