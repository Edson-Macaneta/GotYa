import React, { useState } from "react";
import { OFFICIAL_DESTINATIONS } from "../../data/locationsAndDestinations";
import { OfficialDestination } from "../../types";
import {
  Compass,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag,
  Search,
  Filter,
} from "lucide-react";

export const AdminSearchControlTab: React.FC = () => {
  const [destinations, setDestinations] = useState<OfficialDestination[]>(OFFICIAL_DESTINATIONS);
  const [activeSubTab, setActiveSubTab] = useState<
    "destinations" | "routing" | "sponsored" | "keywords"
  >("destinations");

  const [filterQuery, setFilterQuery] = useState("");

  // New Destination Form
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Redes Sociais");
  const [newKeywords, setNewKeywords] = useState("");

  // Blacklist words
  const [blockedWords, setBlockedWords] = useState<string[]>([
    "porn",
    "xxx",
    "putaria",
    "sexo explicito",
    "nudez",
    "clonar whatsapp",
    "gerador de pin mpesa",
    "hackear conta",
    "armas de fogo ilegais",
  ]);
  const [newWord, setNewWord] = useState("");

  // Sponsored Searches
  const [sponsoredSearches, setSponsoredSearches] = useState<any[]>([
    {
      id: "spon-1",
      keyword: "comprar casa maputo",
      targetPartner: "Imobiliária Maputo Prime",
      landingUrl: "https://maputoprime.example",
      bidMZN: 15.0,
      status: "active",
    },
    {
      id: "spon-2",
      keyword: "carros usados baratos",
      targetPartner: "AutoStand Moçambique",
      landingUrl: "https://autostand.example",
      bidMZN: 12.5,
      status: "active",
    },
    {
      id: "spon-3",
      keyword: "laptops e computadores",
      targetPartner: "TechMoz Soluções Informáticas",
      landingUrl: "https://techmoz.example",
      bidMZN: 8.0,
      status: "active",
    },
  ]);

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl) return;

    const keywordsArray = newKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    if (!keywordsArray.includes(newName.toLowerCase())) {
      keywordsArray.unshift(newName.toLowerCase());
    }

    const newDest: OfficialDestination = {
      id: `dest-${Date.now()}`,
      keyword: keywordsArray[0] || newName.trim().toLowerCase(),
      name: newName.trim(),
      officialDomain: newUrl.replace(/^https?:\/\//, "").split("/")[0],
      targetUrl: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
      description: `Portal oficial verificado para ${newName.trim()}`,
      category: newCategory,
      sslVerified: true,
      reputation: "Oficial",
      riskScore: 0,
    };

    setDestinations((prev) => [newDest, ...prev]);
    setNewName("");
    setNewUrl("");
    setNewKeywords("");
  };

  const handleAddBlockedWord = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newWord.trim().toLowerCase();
    if (clean && !blockedWords.includes(clean)) {
      setBlockedWords((prev) => [...prev, clean]);
      setNewWord("");
    }
  };

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.officialDomain.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.keyword.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub-tabs for Search Control */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubTab("destinations")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "destinations"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Destinos & Domínios Oficiais ({destinations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("routing")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "routing"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Regras de Roteamento (Direct Jump)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("sponsored")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "sponsored"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Resultados Patrocinados ({sponsoredSearches.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("keywords")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "keywords"
              ? "bg-red-500 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Palavras Bloqueadas ({blockedWords.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: Destinos & Domínios Oficiais */}
      {activeSubTab === "destinations" && (
        <div className="space-y-6">
          {/* Add form */}
          <form
            onSubmit={handleAddDestination}
            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Cadastrar Novo Destino Oficial para Pesquisa Direta
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Nome do Portal</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: LinkedIn, BCI, Netflix..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">URL Oficial Segura</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  <option value="Redes Sociais">Redes Sociais</option>
                  <option value="Banca & Finanças">Banca & Finanças</option>
                  <option value="Telecom & Internet">Telecom & Internet</option>
                  <option value="Entretenimento">Entretenimento</option>
                  <option value="Governo & Cidadania">Governo & Cidadania</option>
                  <option value="Compras & E-Commerce">Compras & E-Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">Keywords (separar por vírgula)</label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="facebook, face, fb..."
                  className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Destino Oficial</span>
            </button>
          </form>

          {/* Filter input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filtrar destinos oficiais..."
                className="w-full py-2 pl-9 pr-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <span className="text-xs text-zinc-500">
              Mostrando {filteredDestinations.length} de {destinations.length} destinos
            </span>
          </div>

          {/* Destinations grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">
                        {dest.name}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {dest.category}
                    </span>
                  </div>

                  <a
                    href={dest.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 mb-2"
                  >
                    <span>{dest.officialDomain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <p className="text-[11px] text-zinc-500 line-clamp-2">{dest.description}</p>
                </div>

                <div className="pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400">
                  <span>Palavra-chave: <strong className="font-mono text-zinc-600 dark:text-zinc-300">{dest.keyword}</strong></span>
                  <button
                    onClick={() =>
                      setDestinations((prev) => prev.filter((d) => d.id !== dest.id))
                    }
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Regras de Roteamento */}
      {activeSubTab === "routing" && (
        <div className="space-y-4 max-w-2xl text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Pipeline de Roteamento de Pesquisa GotYa</span>
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              Quando um usuário realiza uma pesquisa em modo <strong>⚡ Direto</strong>, a ordem de processamento segue rigorosamente as diretrizes da arquitetura V2:
            </p>
            <ol className="space-y-2 list-decimal list-inside text-zinc-700 dark:text-zinc-300">
              <li><strong>Intent / Domain Detection:</strong> Identificação de marcas globais e nacionais em milissegundos.</li>
              <li><strong>Official Destination Lookup:</strong> Verificação na base de dados de portais auditados.</li>
              <li><strong>Safety Check (SSL & Blacklist):</strong> Confirmação de certificado e ausência de denúncias ativas.</li>
              <li><strong>Card Direto + Acesso Imediato:</strong> Apresentação do destino verificado com botão de salto seguro.</li>
            </ol>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Resultados Patrocinados */}
      {activeSubTab === "sponsored" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                Palavras-Chave Patrocinadas (Sponsored Search)
              </h4>
              <p className="text-xs text-zinc-500">
                Empresas que compraram destaque exclusivo para termos específicos no topo dos resultados.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {sponsoredSearches.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 mr-2">
                    "{s.keyword}"
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-300">
                    → Anunciante: <strong>{s.targetPartner}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-600">{s.bidMZN} MT / clique</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                    Ativo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: Palavras Bloqueadas */}
      {activeSubTab === "keywords" && (
        <div className="space-y-4">
          <form onSubmit={handleAddBlockedWord} className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Adicionar termo ou expressão para bloquear (ex: golpe)..."
              className="flex-1 py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bloquear Termo</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {blockedWords.map((word, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium"
              >
                <span>{word}</span>
                <button
                  onClick={() =>
                    setBlockedWords((prev) => prev.filter((w) => w !== word))
                  }
                  className="hover:text-red-800 cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
