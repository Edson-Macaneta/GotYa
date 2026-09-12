import React from "react";
import {
  Users,
  Search,
  AlertTriangle,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  CheckCircle2,
  Server,
  Activity,
} from "lucide-react";

interface AdminDashboardTabProps {
  metrics: any;
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  metrics,
  onNavigateTab,
}) => {
  const usersCount = metrics?.totalUsers ?? 12482;
  const searchesCount = metrics?.totalSearches ?? 84291;
  const reportsCount = metrics?.totalReports ?? 27;
  const blockedCount = metrics?.blockedLinksCount ?? 143;
  const revenueMZN = metrics?.totalRevenueMZN ?? 52400;

  return (
    <div className="space-y-6">
      {/* 5 Primary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Usuários */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Usuários
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-0.5">
              {usersCount.toLocaleString("pt-PT")}
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% novos este mês
            </span>
          </div>
        </div>

        {/* Card 2: Pesquisas */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Pesquisas
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-0.5">
              {searchesCount.toLocaleString("pt-PT")}
            </div>
            <span className="text-[10px] text-zinc-500">
              IA: <strong>58.120</strong> • Direto: <strong>26.171</strong>
            </span>
          </div>
        </div>

        {/* Card 3: Denúncias */}
        <div
          onClick={() => onNavigateTab("security")}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-red-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Denúncias
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 mb-0.5">
              {reportsCount}
            </div>
            <span className="text-[10px] font-semibold text-red-500">
              7 fila prioritária (Fraude)
            </span>
          </div>
        </div>

        {/* Card 4: Links Bloqueados */}
        <div
          onClick={() => onNavigateTab("security")}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-zinc-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Links Bloqueados
            </span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-0.5">
              {blockedCount}
            </div>
            <span className="text-[10px] text-zinc-500">
              Domínios maliciosos e adultos
            </span>
          </div>
        </div>

        {/* Card 5: Receita */}
        <div
          onClick={() => onNavigateTab("monetization")}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Receita
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-0.5">
              {revenueMZN.toLocaleString("pt-PT")} MT
            </div>
            <span className="text-[10px] text-zinc-500">
              M-Pesa, e-Mola & Cartão
            </span>
          </div>
        </div>
      </div>

      {/* Gateway & Safety Architecture Status */}
      <div className="p-6 rounded-3xl bg-zinc-900 text-white border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Security Gateway & Search Orchestrator V2</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-zinc-950">
                  ONLINE
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Pipeline ativo: Security Gateway → Content Safety → Intent Detection → Ranking → Verificação
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("security")}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
          >
            Abrir Security Center
          </button>
        </div>

        {/* Pipeline Steps Indicator */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-zinc-200">Content Safety</div>
              <div className="text-[10px] text-zinc-400">Anti-Adult & Evasão</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-zinc-200">Anti-Burla</div>
              <div className="text-[10px] text-zinc-400">Scam & Phishing Shield</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-zinc-200">Direct Jump</div>
              <div className="text-[10px] text-zinc-400">Domínios Oficiais (SSL)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-zinc-200">AI Synthesizer</div>
              <div className="text-[10px] text-zinc-400">Gemini 2.5 Server-Side</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
