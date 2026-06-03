"use client";

import { useState } from "react";
import { Send, Search, Phone, MoreVertical, CheckCheck, Smile } from "lucide-react";
import { sellers, listings } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

const mockConversations = sellers.slice(0, 4).map((s, i) => ({
  seller: s,
  listing: listings[i] || listings[0],
  lastMessage: {
    fr: ["Bonjour, est-ce encore disponible ?", "Quel est le dernier prix ?", "Je vous rappelle ce soir", "Merci pour votre offre"][i],
    ar: ["مرحبا، هل لا يزال متوفراً؟", "ما هو آخر سعر؟", "سأتصل بك الليلة", "شكراً على عرضك"][i],
  },
  time: ["14:32", "12:10", "Hier", "Lun"][i],
  unread: [2, 0, 1, 0][i],
}));

const mockMessages = [
  { id: 1, from: "buyer", text: "Bonjour, est-ce encore disponible ?", textAr: "مرحبا، هل لا يزال متوفراً؟", time: "14:28" },
  { id: 2, from: "seller", text: "Oui, tout à fait !", textAr: "نعم، بالطبع!", time: "14:29" },
  { id: 3, from: "buyer", text: "Quel est le dernier prix ?", textAr: "ما هو آخر سعر؟", time: "14:30" },
  { id: 4, from: "seller", text: "Pour vous, je peux faire 185 000 MRU, dernier prix 🤝", textAr: "لك أجعله 185,000 أوقية، آخر سعر 🤝", time: "14:32" },
];

export default function MessagesPage() {
  const { isRTL, locale } = useLanguage();
  const [activeConv, setActiveConv] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      from: "buyer",
      text: newMessage,
      textAr: newMessage,
      time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setNewMessage("");
  };

  const current = mockConversations[activeConv];

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 py-0 sm:py-6">
        <div className="flex h-[calc(100vh-80px)] bg-white sm:rounded-2xl overflow-hidden shadow-card">
          {/* Sidebar conversations */}
          <div className={`w-full sm:w-80 flex-shrink-0 border-${isRTL ? "l" : "r"} border-sand-100 flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-sand-100">
              <h2 className={`font-bold text-night-500 mb-3 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "الرسائل" : "Messages"}
              </h2>
              <div className="relative">
                <input type="text" placeholder={isRTL ? "بحث..." : "Rechercher..."} className="w-full input-field py-2 text-sm pl-9" />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-300" />
              </div>
            </div>

            {/* Liste conversations */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {mockConversations.map((conv, i) => (
                <button
                  key={i}
                  onClick={() => setActiveConv(i)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-sand-50 hover:bg-sand-50 transition-colors ${activeConv === i ? "bg-sand-50" : ""} ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={conv.seller.avatar} alt="" className="w-12 h-12 rounded-full bg-sand-100" />
                    {conv.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-center justify-between mb-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <p className="text-sm font-semibold text-night-500 truncate">
                        {isRTL ? conv.seller.nameAr : conv.seller.name}
                      </p>
                      <span className="text-xs text-night-400/50 flex-shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <p className="text-xs text-night-400/60 truncate">
                      {isRTL ? conv.lastMessage.ar : conv.lastMessage.fr}
                    </p>
                    <p className="text-[10px] text-sand-400/70 truncate mt-0.5">
                      {isRTL ? conv.listing.titleAr : conv.listing.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header chat */}
            <div className={`flex items-center gap-3 px-5 py-4 border-b border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
              <img src={current.seller.avatar} alt="" className="w-10 h-10 rounded-full bg-sand-100" />
              <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                <p className="font-semibold text-night-500 text-sm">
                  {isRTL ? current.seller.nameAr : current.seller.name}
                </p>
                <p className="text-xs text-islamic-400">● {isRTL ? "متصل" : "En ligne"}</p>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button className="p-2 text-night-400 hover:text-sand-500 transition-colors rounded-lg hover:bg-sand-50">
                  <Phone size={16} />
                </button>
                <button className="p-2 text-night-400 hover:text-sand-500 transition-colors rounded-lg hover:bg-sand-50">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Annonce référencée */}
            <div className={`flex items-center gap-3 px-5 py-3 bg-sand-50 border-b border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
              <img src={current.listing.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                <p className="text-xs font-semibold text-night-500 truncate">
                  {isRTL ? current.listing.titleAr : current.listing.title}
                </p>
                <p className="text-xs text-sand-500 font-bold">
                  {current.listing.price.toLocaleString()} MRU
                </p>
              </div>
              {current.listing.negotiable && (
                <button className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-night-500 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                  🤝 {isRTL ? "فاوض" : "Négocier"}
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar bg-sand-50/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "buyer" ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.from === "buyer"
                        ? "text-white rounded-br-md"
                        : "bg-white text-night-500 shadow-sm rounded-bl-md"
                    }`}
                    style={msg.from === "buyer" ? { background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" } : undefined}
                  >
                    <p className={isRTL ? "font-arabic" : ""}>{isRTL ? msg.textAr : msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.from === "buyer" ? "justify-end" : "justify-start"}`}>
                      <span className={`text-[10px] ${msg.from === "buyer" ? "text-white/50" : "text-night-400/40"}`}>{msg.time}</span>
                      {msg.from === "buyer" && <CheckCheck size={12} className="text-sand-400/70" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input message */}
            <div className={`flex items-center gap-3 px-4 py-3 border-t border-sand-100 bg-white ${isRTL ? "flex-row-reverse" : ""}`}>
              <button className="p-2 text-night-400 hover:text-sand-500 transition-colors">
                <Smile size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={isRTL ? "اكتب رسالتك..." : "Écrivez votre message..."}
                dir={isRTL ? "rtl" : "ltr"}
                className="flex-1 bg-sand-50 rounded-xl px-4 py-2.5 text-sm text-night-500 placeholder-sand-300 outline-none focus:ring-2 focus:ring-sand-300"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
              >
                <Send size={16} className="text-night-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
