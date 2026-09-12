import React, { useState } from "react";
import { UserAccount, SearchHistoryItem, FavoriteItem, DeviceSession } from "../types";
import {
  X,
  User,
  Mail,
  Phone,
  Laptop,
  Smartphone,
  Shield,
  ShieldCheck,
  History,
  Bookmark,
  Bell,
  Key,
  LogOut,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpdateUser: (user: UserAccount) => void;
  onLogout: () => void;
  history: SearchHistoryItem[];
  onSelectHistoryQuery: (query: string, mode: any) => void;
  onClearHistory: () => void;
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  history,
  onSelectHistoryQuery,
  onClearHistory,
  favorites,
  onRemoveFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<
    | "perfil"
    | "contacto"
    | "sessoes"
    | "historico"
    | "favoritos"
    | "alertas"
    | "seguranca"
  >("perfil");

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || "Utilizador GotYa");
  const [phone, setPhone] = useState(currentUser?.phone || "+258 84 000 0000");
  const [isSaved, setIsSaved] = useState(false);

  // Two-Factor Auth Toggle State
  const [twoFactor, setTwoFactor] = useState(currentUser?.twoFactorEnabled || false);

  // Active Sessions
  const [sessions, setSessions] = useState<DeviceSession[]>([
    {
      id: "sess-1",
      deviceName: "Chrome • macOS / Desktop",
      browser: "Chrome 128.0",
      ip: "197.249.12.84 (Maputo, MZ)",
      location: "Maputo, Moçambique",
      lastActive: "Agora mesmo (Esta sessão)",
      isCurrent: true,
    },
    {
      id: "sess-2",
      deviceName: "Safari • iPhone 14 Pro",
      browser: "Safari Mobile",
      ip: "102.214.33.19 (Matola, MZ)",
      location: "Matola, Moçambique",
      lastActive: "Hoje às 10:14",
      isCurrent: false,
    },
  ]);

  // Saved searches filter
  const [savedSearches, setSavedSearches] = useState<string[]>([
    "casas para arrendar em Maputo",
    "carros à venda no stand",
    "vagas de emprego recentes",
  ]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      twoFactorEnabled: twoFactor,
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleRemoveSavedSearch = (term: string) => {
    setSavedSearches((prev) => prev.filter((t) => t !== term));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xl shadow-xs">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  GotYa Account
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  {currentUser?.isAdmin
                    ? "Administrador"
                    : currentUser?.isPartner
                    ? `Parceiro (${currentUser.partnerTier?.toUpperCase()})`
                    : "Conta Pessoal"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentUser?.email || "usuario@gotya.co.mz"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sidebar + Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("perfil")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "perfil"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </button>

            <button
              onClick={() => setActiveTab("contacto")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "contacto"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email & Telefone</span>
            </button>

            <button
              onClick={() => setActiveTab("sessoes")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "sessoes"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Sessões & Dispositivos</span>
            </button>

            <button
              onClick={() => setActiveTab("historico")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "historico"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico & Pesquisas</span>
            </button>

            <button
              onClick={() => setActiveTab("favoritos")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "favoritos"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Favoritos ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("alertas")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "alertas"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alertas & Notificações</span>
            </button>

            <button
              onClick={() => setActiveTab("seguranca")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "seguranca"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Privacidade & Segurança</span>
            </button>

            <div className="pt-2 mt-auto border-t border-zinc-200 dark:border-zinc-800 hidden md:block">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Terminar Sessão</span>
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
            {/* Tab: Perfil */}
            {activeTab === "perfil" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    Dados do Perfil
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Informações da sua identidade no ecossistema GotYa.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-2xl flex items-center justify-center border border-amber-500/30">
                      {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {currentUser?.name || "Utilizador GotYa"}
                      </h4>
                      <p className="text-xs text-zinc-500">{currentUser?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Conta Ativa • Verificada
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Nome Completo:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Data de Registo:
                    </label>
                    <div className="py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 font-mono">
                      {currentUser?.registeredAt ? new Date(currentUser.registeredAt).toLocaleDateString("pt-PT") : "Hoje"}
                    </div>
                  </div>

                  {isSaved && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Perfil atualizado com sucesso!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Guardar Alterações
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Email & Telefone */}
            {activeTab === "contacto" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    Email & Telefone Associado
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Canais para recuperação de conta, alertas de segurança e notificações M-Pesa.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">
                            {currentUser?.email}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                            Principal
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">Utilizado para login e acesso ao portal</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                          Número de Telemóvel / Carteira Móvel
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Utilizado para pagamentos M-Pesa / e-Mola e notificações por SMS
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+258 84 910 2275"
                        className="flex-1 py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        onClick={handleSaveProfile}
                        className="py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs transition-colors"
                      >
                        Atualizar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Sessões & Dispositivos */}
            {activeTab === "sessoes" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    Sessões & Dispositivos Conectados
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Monitore os aparelhos e navegadores com acesso ativo à sua conta GotYa.
                  </p>
                </div>

                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                          {sess.deviceName.toLowerCase().includes("iphone") ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <Laptop className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {sess.deviceName}
                            </span>
                            {sess.isCurrent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                Esta Sessão
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 space-y-0.5 mt-1">
                            <div>IP: <span className="font-mono">{sess.ip}</span></div>
                            <div>Última atividade: {sess.lastActive}</div>
                          </div>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => handleTerminateSession(sess.id)}
                          className="self-end sm:self-center px-3 py-1.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Encerrar Sessão
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Histórico & Pesquisas Salvas */}
            {activeTab === "historico" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                      Pesquisas & Histórico
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Acesse novamente buscas frequentes ou limpe o histórico.
                    </p>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={onClearHistory}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Limpar Histórico
                    </button>
                  )}
                </div>

                {/* Saved Searches */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Pesquisas Salvas (Acesso Rápido)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {savedSearches.map((term, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium"
                      >
                        <button
                          onClick={() => {
                            onSelectHistoryQuery(term, "ai");
                            onClose();
                          }}
                          className="hover:underline cursor-pointer"
                        >
                          ⭐ {term}
                        </button>
                        <button
                          onClick={() => handleRemoveSavedSearch(term)}
                          className="text-zinc-400 hover:text-red-500 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full History */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Histórico Recente ({history.length})
                  </h4>
                  {history.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-4">Nenhuma pesquisa no histórico.</p>
                  ) : (
                    <div className="space-y-2">
                      {history.slice(0, 10).map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {h.mode === "ai" ? (
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <Zap className="w-3.5 h-3.5 text-blue-500" />
                            )}
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {h.query}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onSelectHistoryQuery(h.query, h.mode);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-amber-500 hover:text-zinc-950 font-semibold transition-colors cursor-pointer"
                          >
                            Repetir
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Favoritos */}
            {activeTab === "favoritos" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    Portais e Links Favoritos ({favorites.length})
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Seus atalhos preferidos guardados para acesso imediato.
                  </p>
                </div>

                {favorites.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-4">
                    Nenhum favorito guardado. Clique no ícone de marcador nos resultados para salvar.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favorites.map((fav) => (
                      <div
                        key={fav.id}
                        className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                              {fav.category}
                            </span>
                            <button
                              onClick={() => onRemoveFavorite(fav.id)}
                              className="text-zinc-400 hover:text-red-500"
                              title="Remover favorito"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1">
                            {fav.title}
                          </h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                            {fav.description}
                          </p>
                        </div>

                        <a
                          href={fav.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          <span>Acessar</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Alertas */}
            {activeTab === "alertas" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    Alertas & Preferências de Notificação
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Defina quando e como o GotYa deve notificá-lo.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        Alertas de Preços e Novas Viaturas / Casas
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Receba avisos quando novos anúncios corresponderem às suas pesquisas
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 cursor-pointer" />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        Alertas de Segurança Anti-Burla
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Avisos imediatos caso um domínio pesquisado recentemente seja reportado como fraude
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 cursor-pointer" />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        Novidades do Ecossistema GotYa & Parceiros
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Promoções e lançamentos de parceiros verificados
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 accent-amber-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Privacidade & Segurança */}
            {activeTab === "seguranca" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    Privacidade & Segurança da Conta
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Controle de autenticação em 2 etapas (2FA) e privacidade dos seus dados.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                          Autenticação em 2 Etapas (2FA)
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          Exigir confirmação por código SMS / OTP ao iniciar sessão em novos dispositivos
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        twoFactor
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {twoFactor ? "Ativado" : "Desativado"}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
                  <h4 className="font-bold text-zinc-900 dark:text-white">
                    Privacidade e Gestão de Dados Pessoais
                  </h4>
                  <p className="text-zinc-500 leading-relaxed">
                    O GotYa não comercializa suas pesquisas para terceiros. Você pode solicitar a exclusão de todas as buscas salvas e registros de sessões a qualquer momento.
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        onClearHistory();
                        alert("Histórico e registros locais de pesquisa limpos com sucesso!");
                      }}
                      className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Limpar Meus Dados de Pesquisa
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
