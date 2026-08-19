import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pb-22 bg-black/50 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex w-full max-w-md max-h-[90vh] flex-col  rounded-2xl bg-white shadow-xl sm:max-w-lg">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
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
        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {step === "checkout" ? (
            <>
              <div className="mb-4 flex flex-col items-center justify-center rounded-xl bg-slate-50 py-4 sm:mb-6 sm:py-6">
                <span className="text-xs font-medium text-slate-500 sm:text-sm">
                  {t.selectedNumber}
                </span>
                <span className="mt-1 flex h-14 w-14 items-center justify-center rounded-xl bg-green-600 text-xl font-bold text-white shadow-sm sm:h-16 sm:w-16 sm:text-2xl">
                  {selectedNumber}
                </span>
              </div>

              <div className="space-y-3 text-sm sm:space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">
                    {t.ticketPrice}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {price} ETB
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="font-medium text-slate-900">{t.total}</span>
                  <span className="text-base font-bold text-green-600 sm:text-lg">
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
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  1
                </div>
                <p className="flex-1 min-w-0 text-[13px] leading-relaxed text-slate-600 sm:text-sm break-words">
                  <strong className="text-slate-900 block mb-0.5 sm:mb-0 sm:inline">
                    {t.copyOurNumber}{" "}
                  </strong>
                  {t.copyInstruction}{" "}
                  <strong className="text-slate-900 font-semibold">
                    {TELEBIRR_NUMBER}
                  </strong>
                  .
                </p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  2
                </div>
                <p className="flex-1 min-w-0 text-[13px] leading-relaxed text-slate-600 sm:text-sm break-words">
                  <strong className="text-slate-900 block mb-0.5 sm:mb-0 sm:inline">
                    {t.sendPayment}{" "}
                  </strong>
                  {t.sendInstruction.replace("{price}", price.toString())}
                </p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  3
                </div>
                <div className="flex flex-col gap-3">
                  <p className="flex-1 min-w-0 text-[13px] leading-relaxed text-slate-600 sm:text-sm break-words">
                    <strong className="text-slate-900 block mb-0.5 sm:mb-0 sm:inline">
                      {t.getReceipt}{" "}
                    </strong>
                    {t.getReceiptInstruction}
                  </p>

                  <img
                    loading="lazy"
                    src="/tele.jpg"
                    alt="How to get your Telebirr receipt"
                    className="w-full max-w-md h-auto rounded-lg object-contain"
                  />
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  4
                </div>
                <p className="flex-1 min-w-0 text-[13px] leading-relaxed text-slate-600 sm:text-sm break-words">
                  <strong className="text-slate-900 block mb-0.5 sm:mb-0 sm:inline">
                    {t.verifyClaim}{" "}
                  </strong>
                  {t.verifyInstruction}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:py-3 sm:text-base"
          >
            {t.cancel}
          </button>
          {step === "checkout" ? (
            <button
              onClick={handleCopyAndPay}
              className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 sm:py-3 sm:text-base"
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
              className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 sm:py-3 sm:text-base"
            >
              {t.understandAndContinue}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CheckoutModal;
