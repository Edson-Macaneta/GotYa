import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  BarChart3,
  Users,
  Building2,
  Search,
  Check,
  RefreshCw,
  Phone,
  Mail,
  FolderPlus,
  Plus,
  Trash2,
  Lock,
  CreditCard,
  Crown,
  Megaphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserPlus,
  Layers,
  Sparkles,
  Link,
  ExternalLink,
} from "lucide-react";
import {
  PartnerSubmission,
  SearchHistoryItem,
  CategoryData,
  PartnerAd,
  StaffMember,
  AdminRole,
} from "../types";
import { AdminDashboardTab } from "./admin/AdminDashboardTab";
import { AdminSecurityTab } from "./admin/AdminSecurityTab";
import { AdminSearchControlTab } from "./admin/AdminSearchControlTab";
import { AdminRbacTab } from "./admin/AdminRbacTab";
import { AdminContentTab } from "./admin/AdminContentTab";
import { AdminMonetizationTab } from "./admin/AdminMonetizationTab";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  allHistory: SearchHistoryItem[];
  partnersList: PartnerSubmission[];
  onUpdatePartnerStatus: (id: string, status: "pending" | "approved" | "contacted" | "rejected", tier?: "simples" | "premium" | "premium_pro") => void;
  categories: CategoryData[];
  onAddCategory: (cat: CategoryData) => void;
  onDeleteCategory: (id: string) => void;
  onAddLinkToCategory: (catId: string, link: any) => void;
  onDeleteLinkFromCategory: (catId: string, linkId: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  adminEmail,
  allHistory,
  partnersList,
  onUpdatePartnerStatus,
  categories,
  onAddCategory,
  onDeleteCategory,
  onAddLinkToCategory,
  onDeleteLinkFromCategory,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    "dashboard" | "content" | "search_control" | "security" | "rbac" | "monetization" | "partners" | "ads" | "history"
  >("dashboard");
  const [currentRole, setCurrentRole] = useState<AdminRole>("super_admin");

  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  // Studio: New Category State
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatQuery, setNewCatQuery] = useState("");

  // Studio: New Link to Category State
  const [selectedCatId, setSelectedCatId] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDesc, setNewLinkDesc] = useState("");
  const [newLinkTag, setNewLinkTag] = useState("Portal Oficial");

  // Ads Verification State
  const [adsList, setAdsList] = useState<PartnerAd[]>([]);

  // Password change state
  const [currentAdminPass, setCurrentAdminPass] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [confirmAdminPass, setConfirmAdminPass] = useState("");
  const [passMessage, setPassMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Mother Account & Pricing State
  const [visaNum, setVisaNum] = useState("4333734008870275");
  const [visaCvv, setVisaCvv] = useState("456");
  const [visaExp, setVisaExp] = useState("08/29");
  const [mpesaNum, setMpesaNum] = useState("849102275");
  const [emolaNum, setEmolaNum] = useState("862019030");
  const [pricePremiumUSD, setPricePremiumUSD] = useState(1.9);
  const [pricePremiumProUSD, setPricePremiumProUSD] = useState(3.0);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Staff State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("Moderador de Conteúdo");
  const [staffPhone, setStaffPhone] = useState("");

  const fetchInitialData = async () => {
    setLoadingMetrics(true);
    try {
      const [resMetrics, resAds, resSettings] = await Promise.all([
        fetch("/api/admin/metrics"),
        fetch("/api/ads?all=true"),
        fetch("/api/admin/settings"),
      ]);

      if (resMetrics.ok) {
        const data = await resMetrics.json();
        setMetrics(data);
      }
      if (resAds.ok) {
        const ads = await resAds.json();
        setAdsList(ads);
      }
      if (resSettings.ok) {
        const settings = await resSettings.json();
        if (settings.motherAccount) {
          setVisaNum(settings.motherAccount.visaNumber || visaNum);
          setVisaCvv(settings.motherAccount.cvv || visaCvv);
          setVisaExp(settings.motherAccount.expiry || visaExp);
          setMpesaNum(settings.motherAccount.mpesa || mpesaNum);
          setEmolaNum(settings.motherAccount.emola || emolaNum);
        }
        if (settings.planPrices) {
          setPricePremiumUSD(settings.planPrices.premiumUSD || 1.9);
          setPricePremiumProUSD(settings.planPrices.premiumProUSD || 3.0);
        }
        if (settings.staffMembers) {
          setStaffList(settings.staffMembers);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
      if (categories.length > 0 && !selectedCatId) {
        setSelectedCatId(categories[0].id);
      }
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  // Handle Add Category
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: CategoryData = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      description: newCatDesc.trim() || "Categoria dinâmica criada pelo Estúdio ADM.",
      iconName: "Sparkles",
      popularQuery: newCatQuery.trim() || newCatName.trim(),
      itemCount: 0,
      portals: [],
    };

    onAddCategory(newCat);
    setNewCatName("");
    setNewCatDesc("");
    setNewCatQuery("");
  };

  // Handle Add Link to Category
  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !newLinkTitle.trim() || !newLinkUrl.trim()) return;

    const link = {
      id: `portal-${Date.now()}`,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim().startsWith("http") ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`,
      category: categories.find((c) => c.id === selectedCatId)?.name || "Geral",
      description: newLinkDesc.trim() || "Adicionado pelo Estúdio GotYa.",
      tag: newLinkTag.trim() || "Verificado",
    };

    onAddLinkToCategory(selectedCatId, link);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkDesc("");
  };

  // Handle Ad Approval/Rejection
  const handleUpdateAdStatus = async (adId: string, status: "active" | "rejected") => {
    try {
      await fetch(`/api/ads/${adId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setAdsList((prev) =>
        prev.map((ad) => (ad.id === adId ? { ...ad, status } : ad))
      );
    } catch {
      // error
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newAdminPass !== confirmAdminPass) {
      setPassMessage({ type: "error", text: "A nova senha e a confirmação não coincidem." });
      return;
    }

    if (newAdminPass.length < 6) {
      setPassMessage({ type: "error", text: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword: currentAdminPass,
          newPassword: newAdminPass,
        }),
      });

      if (res.ok) {
        setPassMessage({ type: "success", text: "Senha do Administrador atualizada com sucesso!" });
        setCurrentAdminPass("");
        setNewAdminPass("");
        setConfirmAdminPass("");
      } else {
        const err = await res.json();
        setPassMessage({ type: "error", text: err.error || "Erro ao alterar a senha." });
      }
    } catch {
      setPassMessage({ type: "error", text: "Falha na comunicação com o servidor." });
    }
  };

  // Handle Save Mother Account & Pricing
  const handleSaveMotherAccount = async (e: React.FormEvent) => {
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
            premiumUSD: Number(pricePremiumUSD),
            premiumProUSD: Number(pricePremiumProUSD),
            premiumMZN: Math.round(Number(pricePremiumUSD) * 63.5),
            premiumProMZN: Math.round(Number(pricePremiumProUSD) * 63.5),
          },
        }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch {
      // error
    }
  };

  // Handle Add Staff
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) return;

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: staffName.trim(),
          email: staffEmail.trim(),
          role: staffRole.trim(),
          phone: staffPhone.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStaffList((prev) => [...prev, data.staff]);
        setStaffName("");
        setStaffEmail("");
        setStaffPhone("");
      }
    } catch {
      // error
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  ESTÚDIO & CONTROLO GERAL GOTYA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-zinc-950 uppercase">
                  DEUS DO SITE
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                Administrador: {adminEmail}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInitialData}
              disabled={loadingMetrics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics ? "animate-spin" : ""}`} />
              <span>Sincronizar</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex gap-1.5 border-b border-zinc-200 dark:border-zinc-800 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "dashboard"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("content")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "content"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Controle de Conteúdo</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("search_control")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "search_control"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Controle de Busca</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("security")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "security"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Segurança & Denúncias</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("rbac")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "rbac"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Níveis de Acesso (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("monetization")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "monetization"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Monetização & Conta Mãe</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("partners")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "partners"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Parceiros ({partnersList.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("ads")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "ads"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Anúncios ({adsList.filter((a) => a.status === "pending_review").length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("history")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === "history"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Histórico ({allHistory.length})</span>
          </button>
        </div>

        {/* TAB 1: Dashboard */}
        {activeAdminTab === "dashboard" && (
          <AdminDashboardTab
            metrics={metrics}
            onNavigateTab={(tab) => setActiveAdminTab(tab as any)}
          />
        )}

        {/* TAB 2: Content Control */}
        {activeAdminTab === "content" && (
          <AdminContentTab
            categories={categories}
            onAddCategory={onAddCategory}
            onDeleteCategory={onDeleteCategory}
            onAddLinkToCategory={onAddLinkToCategory}
            onDeleteLinkFromCategory={onDeleteLinkFromCategory}
          />
        )}

        {/* TAB 3: Search Control */}
        {activeAdminTab === "search_control" && (
          <AdminSearchControlTab />
        )}

        {/* TAB 4: Security & Reports */}
        {activeAdminTab === "security" && (
          <AdminSecurityTab
            adminRole={currentRole}
            adminEmail={adminEmail}
          />
        )}

        {/* TAB 5: RBAC Roles */}
        {activeAdminTab === "rbac" && (
          <AdminRbacTab
            currentRole={currentRole}
            onChangeRole={setCurrentRole}
            staffMembers={staffList}
            onAddStaff={(s) => setStaffList((prev) => [s, ...prev])}
            onDeleteStaff={handleDeleteStaff}
          />
        )}

        {/* TAB 6: Monetization & Mother Account */}
        {activeAdminTab === "monetization" && (
          <AdminMonetizationTab
            initialVisa={visaNum}
            initialCvv={visaCvv}
            initialExpiry={visaExp}
            initialMpesa={mpesaNum}
            initialEmola={emolaNum}
            initialPriceUSD={pricePremiumUSD}
            initialPriceProUSD={pricePremiumProUSD}
          />
        )}

        {/* Deprecated Studio */}
        {false && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white block mb-1">
                Estúdio Dinâmico GotYa:
              </strong>
              Aqui o Administrador tem o poder de criar novas categorias, adicionar links diretos oficiais para qualquer portal, ou eliminar qualquer conteúdo não adequado instantaneamente — sem precisar alterar nenhum código de programação!
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form 1: Add New Category */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-amber-500" />
                  <span>Criar Nova Categoria no Site</span>
                </h3>

                <form onSubmit={handleAddCategorySubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Nome da Categoria *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Ex: Cursos & Certificações, Saúde..."
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Descrição da Categoria
                    </label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Breve resumo para os utilizadores..."
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Termo de Pesquisa Popular (para IA)
                    </label>
                    <input
                      type="text"
                      value={newCatQuery}
                      onChange={(e) => setNewCatQuery(e.target.value)}
                      placeholder="Ex: melhores cursos de inglês e programação"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Categoria</span>
                  </button>
                </form>
              </div>

              {/* Form 2: Add Link to Category */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <Link className="w-4 h-4 text-blue-500" />
                  <span>Adicionar Novo Link / Portal a uma Categoria</span>
                </h3>

                <form onSubmit={handleAddLinkSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Escolha a Categoria de Destino *
                    </label>
                    <select
                      value={selectedCatId}
                      onChange={(e) => setSelectedCatId(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                        Título do Portal *
                      </label>
                      <input
                        type="text"
                        required
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Ex: Coursera, MMO Emprego..."
                        className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                        Etiqueta / Tag
                      </label>
                      <input
                        type="text"
                        value={newLinkTag}
                        onChange={(e) => setNewLinkTag(e.target.value)}
                        placeholder="Ex: Cursos Oficiais, Grátis..."
                        className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      URL de Destino *
                    </label>
                    <input
                      type="text"
                      required
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="https://exemplo.com"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Descrição Prática
                    </label>
                    <input
                      type="text"
                      value={newLinkDesc}
                      onChange={(e) => setNewLinkDesc(e.target.value)}
                      placeholder="Como ajuda o usuário..."
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publicar Link no Portal</span>
                  </button>
                </form>
              </div>
            </div>

            {/* List of Current Categories with Deletion and Link Management */}
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                Categorias Ativas & Moderação ({categories.length})
              </h4>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {cat.name}
                        </span>
                        <span className="text-xs text-zinc-500 ml-2">
                          ({cat.portals.length} portais cadastrados)
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1"
                        title="Eliminar categoria inteira"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Categoria</span>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-500 mb-3">{cat.description}</p>

                    {/* Portals list inside this category */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
                      {cat.portals.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">
                              {p.title}
                            </span>
                            <span className="text-zinc-400 truncate max-w-[200px] text-[11px]">
                              {p.url}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold">
                              {p.tag}
                            </span>
                          </div>

                          <button
                            onClick={() => onDeleteLinkFromCategory(cat.id, p.id)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Remover este link da categoria"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Partner Authorization & Management */}
        {activeAdminTab === "partners" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white block mb-0.5">
                Autorização de Novos Parceiros:
              </strong>
              Qualquer usuário simples que deseje tornar-se parceiro é listado aqui e só passa a ter permissão após a aprovação formal do ADM. O ADM pode definir o plano inicial (Simples, Premium ou Premium Pro).
            </div>

            {partnersList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500">
                Nenhuma solicitação de parceiro recebida ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {partnersList.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {partner.businessName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                          {partner.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            partner.tier === "premium_pro"
                              ? "bg-amber-500 text-zinc-950"
                              : partner.tier === "premium"
                              ? "bg-blue-600 text-white"
                              : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {partner.tier.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            partner.status === "approved"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {partner.status}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                        {partner.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                        {partner.city && <span>📍 {partner.city}</span>}
                        {partner.phone && (
                          <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                            <Phone className="w-3 h-3" />
                            {partner.phone}
                          </span>
                        )}
                        {partner.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {partner.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      {partner.status !== "approved" ? (
                        <button
                          onClick={() => onUpdatePartnerStatus(partner.id, "approved", partner.tier)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Autorizar Parceiro</span>
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Autorizado</span>
                        </span>
                      )}

                      {/* Change tier */}
                      <select
                        value={partner.tier}
                        onChange={(e) =>
                          onUpdatePartnerStatus(partner.id, partner.status, e.target.value as any)
                        }
                        className="py-1 px-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
                      >
                        <option value="simples">Simples (Grátis)</option>
                        <option value="premium">Premium ($1.9)</option>
                        <option value="premium_pro">Premium Pro ($3.0)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Ads Verification */}
        {activeAdminTab === "ads" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white block mb-0.5">
                Moderação Prévia Obrigatória de Anúncios:
              </strong>
              Como exigido, antes de qualquer anúncio ir ao ar para os utilizadores do portal, o ADM deve verificar o conteúdo para certificar que cumpre as diretrizes e não possui conteúdos 18+.
            </div>

            {adsList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500">
                Nenhum anúncio submetido no momento.
              </div>
            ) : (
              <div className="space-y-3">
                {adsList.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {ad.title}
                        </span>
                        <span className="text-xs text-zinc-500">
                          por {ad.partnerBusinessName} ({ad.partnerEmail})
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ad.status === "active"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : ad.status === "rejected"
                              ? "bg-red-500/15 text-red-600 dark:text-red-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {ad.status === "active"
                            ? "Aprovado / Ativo"
                            : ad.status === "rejected"
                            ? "Rejeitado"
                            : "Pendente de Revisão"}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">
                        {ad.description}
                      </p>

                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link de Destino: {ad.targetUrl}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      {ad.status !== "active" && (
                        <button
                          onClick={() => handleUpdateAdStatus(ad.id, "active")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprovar Anúncio</span>
                        </button>
                      )}

                      {ad.status !== "rejected" && (
                        <button
                          onClick={() => handleUpdateAdStatus(ad.id, "rejected")}
                          className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejeitar</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Mother Account & Pricing Configuration */}
        {activeAdminTab === "mother_account" && (
          <div className="space-y-6">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white block mb-0.5">
                Configuração da Conta Mãe & Preços dos Planos:
              </strong>
              O Administrador pode alterar os dados da Conta Mãe de recebimento (Visa, M-PESA, e-Mola) e ajustar os valores das assinaturas Premium e Premium Pro a qualquer momento.
            </div>

            {settingsSaved && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Dados da Conta Mãe e Preços atualizados com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveMotherAccount} className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span>Canais Oficiais de Recebimento (Conta Mãe)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Cartão Bancário Visa *
                    </label>
                    <input
                      type="text"
                      required
                      value={visaNum}
                      onChange={(e) => setVisaNum(e.target.value)}
                      placeholder="4333 7340 0887 0275"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      required
                      value={visaCvv}
                      onChange={(e) => setVisaCvv(e.target.value)}
                      placeholder="456"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Validade *
                    </label>
                    <input
                      type="text"
                      required
                      value={visaExp}
                      onChange={(e) => setVisaExp(e.target.value)}
                      placeholder="08/29"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Número M-PESA (Vodacom) *
                    </label>
                    <input
                      type="text"
                      required
                      value={mpesaNum}
                      onChange={(e) => setMpesaNum(e.target.value)}
                      placeholder="849102275"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Número e-Mola (Movitel) *
                    </label>
                    <input
                      type="text"
                      required
                      value={emolaNum}
                      onChange={(e) => setEmolaNum(e.target.value)}
                      placeholder="862019030"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Tabela de Preços dos Planos de Parceiros</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Preço Plano Premium (USD / mês)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={pricePremiumUSD}
                      onChange={(e) => setPricePremiumUSD(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      Equivalente: ~{Math.round(pricePremiumUSD * 63.5)} MT
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                      Preço Plano Premium Pro (USD / mês)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={pricePremiumProUSD}
                      onChange={(e) => setPricePremiumProUSD(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      Equivalente: ~{Math.round(pricePremiumProUSD * 63.5)} MT
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-zinc-500">
                  Taxa de comissão por produto vendido a partir do GotYa: <strong>2.5%</strong>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Configurações da Conta Mãe & Preços</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: Staff & Sub-Accounts */}
        {activeAdminTab === "staff" && (
          <div className="space-y-5">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white block mb-0.5">
                Equipa de Gestão & Sub-Contas:
              </strong>
              O Administrador tem a liberdade de adicionar funcionários, moderadores ou sub-contas para auxiliar no suporte, atendimento ou verificação de anúncios.
            </div>

            {/* Add Staff Form */}
            <form onSubmit={handleAddStaff} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Adicionar Novo Funcionário / Sub-Conta
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="Ex: Carlos Mondlane"
                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    E-mail do Funcionário *
                  </label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="carlos@gotya.co.mz"
                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    placeholder="Ex: Atendimento ao Cliente, Moderador de Anúncios..."
                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="+258 84 xxxxxxx"
                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Adicionar à Equipa</span>
              </button>
            </form>

            {/* Staff List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Membros da Equipa Cadastrados ({staffList.length})
              </h4>

              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <strong className="text-zinc-900 dark:text-white block font-bold">
                      {staff.name}
                    </strong>
                    <span className="text-zinc-500">
                      {staff.email} • {staff.role} {staff.phone ? `• ${staff.phone}` : ""}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteStaff(staff.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remover funcionário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Security - Change Admin Password */}
        {activeAdminTab === "security" && (
          <div className="max-w-md space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white block mb-0.5">
                Segurança da Conta do Administrador:
              </strong>
              Conta vinculada: <strong>{adminEmail}</strong>. Altere a senha atual (padrão: <code>Imperium1@.com</code>) para uma nova senha de acesso seguro ao Estúdio.
            </div>

            {passMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  passMessage.type === "success"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                }`}
              >
                {passMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span>{passMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Senha Atual do Administrador *
                </label>
                <input
                  type="password"
                  required
                  value={currentAdminPass}
                  onChange={(e) => setCurrentAdminPass(e.target.value)}
                  placeholder="Senha atual..."
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="Mínimo 6 caracteres..."
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={confirmAdminPass}
                  onChange={(e) => setConfirmAdminPass(e.target.value)}
                  placeholder="Repita a nova senha..."
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs transition-colors cursor-pointer"
              >
                Atualizar Senha do Administrador
              </button>
            </form>
          </div>
        )}

        {/* TAB: History */}
        {activeAdminTab === "history" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Total de Pesquisas
                </span>
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {metrics?.totalSearches ?? 68}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Pesquisas com IA
                </span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {metrics?.aiSearches ?? 44}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Empresas Parceiras
                </span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {partnersList.length}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                  Comissão Ativa
                </span>
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  2.5%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-zinc-900 dark:text-white block mb-1">
                Filtro de Conteúdo SafeSearch Ativo:
              </strong>
              O motor de IA e as buscas por catálogo contam com filtro contra conteúdos pornográficos ou para maiores de 18 anos, garantindo uma plataforma limpa e segura para toda a família e empresas.
            </div>

            {/* History log preview */}
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Últimas Pesquisas Realizadas ({allHistory.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {allHistory.slice(0, 10).map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-900 dark:text-white truncate">
                      {h.query}
                    </span>
                    <span className="text-zinc-400 text-[10px]">
                      {new Date(h.timestamp).toLocaleTimeString("pt-BR")} • {h.mode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
