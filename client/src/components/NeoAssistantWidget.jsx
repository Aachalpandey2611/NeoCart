import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";

const quickActions = [
  { label: "Show best sellers", query: "best sellers" },
  { label: "Track my order", query: "track order" },
  { label: "Shipping info", query: "shipping info" },
  { label: "Return policy", query: "return policy" },
];

const botReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes("track")) {
    return "Open Dashboard -> My Orders -> Track Order. I also added a dedicated live tracking page for each order.";
  }
  if (text.includes("ship")) {
    return "Standard delivery: 3-5 days. Fast lane delivery unlocks after order is marked Processing.";
  }
  if (text.includes("return") || text.includes("refund")) {
    return "Returns are accepted within 7 days for unused items. Keep product packaging and invoice for faster approval.";
  }
  if (
    text.includes("best") ||
    text.includes("seller") ||
    text.includes("hot")
  ) {
    return "Top picks right now: Quantum VR Headset X1, NeoWatch Pro 3, and PixelKeyboard Pro.";
  }

  return "I can help with products, order tracking, shipping, and returns. Try one quick action below.";
};

const NeoAssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I am Neo Assistant. Ask anything about products, orders, or shipping.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const sendMessage = (value) => {
    const userText = value.trim();
    if (!userText) return;

    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInput("");

    const reply = botReply(userText);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 250);
  };

  return (
    <div className="fixed right-4 bottom-4 z-[120]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[min(360px,calc(100vw-2rem))] glass-dark border border-white/15 rounded-3xl shadow-2xl overflow-hidden mb-4"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <p className="text-white font-bold text-sm tracking-wide">
                  Neo Assistant
                </p>
                <p className="text-gray-500 text-xs">Instant shopping help</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.from}-${idx}`}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      msg.from === "user"
                        ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/30"
                        : "bg-white/5 text-gray-200 border border-white/10"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.query)}
                  className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400/50"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSend) sendMessage(input);
                }}
                placeholder="Ask about products or tracking..."
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-400/40"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!canSend}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-40 flex items-center justify-center"
              >
                <FiSend className="text-white" />
              </button>
            </div>

            <div className="px-4 pb-4 text-xs text-gray-500">
              Need account actions?{" "}
              <Link
                to="/dashboard"
                className="text-cyan-300 hover:text-cyan-200"
              >
                Open Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center text-white"
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default NeoAssistantWidget;
