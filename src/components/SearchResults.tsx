import React from "react";
import { SearchMode, AiSearchResult, PortalLink } from "../types";
import {
  Sparkles,
  Zap,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  X,
  ArrowUpRight,
  ShieldAlert,
  Flag,
} from "lucide-react";
import { BlockedContentBanner } from "./BlockedContentBanner";
import { DirectDestinationCard } from "./DirectDestinationCard";
import { analyzeQuerySafety, findOfficialDestination } from "../data/locationsAndDestinations";

interface SearchResultsProps {
  query: string;
  activeMode: SearchMode;
  aiResult: AiSearchResult | null;
  simpleResults: PortalLink[];
  isLoading: boolean;
  onClear: () => void;
  onSelectQuery: (q: string) => void;
  onToggleFavorite: (portal: { title: string; url: string; category: string; description: string; badge?: string }) => void;
  isFavorite?: (url: string) => boolean;
  onChangeMode: (mode: SearchMode) => void;
  onOpenReport?: (url?: string, title?: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  activeMode,
  aiResult,
  simpleResults,
  isLoading,
  onClear,
  onSelectQuery,
  onToggleFavorite,
  isFavorite,
  onChangeMode,
  onOpenReport,
}) => {
  const safety = analyzeQuerySafety(query);
  const officialDestination = findOfficialDestination(query);

  if (safety.isBlocked) {
    return (
      <section id="resultados" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
        <BlockedContentBanner
          safety={safety}
          query={query}
          onResetQuery={onClear}
          onReport={() => onOpenReport?.(`busca:${query}`, "Contestação de Bloqueio")}
        />
      </section>
    );
  }
  return (
    <section id="resultados" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              RESULTADOS DA PESQUISA
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {activeMode === "ai" ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Modo IA
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-blue-500" />
                  Modo Simples (Sem IA)
                </>
              )}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            Resultados para <span className="text-amber-500">"{query}"</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick mode switcher within results */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium">
            <button
              onClick={() => onChangeMode("ai")}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                activeMode === "ai"
                  ? "bg-white dark:bg-zinc-900 font-bold text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Sparkles className="w-3 h-3" /> Ver com IA
            </button>
            <button
              onClick={() => onChangeMode("simple")}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                activeMode === "simple"
                  ? "bg-white dark:bg-zinc-900 font-bold text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Zap className="w-3 h-3" /> Ver Simples
            </button>
          </div>

          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </button>
        </div>
      </div>

      {/* Safety Alert / Anti-Burla Warning */}
      {safety.fraudWarning && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-start gap-3.5">
          <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-0.5">
              GotYa Trust & Safety • Alerta Preventivo Anti-Fraude
            </span>
            <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white leading-relaxed">
              {safety.fraudWarning}
            </p>
          </div>
          <button
            onClick={() => onOpenReport?.(`aviso:${query}`, "Reporte de Tentativa de Fraude")}
            className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline shrink-0"
          >
            Denunciar Suspeita
          </button>
        </div>
      )}

      {/* Official Direct Destination Card */}
      {officialDestination && !isLoading && (
        <div className="mt-6">
          <DirectDestinationCard
            destination={officialDestination}
            onReport={() =>
              onOpenReport?.(officialDestination.targetUrl, officialDestination.name)
            }
          />
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center animate-pulse mb-4">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            {activeMode === "ai"
              ? "O GotYa AI está sintetizando a melhor resposta..."
              : "Consultando o diretório direto..."}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
            Cruzando dados, portais verificados e canais diretos para você.
          </p>
        </div>
      )}

      {/* AI Mode Results Display */}
      {!isLoading && activeMode === "ai" && aiResult && (
        <div className="mt-8 space-y-6">
          {/* Main AI Direct Answer Box */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                GotYa Inteligência Direta
              </span>
            </div>

            <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium mb-6">
              {aiResult.directSummary}
            </p>

            {aiResult.estimatedPriceOrRange && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center gap-3">
                <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 tracking-wide">
                  Estimativa de Mercado:
                </span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {aiResult.estimatedPriceOrRange}
                </span>
              </div>
            )}

            {/* Key Tips / Steps */}
            {aiResult.keyTips && aiResult.keyTips.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Passos Recomendados & Cuidados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiResult.keyTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Portals from AI */}
          {aiResult.recommendedPortals && aiResult.recommendedPortals.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <span>Portais e Canais Diretos Recomendados</span>
                <span className="text-xs font-normal text-zinc-500">
                  ({aiResult.recommendedPortals.length} opções selecionadas)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiResult.recommendedPortals.map((portal, idx) => {
                  const fav = isFavorite ? isFavorite(portal.url) : false;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            {portal.tag || "Recomendado"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                onOpenReport?.(portal.url, portal.name)
                              }
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Denunciar suspeita ou link inadequado"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                onToggleFavorite({
                                  title: portal.name,
                                  url: portal.url,
                                  category: "Pesquisa IA",
                                  description: portal.description,
                                  badge: portal.tag,
                                })
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                fav
                                  ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                              }`}
                              title={fav ? "Remover dos favoritos" : "Guardar nos favoritos"}
                            >
                              <Bookmark className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
                          {portal.name}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                          {portal.description}
                        </p>
                      </div>

                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold transition-colors"
                      >
                        <span>Acessar Diretamente</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggested Next Searches */}
          {aiResult.suggestedNextQueries && aiResult.suggestedNextQueries.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-zinc-400 block mb-2">
                Pesquisas complementares sugeridas:
              </span>
              <div className="flex flex-wrap gap-2">
                {aiResult.suggestedNextQueries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectQuery(item)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    🔍 {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simple Mode (No IA) Results Display */}
      {!isLoading && activeMode === "simple" && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Portais do Diretório GotYa ({simpleResults.length} encontrados)
            </span>
          </div>

          {simpleResults.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                Nenhum portal direto catalogado com esse termo exato
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-md mx-auto">
                Experimente pesquisar com o <strong>Modo IA</strong> para encontrar fontes na web ou navegue pelas categorias abaixo.
              </p>
              <button
                onClick={() => onChangeMode("ai")}
                className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                Pesquisar com Modo IA
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simpleResults.map((portal) => {
                const fav = isFavorite ? isFavorite(portal.url) : false;
                return (
                  <div
                    key={portal.id}
                    className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {portal.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {portal.tag}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              onOpenReport?.(portal.url, portal.title)
                            }
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Denunciar suspeita ou link inadequado"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              onToggleFavorite({
                                title: portal.title,
                                url: portal.url,
                                category: portal.category,
                                description: portal.description,
                                badge: portal.tag,
                              })
                            }
                            className={`p-1.5 rounded-lg transition-colors ${
                              fav
                                ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            }`}
                            title={fav ? "Remover dos favoritos" : "Guardar nos favoritos"}
                          >
                            <Bookmark className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
                        {portal.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                        {portal.description}
                      </p>

                      <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                        {portal.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{portal.location}</span>
                          </div>
                        )}
                        {portal.phone && (
                          <div className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{portal.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold transition-colors"
                    >
                      <span>{portal.directActionText || "Acessar Portal"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
