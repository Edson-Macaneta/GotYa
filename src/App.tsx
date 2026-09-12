import React, { useState, useEffect } from "react";
import {
  SearchMode,
  UserAccount,
  SearchHistoryItem,
  TaskItem,
  FavoriteItem,
  PortalLink,
  AiSearchResult,
  PartnerSubmission,
  CategoryData,
  CurrencyCode,
  LanguageCode,
  PartnerProduct,
  LocationOption,
  ReportTicket,
} from "./types";
import { CATEGORIES_DATA } from "./data/categories";
import { LOCATIONS_LIST } from "./data/locationsAndDestinations";
import { Header } from "./components/Header";
import { HeroSearch } from "./components/HeroSearch";
import { DailyTopSites } from "./components/DailyTopSites";
import { SearchResults } from "./components/SearchResults";
import { CategoryExplorer } from "./components/CategoryExplorer";
import { PartnerMarketplace } from "./components/PartnerMarketplace";
import { PersonalSpace } from "./components/PersonalSpace";
import { PartnerBanner } from "./components/PartnerBanner";
import { PartnerModal } from "./components/PartnerModal";
import { PartnerDashboardModal } from "./components/PartnerDashboardModal";
import { AuthModal } from "./components/AuthModal";
import { AccountModal } from "./components/AccountModal";
import { LocationModal } from "./components/LocationModal";
import { ReportModal } from "./components/ReportModal";
import { AdminModal } from "./components/AdminModal";
import { ContactModal } from "./components/ContactModal";
import { Footer } from "./components/Footer";

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("gotya_theme");
    return saved ? saved === "dark" : false;
  });

  // Currency & Language
  const [currency, setCurrency] = useState<CurrencyCode>("MZN");
  const [language, setLanguage] = useState<LanguageCode>("pt");

  // Search Mode: "ai" or "simple"
  const [searchMode, setSearchMode] = useState<SearchMode>("ai");

  // Dynamic Categories (Managed by ADM Studio)
  const [categories, setCategories] = useState<CategoryData[]>(() => {
    const saved = localStorage.getItem("gotya_categories");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return CATEGORIES_DATA;
      }
    }
    return CATEGORIES_DATA;
  });

  // User state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("gotya_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMandatoryAuth, setIsMandatoryAuth] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isPartnerDashboardOpen, setIsPartnerDashboardOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(() => {
    const saved = localStorage.getItem("gotya_location");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return LOCATIONS_LIST[0];
      }
    }
    return LOCATIONS_LIST[0];
  });
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState({ url: "", title: "" });

  const handleOpenReport = (url?: string, title?: string) => {
    setReportTarget({
      url: url || "",
      title: title || "Resultado ou Link GotYa",
    });
    setIsReportOpen(true);
  };

  const handleSelectLocation = (loc: LocationOption) => {
    setSelectedLocation(loc);
    localStorage.setItem("gotya_location", JSON.stringify(loc));
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("gotya_user", JSON.stringify(updatedUser));
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [activeSearchMode, setActiveSearchMode] = useState<SearchMode>("ai");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
  const [simpleResults, setSimpleResults] = useState<PortalLink[]>([]);
  const [showResults, setShowResults] = useState(false);

  // History state
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem("gotya_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: "h-1",
        query: "casas para arrendar em Maputo",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        mode: "ai",
      },
      {
        id: "h-2",
        query: "carros à venda no stand",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        mode: "simple",
      },
    ];
  });

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem("gotya_tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: "t-1",
        title: "Comparar preços de viaturas importadas no stand",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "t-2",
        title: "Agendar visita ao apartamento na Polana",
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "t-3",
        title: "Atualizar currículo para vaga de TI",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem("gotya_favorites");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: "fav-1",
        title: "Be Forward Moçambique",
        url: "https://www.beforward.jp",
        category: "Carros & Automóveis",
        description: "Maior exportador de viaturas japonesas usadas para Moçambique.",
        badge: "Importação Direta",
        savedAt: new Date().toISOString(),
      },
      {
        id: "fav-2",
        title: "Imobiliária Maputo Prime",
        url: "https://www.google.com/search?q=casas+arrendar+polana+sommerschield+maputo",
        category: "Casas & Imóveis",
        description: "Apartamentos na Polana e Sommerschield com vistoria.",
        badge: "Parceiro Verificado",
        savedAt: new Date().toISOString(),
      },
    ];
  });

  // Partners state
  const [partnersList, setPartnersList] = useState<PartnerSubmission[]>([]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("gotya_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("gotya_theme", "light");
    }
  }, [darkMode]);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("gotya_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("gotya_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("gotya_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("gotya_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("gotya_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("gotya_user");
    }
  }, [currentUser]);

  // Load partners on mount
  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPartnersList(data);
        }
      })
      .catch(() => {
        // fallback
      });
  }, []);

  // Handle Login / Registration
  const handleLogin = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === "imperium781@gmail.com";
    const partnerRecord = partnersList.find((p) => p.email.toLowerCase() === cleanEmail);

    const user: UserAccount = {
      email: cleanEmail,
      isAdmin,
      isPartner: !!partnerRecord && partnerRecord.status === "approved",
      partnerTier: partnerRecord ? partnerRecord.tier : undefined,
      registeredAt: new Date().toISOString(),
    };
    setCurrentUser(user);

    // Resume search if paused
    if (pendingQuery) {
      executeSearch(pendingQuery, searchMode);
      setPendingQuery(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Dynamic Category & Link Admin Handlers
  const handleAddCategory = (cat: CategoryData) => {
    setCategories((prev) => [...prev, cat]);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const handleAddLinkToCategory = (catId: string, link: any) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          return {
            ...c,
            itemCount: c.portals.length + 1,
            portals: [...c.portals, link],
          };
        }
        return c;
      })
    );
  };

  const handleDeleteLinkFromCategory = (catId: string, linkId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          return {
            ...c,
            itemCount: Math.max(0, c.portals.length - 1),
            portals: c.portals.filter((p) => p.id !== linkId),
          };
        }
        return c;
      })
    );
  };

  // Execute Search Function
  const executeSearch = async (queryText: string, modeToUse: SearchMode) => {
    const q = queryText.trim();
    if (!q) return;

    // Requirement: user first time must identify via email
    if (!currentUser) {
      setPendingQuery(q);
      setIsMandatoryAuth(true);
      setIsAuthOpen(true);
      return;
    }

    setActiveQuery(q);
    setActiveSearchMode(modeToUse);
    setShowResults(true);
    setIsLoading(true);

    // Record in history
    const historyItem: SearchHistoryItem = {
      id: `h-${Date.now()}`,
      query: q,
      timestamp: new Date().toISOString(),
      mode: modeToUse,
    };
    setHistory((prev) => [
      historyItem,
      ...prev.filter((item) => item.query.toLowerCase() !== q.toLowerCase()),
    ]);

    // Smooth scroll to results
    setTimeout(() => {
      const el = document.getElementById("resultados");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    if (modeToUse === "ai") {
      try {
        const response = await fetch("/api/search/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, userEmail: currentUser.email }),
        });
        const json = await response.json();
        if (json && json.data) {
          setAiResult(json.data);
        }
      } catch (err) {
        console.error("AI search failed:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simple Direct Mode
      const qLower = q.toLowerCase();
      const allPortals: PortalLink[] = [];
      categories.forEach((cat) => {
        cat.portals.forEach((p) => {
          allPortals.push(p);
        });
      });

      const matched = allPortals.filter((p) => {
        const matchTitle = p.title.toLowerCase().includes(qLower);
        const matchDesc = p.description.toLowerCase().includes(qLower);
        const matchCat = p.category.toLowerCase().includes(qLower);
        const matchTag = p.tag.toLowerCase().includes(qLower);
        const matchLoc = p.location?.toLowerCase().includes(qLower);
        return matchTitle || matchDesc || matchCat || matchTag || matchLoc;
      });

      if (matched.length > 0) {
        setSimpleResults(matched);
      } else {
        setSimpleResults(allPortals.slice(0, 6));
      }
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (customQuery?: string) => {
    const q = customQuery || searchQuery;
    executeSearch(q, searchMode);
  };

  const handleClearResults = () => {
    setShowResults(false);
    setActiveQuery("");
    setAiResult(null);
    setSimpleResults([]);
  };

  const handleChangeResultMode = (newMode: SearchMode) => {
    setSearchMode(newMode);
    executeSearch(activeQuery, newMode);
  };

  // Task Handlers
  const handleAddTask = (title: string) => {
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Favorites Handlers
  const handleToggleFavorite = (portal: {
    title: string;
    url: string;
    category: string;
    description: string;
    badge?: string;
  }) => {
    const existing = favorites.find((f) => f.url === portal.url);
    if (existing) {
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
    } else {
      const newFav: FavoriteItem = {
        id: `fav-${Date.now()}`,
        title: portal.title,
        url: portal.url,
        category: portal.category,
        description: portal.description,
        badge: portal.badge,
        savedAt: new Date().toISOString(),
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  const isFavorite = (url: string) => {
    return favorites.some((f) => f.url === url);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  // History Handlers
  const handleSelectHistoryQuery = (q: string, mode: SearchMode) => {
    setSearchQuery(q);
    setSearchMode(mode);
    executeSearch(q, mode);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Admin Handler for Partners
  const handleUpdatePartnerStatus = async (
    id: string,
    status: "pending" | "approved" | "contacted" | "rejected",
    tier?: "simples" | "premium" | "premium_pro"
  ) => {
    try {
      await fetch(`/api/partners/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, tier }),
      });
    } catch {
      // offline fallback
    }
    setPartnersList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, ...(tier ? { tier } : {}) } : p))
    );
  };

  // Current partner object if user is partner
  const currentPartner = currentUser
    ? partnersList.find((p) => p.email.toLowerCase() === currentUser.email.toLowerCase()) || null
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-200">
      {/* Top Header */}
      <Header
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsMandatoryAuth(false);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenPartnerDashboard={() => setIsPartnerDashboardOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAccount={() => {
          if (currentUser) {
            setIsAccountOpen(true);
          } else {
            setIsMandatoryAuth(false);
            setIsAuthOpen(true);
          }
        }}
        onOpenLocation={() => setIsLocationOpen(true)}
        selectedLocationName={selectedLocation.name}
      />

      <main className="flex-1">
        {/* Hero & Multi-modal Search Box */}
        <HeroSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearchSubmit}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          isLoading={isLoading}
        />

        {/* Sites em Destaque do Dia (Daily Top Sites) */}
        <DailyTopSites
          onSelectQuery={(q) => {
            setSearchQuery(q);
            executeSearch(q, searchMode);
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />

        {/* Search Results Area */}
        {showResults && (
          <SearchResults
            query={activeQuery}
            activeMode={activeSearchMode}
            aiResult={aiResult}
            simpleResults={simpleResults}
            isLoading={isLoading}
            onClear={handleClearResults}
            onSelectQuery={(q) => {
              setSearchQuery(q);
              executeSearch(q, searchMode);
            }}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onChangeMode={handleChangeResultMode}
            onOpenReport={handleOpenReport}
          />
        )}

        {/* Category Explorer (Dynamic from ADM Studio) */}
        <CategoryExplorer
          categories={categories}
          onSearchCategory={(catName, popularQuery) => {
            setSearchQuery(popularQuery);
            executeSearch(popularQuery, searchMode);
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />

        {/* Partner Marketplace (Simples vs Premium priority) */}
        <PartnerMarketplace
          currency={currency}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        />

        {/* Meu Espaço: Tarefas, Favoritos e Histórico */}
        <PersonalSpace
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
          history={history}
          onSelectHistoryQuery={handleSelectHistoryQuery}
          onClearHistory={handleClearHistory}
          currentUser={currentUser}
          onOpenAuth={() => {
            setIsMandatoryAuth(false);
            setIsAuthOpen(true);
          }}
        />

        {/* Banner para Empresas / Parceiros */}
        <PartnerBanner onOpenPartnerModal={() => setIsPartnerModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        searchMode={searchMode}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        isAdmin={currentUser?.isAdmin}
      />

      {/* Authentication / Google Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingQuery(null);
        }}
        onLogin={handleLogin}
        isMandatoryForSearch={isMandatoryAuth}
      />

      {/* Partner Registration Modal */}
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        onSuccess={(newPartner) => {
          setPartnersList((prev) => [newPartner, ...prev]);
        }}
      />

      {/* Partner Dashboard Modal (Products, Ads, Sub-users) */}
      <PartnerDashboardModal
        isOpen={isPartnerDashboardOpen}
        onClose={() => setIsPartnerDashboardOpen(false)}
        currentUser={currentUser}
        partner={currentPartner}
        currency={currency}
      />

      {/* Admin Studio & Control Modal (imperium781@gmail.com) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        adminEmail="imperium781@gmail.com"
        allHistory={history}
        partnersList={partnersList}
        onUpdatePartnerStatus={handleUpdatePartnerStatus}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddLinkToCategory={handleAddLinkToCategory}
        onDeleteLinkFromCategory={handleDeleteLinkFromCategory}
      />

      {/* Contact & Support Modal (WhatsApp, Instagram, Moz Contacts) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Account / Profile & Security Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        history={history}
        onSelectHistoryQuery={handleSelectHistoryQuery}
        onClearHistory={handleClearHistory}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Trust & Safety Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetUrl={reportTarget.url}
        targetTitle={reportTarget.title}
        currentUser={currentUser}
        onReportSubmitted={(ticket) => {
          console.log("Denúncia registada no GotYa Trust & Safety:", ticket);
        }}
      />
    </div>
  );
}
