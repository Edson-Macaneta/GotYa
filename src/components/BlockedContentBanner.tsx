import React from "react";
import { SafetyAnalysis } from "../types";
import { ShieldAlert, AlertTriangle, ArrowLeft, Lock, LifeBuoy } from "lucide-react";

interface BlockedContentBannerProps {
  safety: SafetyAnalysis;
  query: string;
  onResetQuery: () => void;
  onReport: () => void;
}

export const BlockedContentBanner: React.FC<BlockedContentBannerProps> = ({
  safety,
  query,
  onResetQuery,
  onReport,
}) => {
  return (
    <div className="my-8 max-w-3xl mx-auto rounded-3xl bg-red-500/10 border-2 border-red-500/30 p-6 sm:p-8 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-red-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          GotYa Trust & Safety • Conteúdo Restrito
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
          Pesquisa Bloqueada por Segurança
        </h3>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
          {safety.blockReason ||
            "Esta pesquisa foi restrita pelo sistema automático de proteção familiar e prevenção contra fraudes cibernéticas do GotYa."}
        </p>

        {safety.evasionDetected && (
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-semibold max-w-md mx-auto">
            Aviso: Foi detectada tentativa de evasão de filtros de conteúdo adulto.
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto text-left text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-zinc-500">Termo pesquisado:</span>
          <span className="font-mono font-bold text-red-500">"{query}"</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Classificação de Risco:</span>
          <span className="font-black text-red-600">{safety.riskScore}/100</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Política de Moderação:</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Tolerância Zero para Adulto/Burla</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onResetQuery}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Pesquisa Segura</span>
        </button>

        <button
          onClick={onReport}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Contestar Bloqueio</span>
        </button>
      </div>
    </div>
  );
};
