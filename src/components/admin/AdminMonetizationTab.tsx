import React, { useState } from "react";
import {
  DollarSign,
  CreditCard,
  Phone,
  ShieldCheck,
  Check,
  CheckCircle2,
  Crown,
  Sparkles,
  Layers,
  Key,
  TrendingUp,
} from "lucide-react";

interface AdminMonetizationTabProps {
  initialVisa?: string;
  initialCvv?: string;
  initialExpiry?: string;
  initialMpesa?: string;
  initialEmola?: string;
  initialPriceUSD?: number;
  initialPriceProUSD?: number;
}

export const AdminMonetizationTab: React.FC<AdminMonetizationTabProps> = ({
  initialVisa = "",
  initialCvv = "",
  initialExpiry = "",
  initialMpesa = "+258 84 000 0000",
  initialEmola = "+258 86 000 0000",
  initialPriceUSD = 9.9,
  initialPriceProUSD = 29.9,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "models" | "mother_account" | "pricing" | "api"
  >("models");

  const [visaNum, setVisaNum] = useState(initialVisa);
  const [visaCvv, setVisaCvv] = useState(initialCvv);
  const [visaExp, setVisaExp] = useState(initialExpiry);
  const [mpesaNum, setMpesaNum] = useState(initialMpesa);
  const [emolaNum, setEmolaNum] = useState(initialEmola);

  const [priceUSD, setPriceUSD] = useState(initialPriceUSD);
  const [priceProUSD, setPriceProUSD] = useState(initialPriceProUSD);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motherAccount: {
            visaNumber: visaNum,
            cvv: visaCvv,
            expiry: visaExp,
            mpesa: mpesaNum,
            emola: emolaNum,
          },
          planPrices: {
            premiumUSD: Number(priceUSD),
            premiumProUSD: Number(priceProUSD),
            premiumMZN: Math.round(Number(priceUSD) * 63.5),
            premiumProMZN: Math.round(Number(priceProUSD) * 63.5),
          },
        }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 4000);
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubTab("models")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "models"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Modelos de Monetização Segura</span>
        </button>

        <button
          onClick={() => setActiveSubTab("mother_account")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "mother_account"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Conta Mãe & Recebimentos (M-Pesa, e-Mola, Visa)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("pricing")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "pricing"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Planos & Comissões</span>
        </button>

        <button
          onClick={() => setActiveSubTab("api")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "api"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>API Empresarial</span>
        </button>
      </div>

      {/* SUBTAB 1: 7 Streams of Monetization */}
      {activeSubTab === "models" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              7 Fontes de Monetização Segura (GotYa V2)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Arquitetura comercial ética desenhada para alta receita sem comprometer a confiança do usuário.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                  1. Sponsored Search
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600">
                  Leilão de CPC
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Empresas pagam para aparecer no topo para palavras-chave disputadas (ex: "comprar casa", "carros").
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                  2. Featured Businesses
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                  Fixação Mensal
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Negócios destacados em caixas douradas na homepage e páginas de categorias provinciais.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                  3. Affiliate Marketing
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600">
                  Comissão por Venda
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Comissão de 2.5% em vendas de produtos e reservas intermediadas para parceiros certificados.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                  4. Advertising (Banners)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600">
                  CPM & Clicks
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Espaços de mídia de alta visibilidade aprovados manualmente pelo Administrador no topo e rodapé.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                  5. Premium Accounts
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600">
                  Assinatura Pro
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Utilizadores com navegação ultra-rápida sem publicidade, histórico infinito e alertas de segurança.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                  6. Business Accounts
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                  Planos B2B
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Painel multi-usuário para imobiliárias e stands gerirem stock e anúncios com sub-contas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                  7. Search API
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                  Token por Query
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Fornecimento de dados estruturados e motor de pesquisa moçambicano para desenvolvedores e apps terceiras.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2 & 3: Conta Mãe & Planos Form */}
      {(activeSubTab === "mother_account" || activeSubTab === "pricing") && (
        <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
          {settingsSaved && (
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configurações financeiras salvas com sucesso no servidor!</span>
            </div>
          )}

          {/* Visa configuration */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>Cartão Visa / Débito Internacional (Conta Mãe)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Número do Cartão</label>
                <input
                  type="text"
                  value={visaNum}
                  onChange={(e) => setVisaNum(e.target.value)}
                  placeholder="4000 1234 5678 9010"
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Validade & CVV</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={visaExp}
                    onChange={(e) => setVisaExp(e.target.value)}
                    placeholder="MM/AA"
                    className="w-1/2 py-2 px-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="password"
                    maxLength={4}
                    value={visaCvv}
                    onChange={(e) => setVisaCvv(e.target.value)}
                    placeholder="CVV"
                    className="w-1/2 py-2 px-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Money configuration */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>Carteiras Móveis de Moçambique (M-Pesa & e-Mola)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">M-Pesa (Vodacom)</label>
                <input
                  type="text"
                  value={mpesaNum}
                  onChange={(e) => setMpesaNum(e.target.value)}
                  placeholder="+258 84..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">e-Mola (Movitel)</label>
                <input
                  type="text"
                  value={emolaNum}
                  onChange={(e) => setEmolaNum(e.target.value)}
                  placeholder="+258 86..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Tabela de Preços dos Planos de Parceiros</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Plano Premium (USD/mês)</label>
                <input
                  type="number"
                  step="0.1"
                  value={priceUSD}
                  onChange={(e) => setPriceUSD(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  ~{Math.round(priceUSD * 63.5)} MT / mês
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Plano Premium Pro (USD/mês)</label>
                <input
                  type="number"
                  step="0.1"
                  value={priceProUSD}
                  onChange={(e) => setPriceProUSD(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  ~{Math.round(priceProUSD * 63.5)} MT / mês
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-500 pt-1">
              Comissão padrão por transação de produto: <strong>2.5%</strong>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Configurações da Conta Mãe & Preços</span>
          </button>
        </form>
      )}

      {/* SUBTAB 4: Search API */}
      {activeSubTab === "api" && (
        <div className="space-y-4 max-w-xl text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <h5 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <span>GotYa Search API Endpoint</span>
            </h5>
            <p className="text-zinc-500">
              Chave de API primária do portal para integração com apps externas e portais parceiros:
            </p>
            <div className="p-2.5 rounded-xl bg-zinc-900 text-amber-400 font-mono text-[11px] select-all">
              gotya_live_sec_9941a82f30b91e77
            </div>
            <p className="text-[11px] text-zinc-400">
              Taxa de consumo: 0.10 MT por pesquisa direta com metadados verificados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
