import React from "react";
import { SearchMode, UserAccount, CurrencyCode, LanguageCode } from "../types";
import {
  Sparkles,
  Zap,
  Sun,
  Moon,
  ShieldCheck,
  User,
  LogOut,
  Globe,
  DollarSign,
  Briefcase,
  Store,
  PhoneCall,
  Crown,
  MapPin,
} from "lucide-react";

interface HeaderProps {
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currency: CurrencyCode;
  setCurrency: (cur: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenPartnerModal: () => void;
  onOpenPartnerDashboard: () => void;
  onOpenContact: () => void;
  onOpenAccount?: () => void;
  onOpenLocation?: () => void;
  selectedLocationName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchMode,
  setSearchMode,
  darkMode,
  setDarkMode,
  currency,
  setCurrency,
  language,
  setLanguage,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onOpenPartnerModal,
  onOpenPartnerDashboard,
  onOpenContact,
  onOpenAccount,
  onOpenLocation,
  selectedLocationName = "Moçambique",
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-2xl shadow-sm shadow-amber-500/30 group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
                GotYa
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Portal
                </span>
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden sm:inline -mt-0.5">
                Direto ao ponto
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <a href="#sites-do-dia" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Sites do Dia
            </a>
            <a href="#categorias" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Categorias
            </a>
            <a href="#produtos" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Marketplace
            </a>
            <a href="#ferramentas" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Meu Espaço
            </a>
            <a href="#parceiros" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Parceiros
            </a>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Location Trigger */}
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Mudar Localização (Província / Cidade)"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden md:inline max-w-[90px] truncate">{selectedLocationName}</span>
          </button>

          {/* Currency Selector */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold">
            {(["USD", "MZN", "EUR"] as CurrencyCode[]).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-1.5 py-1 rounded transition-colors ${
                  currency === cur
                    ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-2xs font-extrabold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title={`Moeda: ${cur}`}
              >
                {cur === "MZN" ? "MT" : cur === "USD" ? "$" : "€"}
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold">
            {(["pt", "en"] as LanguageCode[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-1 rounded transition-colors uppercase ${
                  language === lang
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                title={`Idioma: ${lang.toUpperCase()}`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Search Mode Switcher Pill */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium">
            <button
              onClick={() => setSearchMode("ai")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                searchMode === "ai"
                  ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-2xs font-bold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="Pesquisa inteligente com síntese de IA e dicas práticas"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>IA</span>
            </button>
            <button
              onClick={() => setSearchMode("simple")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                searchMode === "simple"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="Pesquisa direta sem IA, rápida para links e portais"
            >
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span>Direto</span>
            </button>
          </div>

          {/* Contact Trigger */}
          <button
            onClick={onOpenContact}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700/80"
            title="Fale connosco (WhatsApp & Instagram)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            aria-label="Alternar tema"
            title={darkMode ? "Mudar para modo claro" : "Mudar para modo noturno"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* User Account / Partner / Admin */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {currentUser.isAdmin ? (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-xs cursor-pointer"
                  title="Estúdio e Painel de Administração"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Painel</span> ADM
                </button>
              ) : currentUser.isPartner ? (
                <button
                  onClick={onOpenPartnerDashboard}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 text-xs font-extrabold hover:opacity-90 transition-all shadow-xs cursor-pointer"
                  title="Painel do Parceiro"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Espaço</span> Parceiro
                </button>
              ) : (
                <button
                  onClick={onOpenPartnerModal}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/10 transition-all"
                  title="Tornar-se Parceiro GotYa"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Seja Parceiro</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                <button
                  onClick={onOpenAccount}
                  className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
                  title="Minha Conta GotYa"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px]">
                    {currentUser.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[120px] truncate text-zinc-700 dark:text-zinc-300 font-medium">
                    {currentUser.email}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 text-zinc-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                  title="Terminar sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
