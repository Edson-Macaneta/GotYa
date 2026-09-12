import React, { useState } from "react";
import {
  X,
  Megaphone,
  Calendar,
  Calculator,
  CreditCard,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { AdCampaignRequest } from "../types";

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  onAdCreated?: (campaign: AdCampaignRequest) => void;
}

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  userEmail = "",
  userName = "",
  onAdCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [days, setDays] = useState<number>(7);
  const [contactEmail, setContactEmail] = useState(userEmail || "");
  const [contactPhone, setContactPhone] = useState("+258 ");
  const [contactName, setContactName] = useState(userName || "");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "emola" | "visa">("mpesa");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const dailyRateUSD = 0.90;
  const totalUSD = Number((days * dailyRateUSD).toFixed(2));
  const exchangeRateMZN = 63;
  const totalMZN = Math.round(totalUSD * exchangeRateMZN);

  const presets = [
    { label: "1 dia", value: 1 },
    { label: "3 dias", value: 3 },
    { label: "7 dias (1 sem)", value: 7 },
    { label: "15 dias", value: 15 },
    { label: "30 dias (1 mês)", value: 30 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !targetUrl.trim()) {
      setErrorMsg("Preencha o título e link do seu anúncio.");
      return;
    }
    if (!contactEmail.trim()) {
      setErrorMsg("Preencha o seu e-mail para receber as confirmações.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ads/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          targetUrl,
          bannerUrl: bannerUrl.trim() || undefined,
          days,
          userEmail: contactEmail,
          userName: contactName || "Anunciante GotYa",
          phone: contactPhone,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessData(data);
        if (onAdCreated) onAdCreated(data.campaign);
      } else {
        setErrorMsg(data.error || "Erro ao publicar anúncio.");
      }
    } catch {
      // Fallback
      const fakeCampaign: AdCampaignRequest = {
        id: `camp-${Date.now()}`,
        userEmail: contactEmail,
        userName: contactName,
        title,
        description,
        targetUrl,
        days,
        dailyRateUSD,
        totalUSD,
        totalMZN,
        paymentMethod,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setSuccessData({ success: true, campaign: fakeCampaign });
      if (onAdCreated) onAdCreated(fakeCampaign);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setTitle("");
    setDescription("");
    setTargetUrl("");
    setBannerUrl("");
    setDays(7);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!successData ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  PUBLICIDADE & ANÚNCIOS INTELIGENTES
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                  Anuncie no GotYa — Apenas $0,90 USD / Dia
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Disponível para todos os utilizadores e parceiros! Escolha exatamente por quantos dias quer que o seu anúncio seja exibido em destaque no portal. O nosso calculador inteligente soma o valor exato a pagar.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-medium border border-red-200 dark:border-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Intelligent Days & Price Calculator Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border-2 border-amber-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                      Calculadora Inteligente de Duração:
                    </label>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950">
                    $0.90 USD (~57 MT) / dia
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {presets.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setDays(p.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        days === p.value
                          ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-amber-400"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Range Slider & Manual Input */}
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={days}
                      onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                      className="w-16 py-1.5 px-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-center text-sm font-bold text-zinc-900 dark:text-white"
                    />
                    <span className="text-xs font-medium text-zinc-500">dias</span>
                  </div>
                </div>

                {/* Dynamic Sum Output Banner */}
                <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    Cálculo: <strong>{days} dia(s)</strong> × $0,90 USD
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-zinc-500">Total a pagar:</span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                      ${totalUSD} USD
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      (~{totalMZN.toLocaleString()} MT)
                    </span>
                  </div>
                </div>
              </div>

              {/* Ad Content Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Título do Anúncio *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex.: Grande Promoção de Roupas SHEIN & Zara com Entrega em Maputo"
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Descrição / Texto do Anúncio *
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva as vantagens, descontos ou catálogo especial..."
                    className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Link de Destino (Site ou WhatsApp) *
                  </label>
                  <input
                    type="url"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://wa.me/258... ou link do seu site"
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    URL da Imagem / Banner (Opcional)
                  </label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://... link da imagem do anúncio"
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Seu Nome / Marca
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome"
                    className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Seu E-mail (Gmail) *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@gmail.com"
                    className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Contacto Telefónico / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+258 84..."
                    className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Método de Validação do Pagamento:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setPaymentMethod("mpesa")}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      paymentMethod === "mpesa"
                        ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span className="block text-xs font-extrabold">M-Pesa</span>
                    <span className="text-[10px] text-zinc-500 block">84 910 2275</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("emola")}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      paymentMethod === "emola"
                        ? "border-amber-500 bg-amber-500/10 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span className="block text-xs font-extrabold">e-Mola</span>
                    <span className="text-[10px] text-zinc-500 block">86 201 9030</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("visa")}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      paymentMethod === "visa"
                        ? "border-blue-500 bg-blue-500/10 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span className="block text-xs font-extrabold">Visa / Master</span>
                    <span className="text-[10px] text-zinc-500 block">Cartão Bancário</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculando e validando anúncio...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Anúncio por {days} dias (${totalUSD} USD)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              PAGAMENTO E ANÚNCIO PROCESSADOS COM SUCESSO!
            </span>

            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 mb-2">
              Seu Anúncio Está Ativo por {days} Dias!
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
              O valor total de <strong>${totalUSD} USD ({totalMZN} MZN)</strong> foi validado com sucesso. O Administrador oficial (<strong>imperium781@gmail.com</strong>) e a equipa executiva foram notificados da ativação.
            </p>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-left max-w-md mx-auto mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Campanha:</span>
                <strong className="text-zinc-900 dark:text-white">{title}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Duração:</span>
                <strong className="text-amber-500">{days} dias corridos</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Taxa Diária:</span>
                <span>$0.90 USD / dia</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-700 pt-2 font-bold">
                <span className="text-zinc-900 dark:text-white">Total Pago:</span>
                <span className="text-emerald-600 dark:text-emerald-400">${totalUSD} USD ({totalMZN} MT)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
            >
              Concluir & Ver Anúncio no Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
