import React from "react";
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react";

interface PartnerBannerProps {
  onOpenPartnerModal: () => void;
}

export const PartnerBanner: React.FC<PartnerBannerProps> = ({ onOpenPartnerModal }) => {
  return (
    <section id="parceiros" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-900 text-white p-8 sm:p-12 border border-zinc-800 shadow-xl">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase mb-4 border border-amber-500/30">
              <Building2 className="w-3.5 h-3.5" />
              PARA EMPRESAS & FORNECEDORES
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Quer colocar o seu negócio no <span className="text-amber-400">GotYa?</span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
              Empresas, agências imobiliárias, concessionárias, prestadores de serviços e recrutadores podem criar perfis verificados, promover ofertas em destaque e receber clientes interessados diretamente via WhatsApp ou portal.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Destaque por categoria
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Contacto direto via WhatsApp
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Painel de gestão de leads
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenPartnerModal}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <span>Quero ser parceiro</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
