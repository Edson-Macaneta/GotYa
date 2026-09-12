import React, { useState } from "react";
import { DAILY_TOP_SITES } from "../data/categories";
import { PortalLink } from "../types";
import {
  TrendingUp,
  ExternalLink,
  Download,
  ShoppingBag,
  Bookmark,
  Sparkles,
  Eye,
  CheckCircle2,
} from "lucide-react";

interface DailyTopSitesProps {
  onToggleFavorite?: (portal: {
    title: string;
    url: string;
    category: string;
    description: string;
    badge?: string;
  }) => void;
  isFavorite?: (url: string) => boolean;
  onSelectQuery?: (query: string) => void;
  onSearchDirect?: (query: string) => void;
}

export const DailyTopSites: React.FC<DailyTopSitesProps> = ({
  onToggleFavorite,
  isFavorite,
  onSelectQuery,
  onSearchDirect,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");

  const filterCategories = [
    "Todos",
    "Entretenimento & Mídia",
    "Sites Mais Acessados",
    "Empregos & Carreiras",
    "Carros & Automóveis",
  ];

  const filteredSites =
    selectedFilter === "Todos"
      ? DAILY_TOP_SITES
      : DAILY_TOP_SITES.filter((site) => site.category === selectedFilter);

  const handleQuery = (q: string) => {
    if (onSelectQuery) {
      onSelectQuery(q);
    } else if (onSearchDirect) {
      onSearchDirect(q);
    }
  };

  return (
    <section
      id="sites-do-dia"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            RANKING DIÁRIO
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Sites mais acessados a cada dia
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Acesso direto com 1 clique aos portais, serviços de streaming, redes, downloads legais e compras nos sites originais.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === cat
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {cat === "Todos" ? "Todos os Mais Acessados" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Top Sites */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSites.map((site, index) => {
          const fav = isFavorite ? isFavorite(site.url) : false;
          return (
            <div
              key={site.id}
              className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-black flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      {site.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {onToggleFavorite && (
                      <button
                        onClick={() =>
                          onToggleFavorite({
                            title: site.title,
                            url: site.url,
                            category: site.category,
                            description: site.description,
                            badge: site.tag,
                          })
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          fav
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                        title={fav ? "Remover dos favoritos" : "Guardar nos favoritos"}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${fav ? "fill-current" : ""}`} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3
                    onClick={() => handleQuery(site.title)}
                    className="text-base font-bold text-zinc-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                  >
                    {site.title}
                  </h3>
                  {site.verified && (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                      title="Portal Oficial Verificado"
                    />
                  )}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
                  {site.description}
                </p>

                {site.dailyVisits && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
                    <Eye className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tráfego diário: <strong>{site.dailyVisits}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{site.directActionText || "Acessar Portal"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Option to Download or Buy if available on original site */}
                {(site.canDownload || site.canBuy) && (
                  <div className="flex gap-2">
                    {site.canDownload && (
                      <a
                        href={site.downloadUrl || site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Baixar no site original sem infringir regras"
                      >
                        <Download className="w-3 h-3" />
                        <span>Baixar</span>
                      </a>
                    )}
                    {site.canBuy && (
                      <a
                        href={site.buyUrl || site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Comprar no site oficial"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Comprar</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
