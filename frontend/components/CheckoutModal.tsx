import React from "react";
import Icon from "./icon";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedNumber: number | null;
  price?: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedNumber,
  price = 50,
}) => {
  if (!isOpen || selectedNumber === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Checkout</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 py-6">
            <span className="text-sm font-medium text-slate-500">
              Selected Number
            </span>
            <span className="mt-1 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600 text-3xl font-bold text-white shadow-sm">
              {selectedNumber}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Ticket Price</span>
              <span className="font-semibold text-slate-900">{price} ETB</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span className="font-medium text-slate-900">Total</span>
              <span className="text-lg font-bold text-indigo-600">
                {price} ETB
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Proceed to payment integration here
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
