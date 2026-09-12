import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  Instagram,
  MessageSquare,
  Send,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
} from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [senderName, setSenderName] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderMessage.trim()) return;

    // Direct WhatsApp send as well
    const text = `Olá equipa GotYa! Meu nome é ${senderName}. Contacto: ${senderContact}. Mensagem: ${senderMessage}`;
    const url = `https://wa.me/258849102275?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSenderName("");
      setSenderContact("");
      setSenderMessage("");
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Fale Connosco / Suporte GotYa
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Estamos sempre disponíveis para esclarecer dúvidas, apoiar parcerias ou resolver solicitações em Moçambique e no mundo.
          </p>
        </div>

        {/* Quick Contact Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="https://wa.me/258849102275?text=Ol%C3%A1%2C+equipa+do+portal+GotYa!"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 hover:scale-[1.02] transition-all flex items-center gap-3 text-emerald-800 dark:text-emerald-300"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                WhatsApp Oficial
              </span>
              <strong className="text-xs font-mono">+258 84 910 2275</strong>
            </div>
          </a>

          <a
            href="mailto:imperium781@gmail.com"
            className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 hover:scale-[1.02] transition-all flex items-center gap-3 text-blue-800 dark:text-blue-300"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="block text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                E-mail da Administração
              </span>
              <strong className="text-xs truncate block font-mono">imperium781@gmail.com</strong>
            </div>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 hover:scale-[1.02] transition-all flex items-center gap-3 text-pink-800 dark:text-pink-300"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-pink-600 dark:text-pink-400">
                Instagram Oficial
              </span>
              <strong className="text-xs">@gotya.portal</strong>
            </div>
          </a>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-800 dark:text-amber-300">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 font-bold text-xs">
              MT
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                Linha Alternativa (e-Mola)
              </span>
              <strong className="text-xs font-mono">+258 86 201 9030</strong>
            </div>
          </div>
        </div>

        {/* Message Form */}
        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="font-bold text-sm">Mensagem enviada com sucesso!</p>
            <p className="text-xs text-zinc-500">
              A nossa equipa responderá em breve. A janela do WhatsApp foi aberta para conversa imediata.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={senderContact}
                  onChange={(e) => setSenderContact(e.target.value)}
                  placeholder="+258 84 xxxxxxx"
                  className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Sua Mensagem *
              </label>
              <textarea
                required
                rows={3}
                value={senderMessage}
                onChange={(e) => setSenderMessage(e.target.value)}
                placeholder="Como podemos ajudar você hoje?"
                className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Mensagem & Abrir no WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
