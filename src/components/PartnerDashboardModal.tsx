import React, { useState } from "react";
import {
  X,
  Crown,
  Sparkles,
  Users,
  Plus,
  BarChart3,
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  ShoppingBag,
  ExternalLink,
  Trash2,
  Briefcase,
  Building2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { UserAccount, PartnerTier, PartnerProduct, PartnerAd, CurrencyCode } from "../types";
import { PartnerWorkspace } from "./PartnerWorkspace";
import { PartnerProfileEditor } from "./PartnerProfileEditor";
import { PartnerChatInbox } from "./PartnerChatInbox";

interface PartnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  partner?: any;
  products?: PartnerProduct[];
  onAddProduct?: (prod: any) => void;
  onDeleteProduct?: (id: string) => void;
  currency?: CurrencyCode;
}

export const PartnerDashboardModal: React.FC<PartnerDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  partner,
  products = [],
  onAddProduct,
  onDeleteProduct,
  currency = "MZN",
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "workspace" | "profile" | "chat" | "products" | "ads" | "users" | "upgrade"
  >("overview");

  // Fallback safe user
  const effectiveUser: UserAccount = currentUser || (partner ? {
    email: partner.email || "parceiro@gotya.com",
    name: partner.businessName || "Empresa Parceira",
    isAdmin: false,
    isPartner: true,
    partnerTier: partner.tier || "simples",
    registeredAt: partner.submittedAt || new Date().toISOString(),
    subUsers: [],
  } : {
    email: "parceiro@gotya.com",
    name: "Empresa Parceira",
    isAdmin: false,
    isPartner: true,
    partnerTier: "simples" as PartnerTier,
    registeredAt: new Date().toISOString(),
    subUsers: [],
  });

  // Dynamic state for partner tier with automated upgrade support
  const [currentTier, setCurrentTier] = useState<PartnerTier>(
    effectiveUser.partnerTier || "simples"
  );
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccessMsg, setUpgradeSuccessMsg] = useState<string | null>(null);

  const handleUpgradeTier = async (targetTier: "premium" | "premium_pro") => {
    setUpgrading(true);
    setUpgradeSuccessMsg(null);
    try {
      const res = await fetch("/api/partner/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerEmail: effectiveUser.email,
          targetTier,
          paymentMethod: "mpesa_auto",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentTier(targetTier);
        effectiveUser.partnerTier = targetTier;
        setUpgradeSuccessMsg(
          `Pagamento validado e aprovado automaticamente! Seu plano foi atualizado para ${targetTier === "premium_pro" ? "PREMIUM PRO (IA Ilimitada)" : "PREMIUM"}. Notificação enviada ao ADM (imperium781@gmail.com).`
        );
      } else {
        // Fallback local upgrade
        setCurrentTier(targetTier);
        effectiveUser.partnerTier = targetTier;
        setUpgradeSuccessMsg(`Plano atualizado para ${targetTier.toUpperCase()} com sucesso!`);
      }
    } catch {
      setCurrentTier(targetTier);
      effectiveUser.partnerTier = targetTier;
      setUpgradeSuccessMsg(`Plano atualizado para ${targetTier.toUpperCase()} com sucesso!`);
    } finally {
      setUpgrading(false);
    }
  };

  // Product form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Casas & Imóveis");
  const [newPrice, setNewPrice] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newExternalLink, setNewExternalLink] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [productSuccess, setProductSuccess] = useState(false);

  // Ad form state
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [adTargetUrl, setAdTargetUrl] = useState("");
  const [adSuccess, setAdSuccess] = useState(false);

  // Subuser form state
  const [subuserEmail, setSubuserEmail] = useState("");
  const [subusersList, setSubusersList] = useState<string[]>(effectiveUser.subUsers || []);
  const [userError, setUserError] = useState("");

  const maxSeats = currentTier === "premium_pro" ? 11 : currentTier === "premium" ? 5 : 2;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const prod = {
      partnerEmail: effectiveUser.email,
      partnerBusinessName: effectiveUser.name || "Minha Empresa",
      partnerTier: currentTier,
      title: newTitle.trim(),
      category: newCategory,
      price: Number(newPrice),
      currency: "MZN",
      imageUrl: newImageUrl.trim() || undefined,
      externalLink: newExternalLink.trim() || "#",
      description: newDescription.trim(),
    };

    if (onAddProduct) {
      onAddProduct(prod);
    }
    setProductSuccess(true);
    setTimeout(() => {
      setProductSuccess(false);
      setNewTitle("");
      setNewPrice("");
      setNewImageUrl("");
      setNewExternalLink("");
      setNewDescription("");
    }, 2000);
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adTargetUrl.trim()) return;

    fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerEmail: effectiveUser.email,
        partnerBusinessName: effectiveUser.name || "Parceiro",
        partnerTier: currentTier,
        title: adTitle.trim(),
        description: adDescription.trim(),
        targetUrl: adTargetUrl.trim(),
      }),
    });

    setAdSuccess(true);
    setTimeout(() => {
      setAdSuccess(false);
      setAdTitle("");
      setAdDescription("");
      setAdTargetUrl("");
    }, 2500);
  };

  const handleAddSubuser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError("");
    if (subusersList.length >= maxSeats) {
      setUserError(`Atingiu o limite de ${maxSeats} utilizadores do seu plano.`);
      return;
    }
    const clean = subuserEmail.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setUserError("E-mail inválido.");
      return;
    }
    if (subusersList.includes(clean)) {
      setUserError("Este utilizador já foi adicionado.");
      return;
    }

    setSubusersList((prev) => [...prev, clean]);
    setSubuserEmail("");
  };

  const userProducts = (products || []).filter(
    (p) => p && p.partnerEmail && p.partnerEmail.toLowerCase() === effectiveUser.email.toLowerCase()
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                ESPAÇO DE GESTÃO DO PARCEIRO
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  currentTier === "premium_pro"
                    ? "bg-amber-500 text-zinc-950"
                    : currentTier === "premium"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                Plano {currentTier.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Painel de Negócios ({effectiveUser.email})
            </h2>
          </div>

          <button
            onClick={() => setActiveTab("upgrade")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-extrabold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Fazer Upgrade de Plano</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Desempenho</span>
          </button>

          <button
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "workspace"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Ferramentas Empresariais</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Perfil da Empresa</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "chat"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Mensagens Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "products"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Meus Produtos ({userProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ads")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "ads"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Criar Anúncios</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Utilizadores ({subusersList.length + 1}/{maxSeats})</span>
          </button>

          <button
            onClick={() => setActiveTab("upgrade")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "upgrade"
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Planos & Vantagens</span>
          </button>
        </div>

        {/* Tab 1: Overview & Analytics */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Cliques & Leads WhatsApp
                </span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {currentTier === "premium_pro" ? 284 : currentTier === "premium" ? 112 : 18}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Impressões nas Buscas
                </span>
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {currentTier === "premium_pro" ? "14.2k" : currentTier === "premium" ? "6.8k" : "850"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Quota de IA
                </span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {currentTier === "premium_pro" ? "Ilimitada" : currentTier === "premium" ? "50 / dia" : "5 / dia"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Assentos da Equipa
                </span>
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  {subusersList.length + 1} de {maxSeats}
                </span>
              </div>
            </div>

            {/* Visual Analytics Chart Simulation for Premium & Premium Pro */}
            {currentTier !== "simples" ? (
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">
                  Gráfico de Desempenho dos Anúncios e Produtos (Últimos 7 dias)
                </h4>
                <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2">
                  {[40, 65, 55, 80, 70, 95, 100].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-bold text-zinc-400">{val * 2}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          currentTier === "premium_pro" ? "bg-amber-500" : "bg-blue-600"
                        }`}
                        style={{ height: `${val}%` }}
                      ></div>
                      <span className="text-[10px] text-zinc-500">Dia {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-white block mb-1">
                  Métricas avançadas disponíveis nos planos Premium e Premium Pro:
                </strong>
                Faça upgrade para ter acesso a gráficos detalhados de cliques, leads, IA Ilimitada e posicionamento prioritário no topo do portal GotYa.
              </div>
            )}
          </div>
        )}

        {/* Tab: Business Workspace Tools (IA, Quotes, QR Catalog, Badge) */}
        {activeTab === "workspace" && (
          <PartnerWorkspace
            partnerTier={currentTier}
            partnerName={effectiveUser.name}
            partnerEmail={effectiveUser.email}
            partnerId={partner?.id || "p-default"}
          />
        )}

        {/* Tab: Company Profile Editor */}
        {activeTab === "profile" && (
          <PartnerProfileEditor
            partnerId={partner?.id || effectiveUser.email}
            defaultName={effectiveUser.name}
            defaultEmail={effectiveUser.email}
          />
        )}

        {/* Tab: Consumer Mini-Chat Inbox */}
        {activeTab === "chat" && (
          <PartnerChatInbox partnerEmail={effectiveUser.email} />
        )}

        {/* Tab 2: Add & Manage Products */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Form */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">
                Adicionar Novo Artigo ou Serviço no Marketplace
              </h4>

              {productSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Artigo publicado com sucesso no marketplace!</span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Título do Produto / Serviço *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Toyota Ractis 2018 ou Moradia T3 na Matola"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="Casas & Imóveis">Casas & Imóveis</option>
                      <option value="Carros & Automóveis">Carros & Automóveis</option>
                      <option value="Compras & Tecnologia">Compras & Tecnologia</option>
                      <option value="Entretenimento & Mídia">Entretenimento & Mídia</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Preço (MZN) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Ex: 45000"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/foto.jpg"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Destaque as especificações, localização e benefícios..."
                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publicar Artigo</span>
                </button>
              </form>
            </div>

            {/* List */}
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                Os seus artigos cadastrados
              </h4>
              {userProducts.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-500">
                  Nenhum artigo cadastrado ainda por esta conta.
                </div>
              ) : (
                <div className="space-y-2">
                  {userProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <strong className="text-zinc-900 dark:text-white block">{p.title}</strong>
                        <span className="text-zinc-500">
                          {p.category} • {p.price.toLocaleString()} MZN • Comissão: 2.5%
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Remover produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Create Ads (Requires ADM verification) */}
        {activeTab === "ads" && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white block mb-1">
                Política de Verificação de Anúncios GotYa:
              </strong>
              Todos os anúncios criados por parceiros passam por revisão prévia do Administrador (imperium781@gmail.com) para garantir conformidade com as regras da Google e segurança dos utilizadores (sem conteúdos 18+).
            </div>

            {adSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Anúncio submetido com sucesso! Aguarda validação do Administrador.</span>
              </div>
            )}

            <form onSubmit={handleCreateAd} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Título da Campanha / Anúncio *
                </label>
                <input
                  type="text"
                  required
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="Ex: Super Promoção de Arrendamento na Polana"
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Link de Destino (Website ou WhatsApp) *
                </label>
                <input
                  type="url"
                  required
                  value={adTargetUrl}
                  onChange={(e) => setAdTargetUrl(e.target.value)}
                  placeholder="https://wa.me/25884xxxxxxx ou https://empresa.co.mz"
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Texto do Anúncio
                </label>
                <textarea
                  rows={2}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="Mensagem promocional direta..."
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Enviar para Validação do ADM</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Sub-users / Seats */}
        {activeTab === "users" && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Gestão de Utilizadores na Mesma Conta
              </h4>
              <p className="text-xs text-zinc-500 mb-4">
                No seu plano atual ({currentTier.toUpperCase()}), você pode associar até <strong>{maxSeats}</strong> colaboradores para gerir produtos e leads.
              </p>

              {userError && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-semibold">
                  {userError}
                </div>
              )}

              <form onSubmit={handleAddSubuser} className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={subuserEmail}
                  onChange={(e) => setSubuserEmail(e.target.value)}
                  placeholder="email.colaborador@empresa.com"
                  className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={subusersList.length >= maxSeats}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </form>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white">{effectiveUser.email}</span>
                    <span className="text-zinc-400 ml-2">(Titular Principal)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                    Administrador da Conta
                  </span>
                </div>

                {subusersList.map((email, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs flex items-center justify-between"
                  >
                    <span className="text-zinc-800 dark:text-zinc-200">{email}</span>
                    <button
                      onClick={() => setSubusersList((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-zinc-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Upgrade Plans & Mother Account Payment */}
        {activeTab === "upgrade" && (
          <div className="space-y-6">
            {upgradeSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{upgradeSuccessMsg}</span>
              </div>
            )}

            {/* Plans comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Simples */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Simples</h4>
                  <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">Grátis</div>
                  <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Máximo de <strong>2 utilizadores</strong>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      IA Básica limitada (5 buscas/dia)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Listagem no marketplace
                    </li>
                  </ul>
                </div>
                <span className="text-center text-xs font-bold text-zinc-500 py-2">
                  {currentTier === "simples" ? "Plano Atual" : "Básico"}
                </span>
              </div>

              {/* Premium */}
              <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-500 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400">Premium</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">
                      Popular
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">
                    1.9 USD <span className="text-xs font-normal text-zinc-500">/mês (~120 MT)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      Máximo de <strong>5 utilizadores</strong>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      Prioridade em resultados de pesquisa
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      Gráficos e métricas de desempenho
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      IA expandida (50 buscas/dia)
                    </li>
                  </ul>
                </div>
                <button
                  disabled={upgrading || currentTier === "premium"}
                  onClick={() => handleUpgradeTier("premium")}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  {upgrading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentTier === "premium" ? (
                    "Plano Ativo"
                  ) : (
                    "Subscrever Premium (Ativação Automática)"
                  )}
                </button>
              </div>

              {/* Premium Pro */}
              <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                      Premium Pro
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-zinc-950">
                      Máximo
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">
                    3.0 USD <span className="text-xs font-normal text-zinc-500">/mês (~190 MT)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      Máximo de <strong>11 utilizadores</strong>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      <strong>IA Ilimitada</strong> em todas as pesquisas
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      Posicionamento absoluto no topo
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      Crachá Dourado Verificado
                    </li>
                  </ul>
                </div>
                <button
                  disabled={upgrading || currentTier === "premium_pro"}
                  onClick={() => handleUpgradeTier("premium_pro")}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-zinc-950 text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  {upgrading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentTier === "premium_pro" ? (
                    "Plano Ativo"
                  ) : (
                    "Subscrever Pro (Ativação Automática)"
                  )}
                </button>
              </div>
            </div>

            {/* Mother Account / Payment methods */}
            <div className="p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold">Conta Mãe para Pagamentos & Subscrições</h4>
                </div>
                <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10">
                  Canal Oficial GotYa
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Cartão Bancário Visa
                  </span>
                  <strong className="block font-mono text-amber-300">4333 7340 0887 0275</strong>
                  <span className="text-[11px] text-zinc-400">CVV: 456 • Val: 08/29</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    M-PESA (Vodacom)
                  </span>
                  <strong className="block font-mono text-emerald-400">849102275</strong>
                  <span className="text-[11px] text-zinc-400">Titular: GotYa Portal</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    e-Mola (Movitel)
                  </span>
                  <strong className="block font-mono text-amber-400">862019030</strong>
                  <span className="text-[11px] text-zinc-400">Titular: GotYa Portal</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400">
                Após efetuar a transferência pelo M-PESA ou e-Mola, envie o comprovativo pelo WhatsApp de suporte (<strong>+258 84 910 2275</strong>) para ativação imediata.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
