import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  CheckCircle2,
  Loader2,
  Save,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

interface PartnerProfileEditorProps {
  partnerId: string;
  defaultName?: string;
  defaultEmail?: string;
}

export const PartnerProfileEditor: React.FC<PartnerProfileEditorProps> = ({
  partnerId,
  defaultName = "",
  defaultEmail = "",
}) => {
  const [businessName, setBusinessName] = useState(defaultName);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Casas & Imóveis");
  const [nuit, setNuit] = useState("");
  const [province, setProvince] = useState("Maputo Cidade");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("+258 ");
  const [email, setEmail] = useState(defaultEmail);
  const [website, setWebsite] = useState("");
  const [whatsapp, setWhatsapp] = useState("+258 ");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Load existing profile from API
    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/partners/${encodeURIComponent(partnerId)}/profile`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setBusinessName(data.businessName || defaultName);
            setDescription(data.description || "");
            setCategory(data.category || "Casas & Imóveis");
            setNuit(data.nuit || "");
            setProvince(data.province || "Maputo Cidade");
            setAddress(data.address || "");
            setPhone(data.phone || "+258 ");
            setEmail(data.email || defaultEmail);
            setWebsite(data.website || "");
            setWhatsapp(data.whatsapp || "+258 ");
            setFacebook(data.facebook || "");
            setInstagram(data.instagram || "");
            setLinkedin(data.linkedin || "");
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    loadProfile();
  }, [partnerId, defaultName, defaultEmail]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/partners/${encodeURIComponent(partnerId)}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          description,
          category,
          nuit,
          province,
          address,
          phone,
          email,
          website,
          whatsapp,
          facebook,
          instagram,
          linkedin,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save profile error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Perfil Corporativo da Empresa
            </h3>
          </div>
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Alterações salvas com sucesso!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Nome Comercial / Razão Social *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ex: AutoStand Maputo Lda"
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              NUIT (Número de Identificação Tributária)
            </label>
            <input
              type="text"
              value={nuit}
              onChange={(e) => setNuit(e.target.value)}
              placeholder="Ex: 400123456"
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Descrição e Apresentação da Empresa
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a atividade da empresa, anos no mercado e especialidades..."
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Província / Região
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
            >
              <option value="Maputo Cidade">Maputo Cidade</option>
              <option value="Maputo Província / Matola">Maputo Província / Matola</option>
              <option value="Gaza">Gaza</option>
              <option value="Inhambane">Inhambane</option>
              <option value="Sofala / Beira">Sofala / Beira</option>
              <option value="Manica / Chimoio">Manica / Chimoio</option>
              <option value="Tete">Tete</option>
              <option value="Zambézia / Quelimane">Zambézia / Quelimane</option>
              <option value="Nampula">Nampula</option>
              <option value="Cabo Delgado / Pemba">Cabo Delgado / Pemba</option>
              <option value="Niassa / Lichinga">Niassa / Lichinga</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Endereço Físico / Escritório
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Av. 24 de Julho nº 1820, Bairro Polana"
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              WhatsApp Comercial *
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+258 84 910 2275"
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Website Oficial
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://suaempresa.co.mz"
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-700/60">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-3">
            Presença Digital & Redes Sociais
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1 flex items-center gap-1">
                <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="facebook.com/empresa"
                className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1 flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@empresa_mz"
                className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/company/empresa"
                className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Informações da Empresa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
