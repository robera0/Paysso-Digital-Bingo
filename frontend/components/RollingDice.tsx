import { useEffect, useRef } from "react";
import { useDiceRenderer } from "@lambersond/3d-dice-react";

interface DiceAnimationProps {
  rolling: boolean;
}

const DiceAnimation = ({ rolling }: DiceAnimationProps) => {
  const rollingRef = useRef(false);

 const renderer = useDiceRenderer();

  useEffect(() => {
    rollingRef.current = rolling;
  }, [rolling]);

  useEffect(() => {
    if (!renderer.isReady) return;

    const rollContinuously = async () => {
      while (rollingRef.current) {
        try {
          await renderer.roll("1d6");
        } catch (error) {
          console.error("Dice animation failed:", error);
          break;
        }
      }
    };

    if (rolling) {
      rollContinuously();
    }
  }, [rolling, renderer.isReady]);

  return null;
};

export default DiceAnimation;