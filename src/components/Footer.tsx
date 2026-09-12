import React from "react";
import { SearchMode } from "../types";
import { Sparkles, Zap, ShieldCheck, Phone, Mail, Instagram, CheckCircle2 } from "lucide-react";

interface FooterProps {
  searchMode: SearchMode;
  onOpenAdmin?: () => void;
  onOpenContact?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  searchMode,
  onOpenAdmin,
  onOpenContact,
  isAdmin,
}) => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 py-12 px-4 sm:px-6 lg:px-8 text-zinc-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xl shadow-xs shadow-amber-500/20">
              G
            </div>
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100 font-bold text-base tracking-tight block">
                GotYa — Super Portal Inteligente
              </strong>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Uma porta de entrada segura, rápida e prática para toda a Internet.
              </p>
            </div>
          </div>

          {/* Contacts Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href="https://wa.me/258849102275"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: +258 84 910 2275</span>
            </a>

            <a
              href="mailto:imperium781@gmail.com"
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>imperium781@gmail.com</span>
            </a>

            <button
              onClick={onOpenContact}
              className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-amber-500/15 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Fale Connosco
            </button>
          </div>
        </div>

        {/* Safe Search & Guidelines Badge */}
        <div className="py-3 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Conteúdo 100% Familiar & Seguro:</strong> Filtros ativos contra conteúdos 18+ ou inadequados em todas as categorias e pesquisas.
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 font-medium">
            Taxa de intermediação comercial nos produtos: <strong>2.5%</strong>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <a href="#sites-do-dia" className="hover:text-amber-600 transition-colors">
              Sites do Dia
            </a>
            <a href="#categorias" className="hover:text-amber-600 transition-colors">
              Categorias
            </a>
            <a href="#produtos" className="hover:text-amber-600 transition-colors">
              Marketplace
            </a>
            <a href="#ferramentas" className="hover:text-amber-600 transition-colors">
              Meu Espaço
            </a>
            <a href="#parceiros" className="hover:text-amber-600 transition-colors">
              Parceiros
            </a>
            {isAdmin && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Painel de Controlo ADM
              </button>
            )}
          </div>

          <small className="text-[11px] text-zinc-400 dark:text-zinc-600">
            © 2026 GotYa. Super Portal. Todos os direitos reservados.
          </small>
        </div>
      </div>
    </footer>
  );
};
