import React, { useState } from "react";
import { CategoryData, PortalLink } from "../types";
import { CATEGORIES_DATA } from "../data/categories";
import {
  Home,
  Car,
  Briefcase,
  Smartphone,
  Plane,
  FileText,
  GraduationCap,
  HeartPulse,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Phone,
  MapPin,
  Bookmark,
  Shirt,
} from "lucide-react";

interface CategoryExplorerProps {
  categories?: CategoryData[];
  onSearchCategory: (categoryName: string, popularQuery: string) => void;
  onToggleFavorite: (portal: { title: string; url: string; category: string; description: string; badge?: string }) => void;
  isFavorite?: (url: string) => boolean;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5 text-amber-500" />,
  Car: <Car className="w-5 h-5 text-blue-500" />,
  Briefcase: <Briefcase className="w-5 h-5 text-emerald-500" />,
  Smartphone: <Smartphone className="w-5 h-5 text-purple-500" />,
  Plane: <Plane className="w-5 h-5 text-sky-500" />,
  FileText: <FileText className="w-5 h-5 text-rose-500" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-indigo-500" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-red-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Shirt: <Shirt className="w-5 h-5 text-pink-500" />,
};

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  categories = CATEGORIES_DATA,
  onSearchCategory,
  onToggleFavorite,
  isFavorite,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || null;

  return (
    <section id="categorias" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            EXPLORE O SUPER PORTAL
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Encontre por categoria
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Acesso imediato a portais governamentais, empresas parceiras, classificados e ferramentas essenciais geridas pelo Estúdio GotYa.
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategoryId(null)}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline self-start sm:self-auto cursor-pointer"
          >
            Ver todas as categorias
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500 dark:border-amber-400 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    {ICONS_MAP[cat.iconName] || <Sparkles className="w-5 h-5 text-amber-500" />}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                    {cat.portals?.length ?? cat.itemCount} links
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>{isSelected ? "Ocultar links" : "Ver links"}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "rotate-90" : ""}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Category Links Drawer/View */}
      {selectedCategory && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900/90 border border-amber-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {selectedCategory.name}
                </span>
                <span className="text-zinc-400">•</span>
                <span className="text-xs text-zinc-500">
                  {selectedCategory.portals.length} Portais e serviços verificados
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Portais Oficiais em {selectedCategory.name}
              </h3>
            </div>

            <button
              onClick={() => onSearchCategory(selectedCategory.name, selectedCategory.popularQuery)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
            >
              <span>Pesquisar "{selectedCategory.popularQuery}"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategory.portals.map((portal) => {
              const fav = isFavorite ? isFavorite(portal.url) : false;
              return (
                <div
                  key={portal.id}
                  className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        {portal.tag}
                      </span>
                      <button
                        onClick={() =>
                          onToggleFavorite({
                            title: portal.title,
                            url: portal.url,
                            category: selectedCategory.name,
                            description: portal.description,
                            badge: portal.tag,
                          })
                        }
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          fav
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        }`}
                        title={fav ? "Remover dos favoritos" : "Guardar nos favoritos"}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${fav ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                      {portal.title}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                      {portal.description}
                    </p>

                    {(portal.location || portal.phone) && (
                      <div className="space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">
                        {portal.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span>{portal.location}</span>
                          </div>
                        )}
                        {portal.phone && (
                          <div className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{portal.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold transition-colors"
                  >
                    <span>{portal.directActionText || "Acessar Portal"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
