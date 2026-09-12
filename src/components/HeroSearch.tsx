import React, { useState, useRef, useEffect } from "react";
import { SearchMode } from "../types";
import {
  Search,
  Sparkles,
  Zap,
  ArrowRight,
  Loader2,
  Mic,
  MicOff,
  Camera,
  X,
  Upload,
  Image as ImageIcon,
  TrendingUp,
  Tag,
  ExternalLink,
} from "lucide-react";

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (customQuery?: string) => void;
  onImageSearch: (base64: string, mimeType: string) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  isLoading: boolean;
}

const KNOWLEDGE_SUGGESTIONS = [
  // Roupas & Moda
  { text: "SHEIN Moçambique roupas vestidos e sapatos", category: "Roupas & Acessórios", badge: "SHEIN Oficial" },
  { text: "Zara Moçambique blazer e vestidos elegantes", category: "Roupas & Acessórios", badge: "Zara" },
  { text: "ASOS moda streetwear e calçado importado", category: "Roupas & Acessórios", badge: "ASOS" },
  { text: "Drip Moz sapatilhas Nike Jordan e casacos", category: "Roupas & Acessórios", badge: "Drip Moz" },
  { text: "Roupas femininas e masculinas em Maputo", category: "Roupas & Acessórios", badge: "Tendência" },
  // Imobiliário & Casas
  { text: "Casas para arrendar na Polana e Sommerschield", category: "Imobiliário", badge: "Mais Buscado" },
  { text: "Apartamentos T2 e T3 em Maputo e Matola", category: "Imobiliário", badge: "Destaque" },
  // Automóveis
  { text: "Carros Toyota Hilux e Ractis à venda Maputo", category: "Automóveis", badge: "Stand Moz" },
  { text: "Comprar viaturas importadas do Japão Be Forward", category: "Automóveis", badge: "Importação" },
  // Música & Mídia
  { text: "Músicas moçambicanas e MP3 no Spotify Tubidy", category: "Música & Áudio", badge: "Streaming" },
  // Emprego & Vagas
  { text: "Vagas de emprego recentes em Moçambique Emprego.co.mz", category: "Empregos", badge: "Recente" },
  // Documentação & Serviços
  { text: "Como renovar BI e Passaporte no SENAMI e DIC", category: "Serviços Públicos", badge: "Oficial" },
  // Tecnologia
  { text: "Comprar iPhone 15 e Samsung Galaxy com entrega", category: "Tecnologia", badge: "Destaque" },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onImageSearch,
  searchMode,
  setSearchMode,
  isLoading,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter intelligent suggestions based on current query
  const queryClean = searchQuery.trim().toLowerCase();
  const matchedSuggestions = queryClean.length >= 1
    ? KNOWLEDGE_SUGGESTIONS.filter((s) =>
        s.text.toLowerCase().includes(queryClean) ||
        s.category.toLowerCase().includes(queryClean) ||
        s.badge.toLowerCase().includes(queryClean)
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsInputFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const quickSearches = [
    { label: "🎵 Músicas & MP3", query: "ouvir e baixar músicas no Spotify Tubidy" },
    { label: "🎬 Séries & Filmes", query: "assistir séries e filmes streaming" },
    { label: "🏠 Casas", query: "casas para arrendar em Maputo" },
    { label: "🚗 Carros", query: "carros à venda no stand" },
    { label: "💼 Empregos", query: "vagas de emprego recentes" },
    { label: "📱 Tecnologia", query: "comprar smartphones e laptops" },
    { label: "✈️ Viagens", query: "hotéis e passagens aéreas" },
    { label: "🎮 Jogos PC", query: "jogos grátis e promoções Steam" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSearch();
  };

  // Audio Voice Search using Web Speech API
  const handleToggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("O seu navegador não suporta reconhecimento de voz direto. Por favor digite a sua pesquisa.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-PT";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          setIsListening(false);
          onSearch(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Handle Photo / Image upload
  const handleFileChange = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setSelectedFile({
        base64,
        mimeType: file.type || "image/jpeg",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmPhotoSearch = () => {
    if (!selectedFile) return;
    setIsPhotoModalOpen(false);
    onImageSearch(selectedFile.base64, selectedFile.mimeType);
  };

  return (
    <section className="relative pt-10 pb-14 sm:pt-14 sm:pb-20 overflow-hidden border-b border-zinc-200 dark:border-zinc-800/80 bg-radial-[at_50%_0%] from-amber-500/10 via-transparent to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          SUPER PORTAL INTELIGENTE
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-3">
          O que você precisa{" "}
          <span className="text-amber-500 underline decoration-amber-500/30 decoration-wavy underline-offset-8">
            hoje?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-6 leading-relaxed">
          Pesquise por texto, <strong className="font-semibold text-zinc-900 dark:text-zinc-100">áudio</strong> ou <strong className="font-semibold text-zinc-900 dark:text-zinc-100">foto</strong>. Encontre casas, viaturas, vagas, músicas, filmes, livros, produtos e serviços em Moçambique e no mundo.
        </p>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-inner max-w-md w-full">
            <button
              type="button"
              onClick={() => setSearchMode("ai")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                searchMode === "ai"
                  ? "bg-amber-500 text-zinc-950 shadow-xs shadow-amber-500/20 font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Modo Inteligente (IA)</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchMode("simple")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                searchMode === "simple"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200 dark:border-zinc-700 font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Modo Simples (Direto)</span>
            </button>
          </div>
        </div>

        {/* Search Input Box with Audio, Image Search & Intelligent Suggestions */}
        <div ref={containerRef} className="relative max-w-2xl mx-auto mb-6">
          <form
            onSubmit={handleSubmit}
            className="group"
          >
            <div className="relative flex items-center rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 focus-within:border-amber-500 dark:focus-within:border-amber-500 shadow-lg shadow-zinc-200/50 dark:shadow-none transition-all">
              <div className="pl-4 sm:pl-5 text-zinc-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                id="searchInput"
                type="text"
                value={searchQuery}
                onFocus={() => setIsInputFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsInputFocused(true);
                }}
                placeholder={
                  isListening
                    ? "A escutar a sua voz... fale agora!"
                    : "Pesquise roupas SHEIN, casas, carros, músicas, downloads, empregos..."
                }
                aria-label="Pesquisar no GotYa"
                autoComplete="off"
                className="w-full py-4 pl-3 pr-36 sm:pr-48 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 bg-transparent placeholder:text-zinc-400 focus:outline-hidden"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mr-1 cursor-pointer"
                  title="Limpar texto"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={handleToggleVoiceSearch}
                className={`p-2 sm:p-2.5 rounded-xl transition-colors cursor-pointer mr-1 ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                title={isListening ? "A escutar voz..." : "Pesquisar por Voz / Áudio"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Photo / Image Search Button */}
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer mr-2"
                title="Pesquisa por Foto / Imagem (como no Google Lens)"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="px-4 sm:px-5 py-2.5 mr-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs shadow-amber-500/30 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Buscando</span>
                  </>
                ) : (
                  <>
                    <span>Pesquisar</span>
                    <ArrowRight className="w-4 h-4 hidden sm:inline" />
                  </>
                )}
              </button>
            </div>

            {/* Listening Indicator Banner */}
            {isListening && (
              <div className="mt-2 text-xs font-semibold text-red-500 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Microfone ativado. Fale o que procura...</span>
              </div>
            )}
          </form>

          {/* Autocomplete Intelligence Dropdown Suggestions */}
          {isInputFocused && matchedSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-left">
              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  Sugestões Inteligentes GotYa:
                </span>
                <span className="text-[10px] text-zinc-400 font-normal">Pressione Enter ou clique</span>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {matchedSuggestions.map((item, i) => (
                  <div
                    key={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSearchQuery(item.text);
                      setIsInputFocused(false);
                      onSearch(item.text);
                    }}
                    className="p-3 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {item.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-amber-500/20 group-hover:text-amber-700 dark:group-hover:text-amber-300 font-semibold">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Searches Chips */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 pt-1">
          <span className="text-xs font-semibold text-zinc-400 mr-1 hidden sm:inline">
            Acesso Rápido:
          </span>
          {quickSearches.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(item.query);
                onSearch(item.query);
              }}
              className="px-3 py-1 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300 border border-zinc-200 dark:border-zinc-700/80 transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal for Image / Photo Search */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => {
                setIsPhotoModalOpen(false);
                setImagePreview(null);
                setSelectedFile(null);
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Pesquisa por Foto / Imagem
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Envie a foto de um carro, casa, produto, livro, peça ou dispositivo para o GotYa identificar e encontrar opções diretas de compra ou arrendamento.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-amber-500 bg-zinc-50 dark:bg-zinc-800/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Pré-visualização"
                    className="max-h-48 mx-auto rounded-xl object-contain shadow-sm"
                  />
                  <p className="text-xs text-zinc-500">Clique para escolher outra imagem</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center mx-auto text-zinc-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Arraste uma foto ou clique para carregar
                  </p>
                  <p className="text-xs text-zinc-400">Suporta JPG, PNG, WEBP</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedFile}
                onClick={handleConfirmPhotoSearch}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analisar e Pesquisar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
