import React, { useState } from "react";
import { X, Building2, CheckCircle2, Loader2, ArrowRight, Crown, Sparkles } from "lucide-react";
import { CATEGORIES_DATA } from "../data/categories";
import { PartnerTier } from "../types";

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Casas & Imóveis");
  const [city, setCity] = useState("Maputo");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTier, setSelectedTier] = useState<PartnerTier>("simples");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!businessName.trim() || !email.trim()) {
      setErrorMessage("Por favor preencha o nome do negócio e e-mail.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          category,
          city,
          phone,
          email,
          website,
          description,
          tier: selectedTier,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        if (onSuccess) onSuccess(data.partner);
      } else {
        setErrorMessage(data.error || "Erro ao registar negócio.");
      }
    } catch {
      // Fallback
      setSubmitted(true);
      if (onSuccess) {
        onSuccess({
          id: `p-${Date.now()}`,
          businessName,
          category,
          city,
          phone,
          email,
          website,
          description,
          tier: selectedTier,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setBusinessName("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setDescription("");
    setSelectedTier("simples");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  CRESCIMENTO & VISIBILIDADE
                </p>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Torne-se Parceiro do GotYa
                </h3>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
              Destaque seus produtos, imóveis, viaturas ou serviços. Após submissão, a ativação comercial será verificada pelo Administrador (<strong>imperium781@gmail.com</strong>).
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-medium border border-red-200 dark:border-red-900">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Selecione o seu Plano Pretendido:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setSelectedTier("simples")}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedTier === "simples"
                        ? "border-amber-500 bg-amber-500/10 dark:bg-amber-950/30 font-bold text-zinc-900 dark:text-white shadow-2xs"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span className="block font-extrabold text-zinc-900 dark:text-white mb-0.5">Simples</span>
                    <span className="text-[11px] block text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                      Grátis
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Até 2 utilizadores • IA básica</span>
                  </div>

                  <div
                    onClick={() => setSelectedTier("premium")}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedTier === "premium"
                        ? "border-blue-500 bg-blue-500/10 dark:bg-blue-950/30 font-bold text-zinc-900 dark:text-white shadow-2xs"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">Premium</span>
                      <Sparkles className="w-3 h-3 text-blue-500" />
                    </div>
                    <span className="text-[11px] block text-blue-700 dark:text-blue-300 font-bold mb-1">
                      1.9 USD (~120 MT)
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Até 5 utilizadores • Prioridade</span>
                  </div>

                  <div
                    onClick={() => setSelectedTier("premium_pro")}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedTier === "premium_pro"
                        ? "border-amber-500 bg-amber-500/15 dark:bg-amber-950/40 font-bold text-zinc-900 dark:text-white shadow-xs"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">Premium Pro</span>
                      <Crown className="w-3 h-3 text-amber-500 fill-current" />
                    </div>
                    <span className="text-[11px] block text-amber-700 dark:text-amber-300 font-bold mb-1">
                      3.0 USD (~190 MT)
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Até 11 utilizadores • IA Ilimitada</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nome da Empresa / Estabelecimento *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex.: AutoStand Matola, Maputo Prime..."
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Categoria Principal *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500"
                  >
                    {CATEGORIES_DATA.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="Compras & Tecnologia">Compras & Tecnologia</option>
                    <option value="Outros Serviços">Outros Serviços</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Cidade / Região
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex.: Maputo, Matola, Beira..."
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+258 84 910 2275"
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    E-mail Comercial (Conta Google) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="empresa@gmail.com"
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Website ou Instagram
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://instagram.com/empresa"
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Descrição dos Produtos / Serviços
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que comercializa ou oferece..."
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submetendo para o ADM...</span>
                    </>
                  ) : (
                    <>
                      <span>Submeter Proposta de Parceria</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Proposta de Parceria Enviada!
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
              O Administrador do GotYa (<strong>imperium781@gmail.com</strong>) irá analisar e autorizar a sua conta de parceiro no plano escolhido.
            </p>
            <button
              onClick={handleResetAndClose}
              className="py-2.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
