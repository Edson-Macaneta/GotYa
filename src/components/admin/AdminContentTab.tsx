import React, { useState } from "react";
import { CategoryData } from "../../types";
import {
  Layers,
  Tag,
  Megaphone,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  Check,
  AlertCircle,
} from "lucide-react";

interface AdminContentTabProps {
  categories: CategoryData[];
  onAddCategory: (cat: CategoryData) => void;
  onDeleteCategory: (id: string) => void;
  onAddLinkToCategory: (catId: string, link: any) => void;
  onDeleteLinkFromCategory: (catId: string, linkId: string) => void;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory,
  onAddLinkToCategory,
  onDeleteLinkFromCategory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "categories" | "tags" | "banners" | "faqs" | "editorial"
  >("categories");

  // Add Category form
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Layers");
  const [newCatDesc, setNewCatDesc] = useState("");

  // Add Link form
  const [selectedCatId, setSelectedCatId] = useState<string>(
    categories[0]?.id || ""
  );
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDesc, setNewLinkDesc] = useState("");

  // Notices & Banners State
  const [notices, setNotices] = useState<any[]>([
    {
      id: "not-1",
      title: "Alerta de Segurança Oficial",
      text: "Nunca forneça o seu PIN do M-Pesa ou dados bancários a terceiros. O GotYa não solicita senhas.",
      type: "warning",
      active: true,
    },
    {
      id: "not-2",
      title: "Novidade: Pesquisa Visual por Imagem",
      text: "Agora pode pesquisar produtos, carros e casas enviando uma foto diretamente na busca!",
      type: "info",
      active: true,
    },
  ]);
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeText, setNewNoticeText] = useState("");

  // FAQs State
  const [faqs, setFaqs] = useState<any[]>([
    {
      q: "O que é o GotYa?",
      a: "O GotYa é o super portal de busca prática e direta de Moçambique, integrando IA generativa com navegação rápida para destinos verificados.",
    },
    {
      q: "Como funciona a segurança e o filtro Anti-Burla?",
      a: "Todas as buscas passam pelo Security Gateway, com SafeSearch rígido e proteção ativa contra sites falsos e fraudes bancárias.",
    },
    {
      q: "Como anunciar a minha empresa no GotYa?",
      a: "Empresas e stands podem subscrever planos Simples, Premium ou Premium Pro através da área de Parceiros.",
    },
  ]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCategory: CategoryData = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      iconName: newCatIcon || "Layers",
      popularQuery: newCatName.trim(),
      itemCount: 0,
      description: newCatDesc.trim() || `Explore tudo sobre ${newCatName.trim()}`,
      portals: [],
    };

    onAddCategory(newCategory);
    setNewCatName("");
    setNewCatDesc("");
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !newLinkTitle || !newLinkUrl) return;

    onAddLinkToCategory(selectedCatId, {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim(),
      url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
      description: newLinkDesc.trim() || "Portal verificado",
      category: categories.find((c) => c.id === selectedCatId)?.name || "Geral",
      tag: "Oficial",
      verified: true,
    });

    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkDesc("");
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeText) return;
    setNotices((prev) => [
      {
        id: `not-${Date.now()}`,
        title: newNoticeTitle.trim(),
        text: newNoticeText.trim(),
        type: "info",
        active: true,
      },
      ...prev,
    ]);
    setNewNoticeTitle("");
    setNewNoticeText("");
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubTab("categories")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "categories"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Categorias & Links ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("banners")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "banners"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Banners & Avisos ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("faqs")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "faqs"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Páginas & FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("editorial")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "editorial"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Conteúdo Editorial & Tags</span>
        </button>
      </div>

      {/* SUBTAB 1: Categorias & Links */}
      {activeSubTab === "categories" && (
        <div className="space-y-6">
          {/* Add Category Form */}
          <form
            onSubmit={handleCreateCategory}
            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Criar Nova Categoria no Portal
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ex: Farmácias & Saúde..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Ícone</label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  <option value="Layers">Layers (Geral)</option>
                  <option value="Home">Home (Imóveis)</option>
                  <option value="Car">Car (Veículos)</option>
                  <option value="ShoppingBag">ShoppingBag (Compras)</option>
                  <option value="Briefcase">Briefcase (Emprego)</option>
                  <option value="HeartPulse">HeartPulse (Saúde)</option>
                  <option value="Music">Music (Música)</option>
                  <option value="BookOpen">BookOpen (Educação)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Breve Descrição</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Descrição amigável..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Categoria</span>
            </button>
          </form>

          {/* Add Link Form */}
          <form
            onSubmit={handleCreateLink}
            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Vincular Link / Portal Direto a uma Categoria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Categoria de Destino</label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({(c.portals || []).length} links)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Título do Link</label>
                <input
                  type="text"
                  required
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Ex: Farmácia 24H Maputo"
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">URL Completa</label>
                <input
                  type="text"
                  required
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Descrição</label>
                <input
                  type="text"
                  value={newLinkDesc}
                  onChange={(e) => setNewLinkDesc(e.target.value)}
                  placeholder="O que o usuário encontra..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Link à Categoria</span>
            </button>
          </form>

          {/* Categories & Links Display */}
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                      <span>{cat.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {(cat.portals || []).length} links
                      </span>
                    </h5>
                    <p className="text-xs text-zinc-400">{cat.description}</p>
                  </div>

                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 cursor-pointer"
                    title="Excluir categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {(cat.portals || []).map((link) => (
                    <div
                      key={link.id}
                      className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs"
                    >
                      <div className="truncate mr-2">
                        <strong className="block text-zinc-800 dark:text-zinc-200 truncate font-semibold">
                          {link.title}
                        </strong>
                        <span className="text-[10px] text-zinc-400 truncate block">
                          {link.url}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteLinkFromCategory(cat.id, link.id)}
                        className="text-zinc-400 hover:text-red-500 cursor-pointer shrink-0"
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
      )}

      {/* SUBTAB 2: Banners & Avisos */}
      {activeSubTab === "banners" && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddNotice}
            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Criar Novo Aviso / Banner no Topo do Portal
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Título do Aviso</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="Ex: Campanha de Conscientização Anti-Golpe..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Texto Informativo</label>
                <input
                  type="text"
                  required
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  placeholder="Mensagem exibida aos visitantes..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publicar Aviso</span>
            </button>
          </form>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    <span>{n.title}</span>
                  </h5>
                  <p className="text-zinc-500 mt-1">{n.text}</p>
                </div>

                <button
                  onClick={() => setNotices((prev) => prev.filter((item) => item.id !== n.id))}
                  className="p-1 text-zinc-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: FAQs */}
      {activeSubTab === "faqs" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5"
              >
                <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: Editorial & Tags */}
      {activeSubTab === "editorial" && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <h5 className="font-bold text-sm text-zinc-900 dark:text-white">Curadoria Editorial Moçambicana</h5>
            <p className="text-zinc-500">
              O GotYa seleciona fontes de alta credibilidade para notícias diárias, cotações bancárias do Banco de Moçambique, tabelas de salários e oportunidades de bolsas de estudo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
