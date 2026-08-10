import { useState, useEffect } from "react";
import Icon from "./icon";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedNumber: number | null;
  price?: number;
  isPending: boolean;
}

import { useLanguage } from "../src/LanguageContext";
import { translations } from "../src/translations";

const CheckoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  selectedNumber,
  price = 50,
}: CheckoutModalProps) => {
  const [step, setStep] = useState<"checkout" | "instructions">("checkout");
  const TELEBIRR_NUMBER = "+251912345678";
  const { language } = useLanguage();
  const t = translations[language].checkout;

  useEffect(() => {
    if (!isOpen) {
      setStep("checkout");
    }
  }, [isOpen]);

  if (!isOpen || selectedNumber === null) return null;

  const handleCopyAndPay = async () => {
    try {
      await navigator.clipboard.writeText(TELEBIRR_NUMBER);
      toast.success("Number Copied", {
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    setStep("instructions");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md md:max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            {step === "checkout" ? t.checkoutTitle : t.paymentInstructions}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {step === "checkout" ? (
            <>
              <div className="mb-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 py-6">
                <span className="text-sm font-medium text-slate-500">
                  {t.selectedNumber}
                </span>
                <span className="mt-1 flex h-16 w-16 items-center justify-center rounded-xl bg-green-600 text-2xl font-bold text-white shadow-sm">
                  {selectedNumber}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">{t.ticketPrice}</span>
                  <span className="font-semibold text-slate-900">{price} ETB</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="font-medium text-slate-900">{t.total}</span>
                  <span className="text-lg font-bold text-green-600">
                    {price} ETB
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-500">
                      {t.telebirrNumber}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {TELEBIRR_NUMBER}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">1</div>
                <p><strong className="text-slate-900">{t.copyOurNumber}</strong> {t.copyInstruction} <strong>{TELEBIRR_NUMBER}</strong>.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">2</div>
                <p><strong className="text-slate-900">{t.sendPayment}</strong> {t.sendInstruction.replace('{price}', price.toString())}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">3</div>
                <p><strong className="text-slate-900">{t.getReceipt}</strong> {t.getReceiptInstruction}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">4</div>
                <p><strong className="text-slate-900">{t.verifyClaim}</strong> {t.verifyInstruction}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          {step === "checkout" ? (
            <button
              onClick={handleCopyAndPay}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              {t.copyAndPay}
            </button>
          ) : (
            <button
              disabled={isPending}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {t.understandAndContinue}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
