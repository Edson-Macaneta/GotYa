import React, { useState, useEffect } from "react";
import { MessageSquare, Send, User, Clock, CheckCheck, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  senderEmail: string;
  senderRole: "buyer" | "seller";
  sellerEmail: string;
  productId?: string;
  productTitle?: string;
  message: string;
  timestamp: string;
}

interface PartnerChatInboxProps {
  partnerEmail: string;
}

export const PartnerChatInbox: React.FC<PartnerChatInboxProps> = ({ partnerEmail }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeBuyer, setActiveBuyer] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/messages?partnerEmail=${encodeURIComponent(partnerEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
        if (!activeBuyer && data.length > 0) {
          const buyers = Array.from(new Set(data.map((m: any) => m.senderEmail)));
          if (buyers.length > 0) {
            setActiveBuyer(buyers[0] as string);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load chat messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 6000);
    return () => clearInterval(interval);
  }, [partnerEmail]);

  // Group messages by buyer email
  const buyersList = Array.from(
    new Set(
      messages.map((m) =>
        m.senderRole === "buyer" ? m.senderEmail : m.sellerEmail === partnerEmail ? m.senderEmail : ""
      ).filter(Boolean)
    )
  );

  const filteredThread = messages.filter(
    (m) =>
      (m.senderEmail === activeBuyer && m.sellerEmail === partnerEmail) ||
      (m.senderEmail === partnerEmail && m.sellerEmail === activeBuyer)
  );

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeBuyer) return;

    setSending(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: partnerEmail,
          senderRole: "seller",
          sellerEmail: activeBuyer,
          message: replyText.trim(),
        }),
      });

      if (res.ok) {
        setReplyText("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to reply", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Mensagens dos Consumidores (Mini-Chat)
          </h3>
        </div>
        <span className="text-xs text-zinc-500">
          Responda a dúvidas em tempo real para fechar vendas
        </span>
      </div>

      {buyersList.length === 0 && messages.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 space-y-2">
          <MessageSquare className="w-10 h-10 mx-auto text-zinc-400 opacity-50" />
          <p className="text-xs font-semibold">Nenhuma mensagem recebida ainda.</p>
          <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
            Quando os consumidores clicarem no botão "Conversar com Vendedor" nos seus anúncios ou produtos, as mensagens aparecerão aqui instantaneamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96">
          {/* Buyers list */}
          <div className="border border-zinc-200 dark:border-zinc-700/80 rounded-xl overflow-y-auto bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
            {buyersList.map((buyerEmail) => (
              <button
                key={buyerEmail}
                onClick={() => setActiveBuyer(buyerEmail)}
                className={`w-full p-3 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeBuyer === buyerEmail
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                  <User className="w-4 h-4" />
                </div>
                <div className="truncate flex-1">
                  <span className="block text-xs truncate">{buyerEmail}</span>
                  <span className="text-[10px] text-zinc-400">Cliente GotYa</span>
                </div>
              </button>
            ))}
          </div>

          {/* Chat conversation */}
          <div className="md:col-span-2 flex flex-col border border-zinc-200 dark:border-zinc-700/80 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
            {/* Header */}
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                Conversa com: <span className="text-amber-600">{activeBuyer || "Cliente"}</span>
              </span>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Online
              </span>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              {filteredThread.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  Selecione um cliente para ler e responder.
                </div>
              ) : (
                filteredThread.map((msg) => {
                  const isMe = msg.senderEmail === partnerEmail || msg.senderRole === "seller";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      {msg.productTitle && (
                        <span className="text-[10px] text-zinc-400 mb-0.5">
                          Sobre: <strong>{msg.productTitle}</strong>
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                          isMe
                            ? "bg-amber-500 text-zinc-950 font-medium rounded-tr-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-xs"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-zinc-400 mt-0.5">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input reply form */}
            <form onSubmit={handleSendReply} className="p-2 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escreva a sua resposta para o cliente..."
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
