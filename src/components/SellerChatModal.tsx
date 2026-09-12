import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MessageCircle,
  Phone,
  Store,
  Crown,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Flag,
} from "lucide-react";
import { SellerChatMessage, PartnerProduct } from "../types";

interface SellerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: PartnerProduct | null;
  currentUserEmail?: string;
  currentUserName?: string;
  onOpenReport?: (url?: string, title?: string) => void;
}

export const SellerChatModal: React.FC<SellerChatModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUserEmail = "consumidor@gotya.co.mz",
  currentUserName = "Consumidor GotYa",
  onOpenReport,
}) => {
  const [messages, setMessages] = useState<SellerChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      // Fetch initial chat
      fetch(`/api/chat/messages?productId=${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
          } else {
            // Initial greeting message from seller
            const welcomeMsg: SellerChatMessage = {
              id: `welcome-${Date.now()}`,
              productId: product.id,
              productTitle: product.title,
              partnerEmail: product.partnerEmail,
              partnerBusinessName: product.partnerBusinessName,
              sender: "seller",
              senderName: product.partnerBusinessName,
              senderEmail: product.partnerEmail,
              message: `Olá! Bem-vindo(a) ao canal oficial de atendimento de ${product.partnerBusinessName}. Como podemos ajudar com "${product.title}"?`,
              timestamp: "Agora",
            };
            setMessages([welcomeMsg]);
          }
        })
        .catch(() => {
          setMessages([]);
        });
    }
  }, [isOpen, product]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen || !product) return null;

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text) return;

    const newMsg: SellerChatMessage = {
      id: `msg-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      partnerEmail: product.partnerEmail,
      partnerBusinessName: product.partnerBusinessName,
      sender: "buyer",
      senderName: currentUserName,
      senderEmail: currentUserEmail,
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!customText) setInputText("");

    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });

      // Automated seller quick reply simulation if 1st message
      setTimeout(() => {
        const replyMsg: SellerChatMessage = {
          id: `reply-${Date.now()}`,
          productId: product.id,
          productTitle: product.title,
          partnerEmail: product.partnerEmail,
          partnerBusinessName: product.partnerBusinessName,
          sender: "seller",
          senderName: product.partnerBusinessName,
          senderEmail: product.partnerEmail,
          message: "Obrigado pelo contacto! O gestor responsável acabou de receber o seu alerta e responderá em instantes. Para agilizar, também pode falar no WhatsApp!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1200);
    } catch {
      // local state kept
    }
  };

  const quickChips = [
    "Ainda está disponível para compra?",
    "Faz entrega em Maputo ou Matola?",
    "Qual é o preço com desconto à vista?",
    "Tem garantia e fatura com NUIT?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-zinc-900 dark:text-white truncate">
                  {product.partnerBusinessName}
                </span>
                {product.partnerTier === "premium_pro" ? (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                    <Crown className="w-2.5 h-2.5 fill-current" />
                    Pro
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    <Sparkles className="w-2.5 h-2.5" />
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 truncate">
                Canal Oficial de Vendas • Resposta rápida
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenReport?.(product.externalLink || product.title, `Burla ou Produto Suspeito: ${product.title}`)}
              title="Denunciar Burla"
              className="p-2 text-zinc-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Context Banner */}
        <div className="p-3 bg-zinc-100 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
              />
            )}
            <div className="min-w-0">
              <strong className="block text-zinc-900 dark:text-white truncate">
                {product.title}
              </strong>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {product.price.toLocaleString()} {product.currency}
              </span>
            </div>
          </div>

          <a
            href={`https://wa.me/258849102275?text=${encodeURIComponent(
              `Olá! Vi o produto "${product.title}" no portal GotYa e gostaria de conversar.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Chat History Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          {messages.map((msg) => {
            const isMe = msg.sender === "buyer";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? "bg-amber-500 text-zinc-950 font-medium rounded-tr-none shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-tl-none shadow-xs"
                  }`}
                >
                  <span className="block text-[10px] font-bold opacity-75 mb-0.5">
                    {msg.senderName}
                  </span>
                  <p>{msg.message}</p>
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-500/15 hover:text-amber-600 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escreva uma mensagem para o vendedor..."
            className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
