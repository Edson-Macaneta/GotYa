import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  FileText,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  MessageSquare,
  Bot,
  Send,
  Loader2,
  Copy,
} from "lucide-react";
import { PartnerTier } from "../types";

interface PartnerWorkspaceProps {
  partnerTier: PartnerTier;
  partnerEmail: string;
  partnerBusinessName: string;
  onUpgradeClick: () => void;
}

export const PartnerWorkspace: React.FC<PartnerWorkspaceProps> = ({
  partnerTier,
  partnerEmail,
  partnerBusinessName,
  onUpgradeClick,
}) => {
  const isPremiumOrPro = partnerTier === "premium" || partnerTier === "premium_pro";
  const isPro = partnerTier === "premium_pro";

  // AI Assistant in Workspace
  const [prompt, setPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiUsageCount, setAiUsageCount] = useState(0);

  // Proforma / Quote state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemUnitPrice, setItemUnitPrice] = useState(5000);
  const [quoteGenerated, setQuoteGenerated] = useState(false);

  // Digital card / QR Code state
  const [copiedLink, setCopiedLink] = useState(false);

  // Tier limit: Simples = 5, Premium = 50, Pro = Unlimited
  const maxAiQueries = isPro ? Infinity : partnerTier === "premium" ? 50 : 5;

  const handleRunAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (aiUsageCount >= maxAiQueries) {
      alert(
        `Limite diário de IA atingido para o plano ${partnerTier.toUpperCase()}. Faça upgrade para o Premium Pro para IA Ilimitada!`
      );
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Como parceiro GotYa (${partnerBusinessName}, plano ${partnerTier}), ajude com: ${prompt}`,
          history: [],
        }),
      });
      const data = await res.json();
      setAiResponse(data.reply || "Resposta gerada com sucesso pela GotYa IA.");
      setAiUsageCount((prev) => prev + 1);
    } catch {
      setAiResponse(
        `Dica estratégica GotYa para ${partnerBusinessName}: Otimize os títulos dos seus produtos com termos buscados localmente em Moçambique (ex: 'Maputo', 'Matola', 'Pronta Entrega') para duplicar as suas conversões no marketplace.`
      );
      setAiUsageCount((prev) => prev + 1);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyCatalogLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/?partner=${encodeURIComponent(partnerEmail)}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Ferramentas Empresariais GotYa
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Recursos de produtividade, orçamentos, inteligência de vendas e automação para a sua empresa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            GotYa IA:{" "}
            <strong className="text-amber-600 dark:text-amber-400">
              {isPro ? "Ilimitada" : `${aiUsageCount} / ${maxAiQueries} usadas hoje`}
            </strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: GotYa IA Assistente de Vendas */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  GotYa IA Copilot de Vendas
                </h4>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isPro
                    ? "bg-amber-500 text-zinc-950"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {isPro ? "Ilimitado" : partnerTier === "premium" ? "50/dia" : "Limitado (5/dia)"}
              </span>
            </div>

            <p className="text-xs text-zinc-500 mb-3">
              Peça à IA para redigir descrições que vendem mais, sugerir preços competitivos em Moçambique ou criar respostas prontas para clientes no WhatsApp.
            </p>

            <form onSubmit={handleRunAi} className="space-y-2 mb-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Crie um texto persuasivo para vender um iPhone 14 Pro novo..."
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={aiLoading || (!isPro && aiUsageCount >= maxAiQueries)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Consultar Assistente IA</span>
                  </>
                )}
              </button>
            </form>

            {aiResponse && (
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                {aiResponse}
              </div>
            )}
          </div>

          {!isPro && (
            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Quer IA sem limites diários?</span>
              <button
                onClick={onUpgradeClick}
                className="text-amber-600 font-bold hover:underline cursor-pointer"
              >
                Upgrade Premium Pro
              </button>
            </div>
          )}
        </div>

        {/* Tool 2: Gerador de Cotações & Proformas (Moçambique) */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Gerador de Cotação / Fatura Proforma
              </h4>
            </div>
            {!isPremiumOrPro && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                <Lock className="w-3 h-3" /> Premium
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-500 mb-3">
            Gere proformas profissionais em Meticais (MZN) prontas para imprimir ou enviar pelo WhatsApp com NUIT e dados de pagamento M-Pesa.
          </p>

          {!isPremiumOrPro ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
              <Lock className="w-6 h-6 text-amber-500 mx-auto" />
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Disponível nos planos Premium e Premium Pro
              </p>
              <button
                onClick={onUpgradeClick}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-extrabold cursor-pointer"
              >
                Desbloquear Faturas & Cotações
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome do Cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Contacto WhatsApp"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Descrição do Item / Serviço"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="col-span-2 py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
                />
                <input
                  type="number"
                  placeholder="Preço (MZN)"
                  value={itemUnitPrice}
                  onChange={(e) => setItemUnitPrice(Number(e.target.value))}
                  className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
                />
              </div>

              <button
                onClick={() => setQuoteGenerated(true)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Gerar Documento Proforma</span>
              </button>

              {quoteGenerated && (
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/40 text-xs space-y-2">
                  <div className="flex justify-between border-b pb-1 font-bold">
                    <span>COTAÇÃO #{Math.floor(1000 + Math.random() * 9000)}</span>
                    <span className="text-emerald-600">{itemUnitPrice} MZN</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Cliente: <strong>{clientName || "Cliente Geral"}</strong> • Emissor:{" "}
                    <strong>{partnerBusinessName}</strong>
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold"
                    >
                      Imprimir / Salvar PDF
                    </button>
                    <a
                      href={`https://wa.me/?text=Olá! Segue a cotação oficial da ${encodeURIComponent(
                        partnerBusinessName
                      )}: ${itemDescription || "Serviço"} no valor de ${itemUnitPrice} MZN.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 rounded bg-emerald-500 text-white text-center text-[11px] font-bold"
                    >
                      Enviar WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tool 3: Catálogo Digital com Link & QR Code */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              Link do Catálogo & Cartão Digital
            </h4>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Compartilhe a vitrine exclusiva da sua empresa com clientes por redes sociais, cartões ou balcão de atendimento.
          </p>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/?partner=${encodeURIComponent(partnerEmail)}`}
              className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono text-zinc-600 dark:text-zinc-300"
            />
            <button
              onClick={handleCopyCatalogLink}
              className="px-3 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedLink ? "Copiado!" : "Copiar"}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs">
            <span className="text-zinc-700 dark:text-zinc-300">
              Produtos filtrados diretamente para a sua marca no GotYa
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">Ativo</span>
          </div>
        </div>

        {/* Tool 4: Selos e Credenciais de Verificação GotYa */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Selo de Autenticidade & Anti-Fraude
              </h4>
            </div>
            <p className="text-xs text-zinc-500 mb-3">
              Sua empresa é protegida pela IA GotYa contra clonagem, perfis falsos e fraudes de preços.
            </p>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                G
              </div>
              <div>
                <span className="block font-bold text-xs text-zinc-900 dark:text-white">
                  {partnerBusinessName}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Parceiro Verificado no GotYa Moçambique
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 mt-3">
            O selo é renderizado automaticamente em todas as buscas nos seus produtos.
          </p>
        </div>
      </div>
    </div>
  );
};
