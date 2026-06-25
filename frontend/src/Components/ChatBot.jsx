import { useState, useRef, useEffect } from "react";
import BankLogo from "./BankLogo";

// ---------------------------------------------------------------------------
// Hardcoded intent map — pattern → reply
// ---------------------------------------------------------------------------
const INTENTS = [
  {
    patterns: [/\b(hi|hello|hey|good\s*(morning|afternoon|evening))\b/i],
    reply:
      "👋 Hello! Welcome to Channel Horizon Bank. How can I help you today? You can ask me about your account, transfers, cards, or security.",
  },
  {
    patterns: [/\b(balance|account\s*balance|check\s*balance)\b/i],
    reply:
      "💳 To check your account balance, navigate to the **Dashboard**. Both your Checking and Savings balances are displayed at the top of the page.",
  },
  {
    patterns: [/\b(transfer|send\s*money|local\s*transfer|wire|internal)\b/i],
    reply:
      "🔄 To transfer funds, open the **Dashboard** and tap:\n• **Local Transfer** — send to accounts within Channel Horizon Bank.\n• **Wire Transfer** — send to external banks.\n• **Internal Transfer** — move between your own accounts.",
  },
  {
    patterns: [/\b(card|debit\s*card|credit\s*card|lost\s*card|stolen\s*card|block\s*card)\b/i],
    reply:
      "🃏 To report a **lost or stolen card**, call our 24/7 helpline: **1-800-CHB-CARE (1-800-242-2273)**.\nYou can also freeze your card instantly from the **Profile** → Card Settings section.",
  },
  {
    patterns: [/\b(beneficiar|add\s*beneficiar|saved\s*recipient)\b/i],
    reply:
      "👥 To add a beneficiary, go to **Dashboard** → **Add Beneficiary**. Once saved, they'll appear in your quick-transfer list for faster payments.",
  },
  {
    patterns: [/\b(password|forgot\s*password|reset\s*password|change\s*password)\b/i],
    reply:
      "🔑 To change your password:\n1. Go to **Profile** → **Change Password**.\nForgot it? Use the **Forgot Password** link on the Sign In page to receive a reset email.",
  },
  {
    patterns: [/\b(pin|transaction\s*pin|change\s*pin)\b/i],
    reply:
      "🔐 To change your **Transaction PIN**, navigate to **Profile** → **Change Transaction PIN**. You'll need your current PIN to proceed.",
  },
  {
    patterns: [/\b(statement|account\s*statement|transaction\s*history|history)\b/i],
    reply:
      "📄 View your full transaction history under **My Transactions** in the sidebar, or tap **Saving Statement** / **Checking Statement** on the Dashboard.",
  },
  {
    patterns: [/\b(deposit|check\s*deposit|add\s*fund)\b/i],
    reply:
      "💰 To make a deposit, tap **Card Deposit** or **Check Deposit** on the Dashboard. For large deposits please visit a branch or call support.",
  },
  {
    patterns: [/\b(crypto|bitcoin|buy\s*crypto|crypto\s*deposit)\b/i],
    reply:
      "₿ Channel Horizon Bank supports crypto purchases and deposits. Tap **Buy Crypto** or **Crypto Deposit** on the Dashboard to get started.",
  },
  {
    patterns: [/\b(support|help|contact|call|email|phone|speak\s*to\s*(an?\s*)?(agent|human|person|representative))\b/i],
    reply:
      "📞 Our support team is available 24/7:\n• **Phone:** 1-800-CHB-CARE (1-800-242-2273)\n• **Email:** support@channelhorizonbank.com\n• **Chat hours:** Mon – Fri, 8 AM – 8 PM EST\n\nFor security concerns, please call rather than email.",
  },
  {
    patterns: [/\b(loan|borrow|mortgage|personal\s*loan)\b/i],
    reply:
      "🏦 Interested in a loan? Visit **Horizon Loans** on the Dashboard to see current rates for personal loans, mortgages, and business credit. Our lending team can also be reached at **1-800-CHB-LOAN**.",
  },
  {
    patterns: [/\b(invest|investment|saving|savings\s*plan)\b/i],
    reply:
      "📈 Explore investment and savings plans under **Horizon Investments** on the Dashboard. We offer fixed deposits, index funds, and retirement accounts.",
  },
  {
    patterns: [/\b(security|scam|fraud|phishing|suspicious)\b/i],
    reply:
      "🛡️ **Security reminder:** Channel Horizon Bank will NEVER ask for your password, PIN, or OTP via email, SMS, or chat.\n\nIf you suspect fraud, call **1-800-CHB-CARE** immediately and we will freeze your account while we investigate.",
  },
  {
    patterns: [/\b(hours|opening\s*hours|branch\s*hours|when\s*(are\s*you|is\s*the\s*bank)\s*open)\b/i],
    reply:
      "🕐 **Branch hours:** Mon – Fri 8 AM – 5 PM, Sat 9 AM – 1 PM (closed Sundays & public holidays).\nOnline banking and the mobile app are available **24/7**.",
  },
  {
    patterns: [/\b(thank|thanks|thank\s*you|cheers|great|awesome|perfect)\b/i],
    reply:
      "😊 You're welcome! Is there anything else I can help you with today?",
  },
  {
    patterns: [/\b(bye|goodbye|see\s*you|later|take\s*care)\b/i],
    reply:
      "👋 Goodbye! Thank you for banking with Channel Horizon Bank. Have a great day!",
  },
];

const DEFAULT_REPLY =
  "🤔 I'm sorry, I didn't quite understand that. You can ask me about:\n• Account balance & statements\n• Transfers (local, wire, internal)\n• Cards & PINs\n• Loans & investments\n• Security tips\n• Contacting support";

const QUICK_PROMPTS = [
  "Check my balance",
  "How do I transfer money?",
  "I lost my card",
  "Contact support",
  "Security tips",
];

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function getBotReply(text) {
  const trimmed = text.trim();
  for (const intent of INTENTS) {
    if (intent.patterns.some((re) => re.test(trimmed))) {
      return intent.reply;
    }
  }
  return DEFAULT_REPLY;
}

function formatReply(text) {
  // Convert **bold** and newlines to JSX
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        <br />
      </span>
    );
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! I'm Horizon, your Channel Horizon Bank virtual assistant. How can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText) return;

    const userMsg = { from: "user", text: userText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate a short bot "thinking" delay
    setTimeout(() => {
      const reply = getBotReply(userText);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply, time: new Date() },
      ]);
      setTyping(false);
    }, 700);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fmt = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat with Horizon assistant"}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full shadow-2xl
          bg-gradient-to-br from-[#100257] to-[#BA0D76] flex items-center justify-center
          hover:scale-110 active:scale-95 transition-transform"
      >
        {open ? (
          /* X icon */
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Chat bubble icon */
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.862 9.862 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* ── Chat window ─────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-36 right-4 sm:bottom-24 sm:right-6 z-50
            w-[calc(100vw-2rem)] max-w-sm h-[480px] flex flex-col
            rounded-2xl shadow-2xl overflow-hidden border border-purple-200"
          role="dialog"
          aria-label="Channel Horizon Bank chat assistant"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#100257] to-[#BA0D76] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <BankLogo size={36} />
            <div className="text-white">
              <p className="font-semibold text-sm leading-tight">Horizon Assistant</p>
              <p className="text-[10px] opacity-75">Channel Horizon Bank • Online</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white opacity-70 hover:opacity-100"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.from === "user"
                      ? "bg-gradient-to-br from-[#100257] to-[#BA0D76] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{formatReply(msg.text)}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "user" ? "text-purple-200 text-right" : "text-gray-400"}`}>
                    {fmt(msg.time)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="bg-white border-t border-gray-100 px-3 py-2 flex gap-2 overflow-x-auto flex-shrink-0 no-scrollbar">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-purple-300
                  text-[#100257] hover:bg-purple-50 transition-colors whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-3 py-2 flex gap-2 items-end flex-shrink-0">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400 max-h-24 overflow-y-auto"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              aria-label="Send message"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-[#100257] to-[#BA0D76] text-white
                disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
