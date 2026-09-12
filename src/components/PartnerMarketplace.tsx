import React, { useState, useEffect } from "react";
import { PartnerProduct, CurrencyCode } from "../types";
import {
  Store,
  Crown,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Tag,
  Search,
  CheckCircle2,
} from "lucide-react";

interface PartnerMarketplaceProps {
  products?: PartnerProduct[];
  currency?: CurrencyCode;
  onOpenPartnerModal?: () => void;
  onOpenContact?: () => void;
}

const DEFAULT_PRODUCTS: PartnerProduct[] = [
  {
    id: "prod-1",
    partnerEmail: "standmaputo@gmail.com",
    partnerBusinessName: "AutoStand Maputo",
    partnerTier: "premium_pro",
    title: "Toyota Hilux 2.8 GD-6 4x4 Automática 2022",
    category: "Carros & Automóveis",
    price: 3200000,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://www.beforward.jp",
    description: "Viatura impecável, com apenas 34.000 km, revisão na Toyota Maputo e documentação regularizada.",
    commissionRate: 0.025,
    isApproved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    partnerEmail: "primeimoveis@gmail.com",
    partnerBusinessName: "Imobiliária Sommerschield",
    partnerTier: "premium",
    title: "Vivenda T4 Moderna com Piscina na Sommerschield 2",
    category: "Casas & Imóveis",
    price: 28500000,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://www.google.com/search?q=casas+sommerschield+maputo",
    description: "Excelente residência com acabamentos de luxo, 4 suítes, gerador automático e segurança privada.",
    commissionRate: 0.025,
    isApproved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    partnerEmail: "moztech@gmail.com",
    partnerBusinessName: "MozTech Informática",
    partnerTier: "simples",
    title: "MacBook Pro 14 M3 16GB 512GB SSD Space Gray",
    category: "Compras & Tecnologia",
    price: 135000,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://www.apple.com",
    description: "Equipamento novo na caixa selada com garantia oficial de 1 ano e fatura com NUIT.",
    commissionRate: 0.025,
    isApproved: true,
    createdAt: new Date().toISOString(),
  },
];

export const PartnerMarketplace: React.FC<PartnerMarketplaceProps> = ({
  products: propProducts,
  currency = "MZN",
  onOpenPartnerModal,
  onOpenContact,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetchedProducts, setFetchedProducts] = useState<PartnerProduct[]>([]);

  useEffect(() => {
    if (!propProducts) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setFetchedProducts(data);
          } else {
            setFetchedProducts(DEFAULT_PRODUCTS);
          }
        })
        .catch(() => {
          setFetchedProducts(DEFAULT_PRODUCTS);
        });
    }
  }, [propProducts]);

  const activeProducts = propProducts || (fetchedProducts.length > 0 ? fetchedProducts : DEFAULT_PRODUCTS);

  const categories = ["Todas", "Casas & Imóveis", "Carros & Automóveis", "Compras & Tecnologia"];

  // Currency rate conversion estimates (Base: MZN)
  const formatPrice = (priceInMZN: number, targetCurrency: string = "MZN") => {
    let converted = priceInMZN;
    let symbol = "MT";

    if (targetCurrency === "USD") {
      converted = priceInMZN / 63.5;
      symbol = "$";
    } else if (targetCurrency === "EUR") {
      converted = priceInMZN / 69.0;
      symbol = "€";
    } else if (targetCurrency === "BRL") {
      converted = priceInMZN / 11.5;
      symbol = "R$";
    }

    return `${converted.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} ${symbol}`;
  };

  const filteredProducts = (activeProducts || []).filter((p) => {
    const matchesCat = filterCategory === "Todas" || p.category === filterCategory;
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partnerBusinessName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="produtos" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
            <Store className="w-3.5 h-3.5" />
            MARKETPLACE DE PARCEIROS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Artigos & Serviços em Destaque
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Produtos verificados de parceiros Simples, Premium e Premium Pro com prioridade de posicionamento e taxa de intermediação de 2,5%.
          </p>
        </div>

        {onOpenPartnerModal && (
          <button
            onClick={onOpenPartnerModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            Anunciar o seu produto
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar produtos..."
            className="w-full py-1.5 pl-8 pr-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <Store className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Nenhum produto encontrado neste filtro
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Seja o primeiro parceiro a listar produtos nesta categoria no GotYa!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const isPremiumPro = product.partnerTier === "premium_pro";
            const isPremium = product.partnerTier === "premium";

            return (
              <div
                key={product.id}
                className={`relative flex flex-col justify-between rounded-2xl border transition-all overflow-hidden group ${
                  isPremiumPro
                    ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/10"
                    : isPremium
                    ? "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-xs"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* Image */}
                <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <Store className="w-12 h-12 stroke-1" />
                    </div>
                  )}

                  {/* Priority Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {isPremiumPro && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                        <Crown className="w-3 h-3 fill-current" />
                        PREMIUM PRO
                      </span>
                    )}
                    {isPremium && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        PREMIUM
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                      {product.category}
                    </span>
                  </div>

                  {/* 2.5% Commission Badge */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-xs text-amber-400 text-[9px] font-bold border border-amber-500/30">
                      Comissão 2.5%
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                        Por: {product.partnerBusinessName}
                      </span>
                      <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {formatPrice(product.price, currency)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Contact & Buy actions */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                    <a
                      href={`https://wa.me/258849102275?text=Ol%C3%A1%2C+tenho+interesse+no+produto+%22${encodeURIComponent(
                        product.title
                      )}%22+anunciado+no+GotYa.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Comprar via WhatsApp</span>
                    </a>

                    <a
                      href={product.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                      title="Ver link externo do fornecedor"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
