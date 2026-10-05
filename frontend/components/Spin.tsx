import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCheck,
  Gift,
  HandHeart,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Prize configuration                                                       */
/* -------------------------------------------------------------------------- */

interface Prize {
  name: string;
  labelLines: string[];
  probability: number; // relative weight, normalised at runtime
  icon: LucideIcon;
  color: string; // wedge fill
  ink: string; // label colour on the wedge
  isWin: boolean;
  headline: string;
  message: string;
}

const prizes: Prize[] = [
  {
    name: "Free spin",
    labelLines: ["Free", "spin"],
    probability: 40,
    icon: Gift,
    color: "#1B7F66",
    ink: "#ffffff",
    isWin: true,
    headline: "You won a free spin",
    message: "Claim it to keep the spin, or play again right away.",
  },
  {
    name: "Surprise box",
    labelLines: ["Surprise", "box"],
    probability: 10,
    icon: Sparkles,
    color: "#F2B23A",
    ink: "#18302A",
    isWin: true,
    headline: "You won a surprise box",
    message: "Your reward is ready. Claim it now or play again.",
  },
  {
    name: "Thank you",
    labelLines: ["Thank", "you"],
    probability: 40,
    icon: HandHeart,
    color: "#44545C",
    ink: "#ffffff",
    isWin: false,
    headline: "Not this time",
    message: "Thanks for playing. Spin again for another chance.",
  },
  {
    name: "Ethio Telecom package",
    labelLines: ["Ethio", "Telecom", "package"],
    probability: 5,
    icon: Smartphone,
    color: "#2D74B8",
    ink: "#ffffff",
    isWin: true,
    headline: "You won an Ethio Telecom package",
    message: "Congratulations. Claim it to collect your package.",
  },
  {
    name: "Thank you",
    labelLines: ["Thank", "you"],
    probability: 5,
    icon: HandHeart,
    color: "#44545C",
    ink: "#ffffff",
    isWin: false,
    headline: "Not this time",
    message: "Thanks for playing. Spin again for another chance.",
  },
];

const SECTION = 360 / prizes.length; // degrees per wedge
const SPIN_MS = 5200;
const BULBS = 24;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

// Angle in degrees, clockwise from 12 o'clock, on a 100x100 viewBox.
const polar = (deg: number, r: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [50 + r * Math.sin(rad), 50 - r * Math.cos(rad)];
};

const wedgePath = (index: number): string => {
  const [x1, y1] = polar(index * SECTION, 50);
  const [x2, y2] = polar((index + 1) * SECTION, 50);
  return `M50 50 L${x1} ${y1} A50 50 0 0 1 ${x2} ${y2} Z`;
};

const choosePrize = (): number => {
  const total = prizes.reduce((sum, p) => sum + p.probability, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < prizes.length; i += 1) {
    roll -= prizes[i].probability;
    if (roll < 0) return i;
  }
  return prizes.length - 1;
};

const easeOut = (p: number) => 1 - Math.pow(1 - p, 4);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const css = `
.sw {
  --sw-ink: #0f2e28;
  --sw-ink-soft: #3d524c;
  --sw-muted: #6a7c76;
  --sw-line: #dfe6e3;
  --sw-surface: #ffffff;
  --sw-wash: #f3f6f5;
  --sw-gold: #f2b23a;
  box-sizing: border-box;
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(20px, 3.2vw, 40px);
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
  background: var(--sw-surface);
  border: 1px solid var(--sw-line);
  border-radius: 24px;
  box-shadow: 0 1px 2px rgba(15, 46, 40, 0.04), 0 18px 48px rgba(15, 46, 40, 0.08);
  color: var(--sw-ink);
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
}
.sw *, .sw *::before, .sw *::after { box-sizing: border-box; }
@media (min-width: 880px) {
  .sw { grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); }
}

/* ---- Wheel ------------------------------------------------------------- */
.sw-stage {
  container-type: inline-size;
  position: relative;
  width: min(100%, 540px);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
}
.sw-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, #1d4a40 0%, #0f2e28 60%, #0a211c 100%);
  box-shadow: 0 10px 30px rgba(10, 33, 28, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.sw-bulb {
  position: absolute;
  width: 2.2cqw;
  height: 2.2cqw;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: #f7d98a;
  box-shadow: 0 0 1.2cqw rgba(242, 178, 58, 0.7);
}
.sw--spinning .sw-bulb:nth-child(odd) { animation: sw-blink 0.5s steps(1) infinite; }
.sw--spinning .sw-bulb:nth-child(even) { animation: sw-blink 0.5s steps(1) infinite reverse; }
@keyframes sw-blink { 50% { opacity: 0.25; box-shadow: none; } }

.sw-wheel {
  position: absolute;
  inset: 5.4%;
  border-radius: 50%;
  overflow: hidden;
  will-change: transform;
  box-shadow: 0 0 0 0.8cqw #f2f5f4, inset 0 0 0 0.4cqw rgba(0, 0, 0, 0.12);
}
.sw-wheel svg { display: block; width: 100%; height: 100%; }

.sw-label {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1.6cqw;
  white-space: nowrap;
  pointer-events: none;
}
.sw-label-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 3.5cqw;
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: 0.01em;
}
.sw-label svg { width: 5.2cqw; height: 5.2cqw; flex: none; }

.sw-hub {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 17%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #1d4a40 0%, #0f2e28 70%);
  box-shadow: 0 0 0 1.2cqw #f2f5f4, 0 6px 16px rgba(10, 33, 28, 0.35);
  display: grid;
  place-items: center;
}
.sw-hub::after {
  content: "";
  width: 28%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: var(--sw-gold);
}

.sw-pointer {
  position: absolute;
  left: 50%;
  top: -2.6cqw;
  width: 8.4cqw;
  transform: translateX(-50%);
  z-index: 5;
  filter: drop-shadow(0 3px 4px rgba(10, 33, 28, 0.35));
}
.sw-pointer svg { display: block; width: 100%; height: auto; }

/* ---- Main column (heading, wheel, spin button) -------------------------- */
.sw-main { display: flex; flex-direction: column; align-items: center; gap: 20px; min-width: 0; text-align: center; }
.sw-main .sw-lead { margin-left: auto; margin-right: auto; }
.sw-main .sw-btn--spin { max-width: 340px; }

/* ---- Side panel -------------------------------------------------------- */
.sw-panel { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.sw-title { margin: 0; font-size: clamp(26px, 3.2vw, 36px); line-height: 1.1; font-weight: 800; letter-spacing: -0.02em; }
.sw-lead { margin: 8px 0 0; color: var(--sw-ink-soft); font-size: 15px; line-height: 1.55; max-width: 44ch; }

.sw-prizes { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.sw-prize {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--sw-line);
  border-radius: 12px;
  background: var(--sw-wash);
  font-size: 14px; font-weight: 600;
}
.sw-chip {
  width: 32px; height: 32px; border-radius: 9px; flex: none;
  display: grid; place-items: center;
}
.sw-chip svg { width: 17px; height: 17px; }

.sw-btn {
  appearance: none; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 22px;
  border-radius: 12px; border: 1px solid transparent;
  font: inherit; font-size: 15px; font-weight: 700;
  transition: background-color 0.15s, border-color 0.15s, transform 0.1s;
}
.sw-btn:active:not(:disabled) { transform: translateY(1px); }
.sw-btn:focus-visible { outline: 3px solid var(--sw-gold); outline-offset: 2px; }
.sw-btn--primary { background: var(--sw-ink); color: #fff; }
.sw-btn--primary:hover:not(:disabled) { background: #1d4a40; }
.sw-btn--ghost { background: #fff; color: var(--sw-ink); border-color: #c9d4d0; }
.sw-btn--ghost:hover:not(:disabled) { background: var(--sw-wash); }
.sw-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.sw-btn--spin { width: 100%; min-height: 54px; font-size: 16px; }

/* ---- Inline result ----------------------------------------------------- */
.sw-result {
  display: flex; align-items: center; gap: 12px;
  min-height: 64px; padding: 12px 14px;
  border-radius: 14px;
  background: var(--sw-wash);
  border: 1px solid var(--sw-line);
}
.sw-result-title { font-size: 15px; font-weight: 700; line-height: 1.3; }
.sw-result-text { margin-top: 2px; font-size: 13.5px; line-height: 1.45; color: var(--sw-ink-soft); }
.sw-actions { display: flex; gap: 10px; }
.sw-actions .sw-btn { flex: 1; }

@media (prefers-reduced-motion: reduce) {
  .sw--spinning .sw-bulb { animation: none !important; }
  .sw-btn { transition: none; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const Spin = () => {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [claimed, setClaimed] = useState(false);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const labels = useMemo(
    () =>
      prizes.map((prize, index) => {
        const center = index * SECTION + SECTION / 2;
        const [x, y] = polar(center, 29); // % of wheel size
        let rotate = center - 90; // text runs along the spoke, outward
        if (Math.cos((rotate * Math.PI) / 180) < 0) rotate += 180; // keep text upright
        return { prize, x, y, rotate };
      }),
    [],
  );

  const legend = useMemo(
    () =>
      prizes.filter((p, i) => prizes.findIndex((q) => q.name === p.name) === i),
    [],
  );

  const bulbs = useMemo(
    () =>
      Array.from({ length: BULBS }, (_, i) => {
        const [x, y] = polar((i * 360) / BULBS, 47.2);
        return { x, y };
      }),
    [],
  );

  const applyRotation = (deg: number) => {
    rotationRef.current = deg;
    if (wheelRef.current)
      wheelRef.current.style.transform = `rotate(${deg}deg)`;
  };

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setClaimed(false);

    const index = choosePrize();
    const center = index * SECTION + SECTION / 2;
    const jitter = (Math.random() - 0.5) * SECTION * 0.7; // land off-centre so it feels natural
    const start = rotationRef.current;

    const align = (((-(center + jitter) - start) % 360) + 360) % 360;
    const delta = align + (5 + Math.floor(Math.random() * 3)) * 360;

    const duration = prefersReducedMotion() ? 600 : SPIN_MS;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      applyRotation(start + delta * easeOut(progress));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      frameRef.current = null;
      applyRotation(start + delta);
      setSpinning(false);
      setResult(prizes[index]);
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  const showResult = !!result && !spinning;
  const canClaim = showResult && !!result?.isWin && !claimed;
  const ResultIcon = result?.icon;

  return (
    <section
      className={`sw${spinning ? " sw--spinning" : ""}`}
      aria-labelledby="sw-title"
    >
      <style>{css}</style>

      <div className="sw-main">
        <div>
          <h2 id="sw-title" className="sw-title">
            Spin to win
          </h2>
          <p className="sw-lead">
            Press spin and the wheel decides. Land on a prize to claim it, or
            spin again for another chance.
          </p>
        </div>

        <div className="sw-stage">
          <div className="sw-pointer" aria-hidden="true">
            <svg viewBox="0 0 40 52">
              <path
                d="M20 50 L5 21 A17 17 0 1 1 35 21 Z"
                fill="#f2b23a"
                stroke="#0f2e28"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="17" r="5.5" fill="#0f2e28" />
            </svg>
          </div>

          <div className="sw-ring" aria-hidden="true">
            {bulbs.map((b, i) => (
              <span
                key={i}
                className="sw-bulb"
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
              />
            ))}
          </div>

          <div
            ref={wheelRef}
            className="sw-wheel"
            role="img"
            aria-label={`Prize wheel with ${legend.map((p) => p.name).join(", ")}`}
          >
            <svg viewBox="0 0 100 100" aria-hidden="true">
              {prizes.map((prize, i) => (
                <path
                  key={i}
                  d={wedgePath(i)}
                  fill={prize.color}
                  stroke="#ffffff"
                  strokeWidth="0.7"
                  strokeLinejoin="round"
                />
              ))}
            </svg>

            {labels.map(({ prize, x, y, rotate }, i) => {
              const Icon = prize.icon;
              return (
                <div
                  key={i}
                  className="sw-label"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    color: prize.ink,
                    transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
                  }}
                >
                  <Icon strokeWidth={2.2} aria-hidden="true" />
                  <span className="sw-label-text">
                    {prize.labelLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="sw-hub" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="sw-btn sw-btn--primary sw-btn--spin"
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? "Spinning…" : result ? "Spin again" : "Spin"}
        </button>
      </div>

      <div className="sw-panel">
        <div className="sw-result" role="status" aria-live="polite">
          {showResult && result && ResultIcon ? (
            <>
              <span
                className="sw-chip"
                style={{ background: result.color, color: result.ink }}
              >
                <ResultIcon strokeWidth={2.2} aria-hidden="true" />
              </span>
              <div>
                <div className="sw-result-title">
                  {claimed ? `Claimed: ${result.name}` : result.headline}
                </div>
                <div className="sw-result-text">
                  {claimed ? "Spin again whenever you like." : result.message}
                </div>
              </div>
            </>
          ) : (
            <div
              className="sw-result-title"
              style={{ color: "var(--sw-ink-soft)" }}
            >
              {spinning ? "Spinning…" : "Ready to spin"}
            </div>
          )}
        </div>

        {canClaim ? (
          <button
            type="button"
            className="sw-btn sw-btn--primary sw-btn--spin"
            onClick={() => setClaimed(true)}
          >
            <CheckCheck size={17} aria-hidden="true" /> Claim prize
          </button>
        ) : null}

        <ul className="sw-prizes" aria-label="Possible prizes">
          {legend.map((prize) => {
            const Icon = prize.icon;
            return (
              <li key={prize.name} className="sw-prize">
                <span
                  className="sw-chip"
                  style={{ background: prize.color, color: prize.ink }}
                >
                  <Icon strokeWidth={2.2} aria-hidden="true" />
                </span>
                {prize.name}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Spin;
