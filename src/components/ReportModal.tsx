import React, { useState } from "react";
import { ReportTicket, UserAccount } from "../types";
import { X, AlertTriangle, ShieldAlert, CheckCircle2, Lock, Send } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
  targetTitle?: string;
  currentUser?: UserAccount | null;
  onReportSubmitted?: (ticket: ReportTicket) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUrl = "https://exemplo.co.mz/pagina",
  targetTitle = "Resultado ou Link de Pesquisa",
  currentUser,
  onReportSubmitted,
}) => {
  const [reportType, setReportType] = useState<
    "Fraude" | "Conteúdo Adulto" | "Link Suspeito" | "Phishing" | "Outro"
  >("Fraude");
  const [url, setUrl] = useState(targetUrl);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<ReportTicket | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const calculatedRiskScore =
      reportType === "Fraude"
        ? 94
        : reportType === "Phishing"
        ? 96
        : reportType === "Conteúdo Adulto"
        ? 98
        : 75;

    const reportNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: ReportTicket = {
      id: `rep-${Date.now()}`,
      reportNumber,
      type: reportType,
      url: url || targetUrl,
      reportedBy: currentUser?.email || "usuario.anonimo@gotya.co.mz",
      reportedAt: new Date().toLocaleString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      riskScore: calculatedRiskScore,
      status: "pending",
      notes: details.trim() || undefined,
    };

    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });
    } catch {
      // safe fallback
    }

    if (onReportSubmitted) {
      onReportSubmitted(newTicket);
    }

    setSubmittedTicket(newTicket);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedTicket ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                DENÚNCIA REGISTADA COM SUCESSO
              </span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Ticket {submittedTicket.reportNumber}
              </h3>
            </div>

            {/* Ticket Card Preview */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 text-left text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Tipo:</span>
                <span className="font-bold text-red-500">{submittedTicket.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">URL / Destino:</span>
                <span className="font-mono text-[11px] truncate max-w-[200px] text-zinc-800 dark:text-zinc-200">
                  {submittedTicket.url}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Usuário:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {submittedTicket.reportedBy}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Data:</span>
                <span className="text-zinc-600 dark:text-zinc-400">{submittedTicket.reportedAt}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-zinc-200 dark:border-zinc-700">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Risk Score:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-black bg-red-500/15 text-red-600 dark:text-red-400">
                  {submittedTicket.riskScore}/100
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              O GotYa Trust & Safety foi notificado. A nossa equipa de moderação humana irá investigar o link e aplicar o bloqueio preventivo se for confirmada infração.
            </p>

            <button
              onClick={() => {
                setSubmittedTicket(null);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                  Denunciar Conteúdo ou Link
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  GotYa Trust & Safety • Sistema Anti-Burla
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tipo de Infração:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500"
              >
                <option value="Fraude">Fraude / Burla Financeira / Falso M-Pesa</option>
                <option value="Phishing">Phishing / Roubo de Dados ou Senhas</option>
                <option value="Conteúdo Adulto">Conteúdo Adulto / Pornografia / Proibido</option>
                <option value="Link Suspeito">Link Quebrado / Malicioso / Vírus</option>
                <option value="Outro">Outro Motivo</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                URL ou Referência do Item:
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Detalhes adicionais (opcional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Explique resumidamente o motivo da denúncia (ex: pediram dinheiro adiantado, site falso)..."
                className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500 resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <span>
                As denúncias falsas com intuito de prejudicar parceiros legítimos são monitoradas e sujeitas a restrição de acesso.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Enviando..." : "Submeter Denúncia"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
