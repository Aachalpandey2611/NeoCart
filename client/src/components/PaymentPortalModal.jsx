import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCreditCard, FiLock, FiShield, FiX } from "react-icons/fi";
import { formatCurrency } from "../utils/helpers";

const PaymentPortalModal = ({
  isOpen,
  amount,
  method,
  onClose,
  onConfirm,
  loading,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");

  const canSubmit = useMemo(() => {
    if (method !== "Credit Card") return true;
    return (
      cardNumber.trim().length >= 12 &&
      expiry.trim().length >= 4 &&
      cvc.trim().length >= 3
    );
  }, [method, cardNumber, expiry, cvc]);

  const handleConfirm = async () => {
    const payload = {
      gateway: method,
      transactionId: `neo_${Date.now()}`,
      payerName: holder || "Guest",
      masked: cardNumber
        ? `****${cardNumber.replace(/\s/g, "").slice(-4)}`
        : "N/A",
    };
    await onConfirm(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={loading ? undefined : onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl glass-dark rounded-3xl border border-white/15 p-6 md:p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-50"
            >
              <FiX />
            </button>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">
                Secure Gateway
              </p>
              <h3 className="text-2xl font-black text-white">
                Neo Payment Portal
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Your checkout session is encrypted with bank-grade protection.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Payment Method
                </p>
                <p className="text-white font-semibold">{method}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Total Payable
                </p>
                <p className="gradient-text text-xl font-black">
                  {formatCurrency(amount)}
                </p>
              </div>
            </div>

            {method === "Credit Card" && (
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Card Holder
                  </label>
                  <input
                    value={holder}
                    onChange={(e) => setHolder(e.target.value)}
                    placeholder="Card holder name"
                    className="mt-1 w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Card Number
                  </label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="mt-1 w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Expiry
                    </label>
                    <input
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="mt-1 w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      CVC
                    </label>
                    <input
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      className="mt-1 w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 mb-6 text-xs text-emerald-200 flex items-center gap-2">
              <FiShield className="shrink-0" />
              <span>
                PCI-style simulated secure payment flow for portfolio demo.
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-gray-400 text-xs flex items-center gap-2">
                <FiLock /> End-to-end encrypted
              </div>
              <button
                onClick={handleConfirm}
                disabled={!canSubmit || loading}
                className="btn-primary !py-2.5 !px-6 inline-flex items-center gap-2 disabled:opacity-60"
              >
                <FiCreditCard />{" "}
                {loading ? "Processing..." : `Pay ${formatCurrency(amount)}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentPortalModal;
