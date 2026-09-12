import React, { useState } from "react";
import { SearchHistoryItem, TaskItem, FavoriteItem, UserAccount } from "../types";
import {
  CheckSquare,
  Bookmark,
  History,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  Clock,
  UserCheck,
} from "lucide-react";

interface PersonalSpaceProps {
  tasks?: TaskItem[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  favorites?: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  history?: SearchHistoryItem[];
  onSelectHistoryQuery: (query: string, mode: "ai" | "simple") => void;
  onClearHistory: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const PersonalSpace: React.FC<PersonalSpaceProps> = ({
  tasks = [],
  onAddTask,
  onToggleTask,
  onDeleteTask,
  favorites = [],
  onRemoveFavorite,
  history = [],
  onSelectHistoryQuery,
  onClearHistory,
  currentUser,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<"tasks" | "favorites" | "history">("tasks");
  const [newTaskInput, setNewTaskInput] = useState("");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    onAddTask(newTaskInput.trim());
    setNewTaskInput("");
  };

  return (
    <section id="ferramentas" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            MEU ESPAÇO
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Organize o seu dia
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Gestão integrada de tarefas cotidianas, favoritos de navegação e histórico pessoal de pesquisas.
          </p>
        </div>

        {/* User email status pill */}
        {currentUser ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium self-start sm:self-auto">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sessão ativa: <strong>{currentUser.email}</strong></span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all self-start sm:self-auto shadow-xs"
          >
            <span>Registar E-mail para Salvar Dados</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-sm font-semibold transition-colors shrink-0 ${
            activeTab === "tasks"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tarefas</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {tasks.filter((t) => !t.completed).length} pendentes
          </span>
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-sm font-semibold transition-colors shrink-0 ${
            activeTab === "favorites"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Favoritos</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {favorites.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 text-sm font-semibold transition-colors shrink-0 ${
            activeTab === "history"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Histórico de Pesquisas</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {history.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Tasks Content */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          {/* New Task Input */}
          <form onSubmit={handleCreateTask} className="flex gap-2 max-w-2xl">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Ex.: Ligar para o stand de carros, agendar visita ao apartamento..."
              className="flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!newTaskInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </form>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <CheckSquare className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Nenhuma tarefa anotada ainda
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Adicione compromissos, pesquisas pendentes e lembretes para o seu dia.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-w-3xl">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    task.completed
                      ? "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/80 opacity-60"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <div
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        task.completed
                          ? "bg-amber-500 border-amber-500 text-zinc-950"
                          : "border-zinc-300 dark:border-zinc-600 hover:border-amber-500"
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm ${
                        task.completed
                          ? "line-through text-zinc-500"
                          : "text-zinc-800 dark:text-zinc-200 font-medium"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-lg"
                    title="Remover tarefa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favorites Content */}
      {activeTab === "favorites" && (
        <div>
          {favorites.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <Bookmark className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Nenhum portal ou link salvo nos favoritos
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Ao pesquisar no GotYa ou navegar pelas categorias, clique no ícone de marcador para guardar seus portais prediletos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        {fav.category}
                      </span>
                      <button
                        onClick={() => onRemoveFavorite(fav.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                      {fav.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
                      {fav.description}
                    </p>
                  </div>

                  <a
                    href={fav.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold transition-colors"
                  >
                    <span>Acessar Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Search History Content */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Registo Cronológico de Pesquisas
            </span>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Limpar todo o histórico
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <History className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Seu histórico de pesquisas está vazio
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Todas as buscas que você realizar (em Modo IA ou Modo Simples) ficarão registadas aqui com data e horário para consulta imediata.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-w-3xl">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      {item.mode === "ai" ? (
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                        {item.query}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.timestamp).toLocaleString("pt-BR")}</span>
                        <span>•</span>
                        <span className="font-semibold">
                          {item.mode === "ai" ? "Modo IA" : "Modo Simples"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectHistoryQuery(item.query, item.mode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                    title="Repetir esta pesquisa"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Repetir</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
