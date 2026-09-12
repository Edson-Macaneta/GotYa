import React from "react";
import { OfficialDestination } from "../types";
import {
  ShieldCheck,
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertCircle,
  Flag,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface DirectDestinationCardProps {
  destination: OfficialDestination;
  onReport: () => void;
}

export const DirectDestinationCard: React.FC<DirectDestinationCardProps> = ({
  destination,
  onReport,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-zinc-50 to-amber-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/20 border-2 border-amber-500/40 p-6 sm:p-8 shadow-xl shadow-amber-500/5 mb-8">
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-zinc-950 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Destino Oficial Verificado
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Lock className="w-3 h-3" />
            SSL 256-bit Seguro
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Risk Score
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              0/100 (Seguro)
            </span>
          </div>

          <button
            onClick={onReport}
            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            title="Reportar problema com este link oficial"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Denunciar</span>
          </button>
        </div>
      </div>

      {/* Main Info Box */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-amber-400 dark:bg-amber-500 dark:text-zinc-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
            {destination.logoText || destination.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {destination.name}
              </h3>
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mb-2">
              {destination.description}
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>{destination.officialDomain}</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-500 font-sans font-normal">{destination.category}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0">
          <a
            href={destination.targetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full md:w-auto py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/25 hover:scale-[1.02] cursor-pointer"
          >
            <span>Acessar Destino Oficial</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <span className="text-[10px] text-zinc-400 block text-center mt-1.5">
            Canal autêntico verificado GotYa Trust & Safety
          </span>
        </div>
      </div>
    </div>
  );
};
