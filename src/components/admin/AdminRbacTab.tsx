import React, { useState } from "react";
import { AdminRole, StaffMember } from "../../types";
import {
  ShieldCheck,
  Shield,
  Users,
  Plus,
  Trash2,
  Check,
  Lock,
  FileText,
  DollarSign,
  Headphones,
  Briefcase,
  Sliders,
} from "lucide-react";

interface AdminRbacTabProps {
  currentRole: AdminRole;
  onChangeRole: (role: AdminRole) => void;
  staffMembers: StaffMember[];
  onAddStaff: (staff: any) => void;
  onDeleteStaff: (id: string) => void;
}

const ROLES_INFO: {
  role: AdminRole;
  title: string;
  badgeColor: string;
  description: string;
  permissions: string[];
}[] = [
  {
    role: "super_admin",
    title: "SUPER ADMIN",
    badgeColor: "bg-amber-500 text-zinc-950",
    description: "Acesso total irrestrito a todo o portal GotYa, configurações da Conta Mãe, segurança e infraestrutura.",
    permissions: [
      "Acesso completo a todas as abas e métricas",
      "Alterar senhas e papéis de administradores",
      "Configuração da Conta Mãe (Visa, M-Pesa, e-Mola)",
      "Gestão de categorias, destinos e auditoria",
    ],
  },
  {
    role: "security_admin",
    title: "Security Admin",
    badgeColor: "bg-red-500 text-white",
    description: "Responsável pela segurança cibernética, bloqueio de IPs maliciosos, WAF e prevenção de ataques.",
    permissions: [
      "Bloquear e desbloquear IPs e domínios",
      "Investigar e banir dispositivos suspeitos",
      "Monitorizar tentativas de ataque e DDoS",
      "Auditar logs de segurança",
    ],
  },
  {
    role: "content_admin",
    title: "Content Admin",
    badgeColor: "bg-blue-500 text-white",
    description: "Gestão editorial de categorias, subcategorias, tags, avisos, banners e FAQs.",
    permissions: [
      "Criar e editar categorias e links",
      "Publicar avisos e banners na homepage",
      "Gerir FAQs e páginas institucionais",
    ],
  },
  {
    role: "moderation_admin",
    title: "Moderation Admin",
    badgeColor: "bg-purple-500 text-white",
    description: "Gestão da fila de denúncias de usuários, remoção de conteúdo ilícito e moderação comunitária.",
    permissions: [
      "Processar tickets da fila de denúncias (REPORT #)",
      "Remover anúncios e produtos fraudulentos",
      "Emitir advertências a parceiros",
    ],
  },
  {
    role: "business_admin",
    title: "Business Admin",
    badgeColor: "bg-emerald-500 text-white",
    description: "Relacionamento e autorização de parceiros, empresas cadastradas e planos comerciais.",
    permissions: [
      "Aprovar ou rejeitar candidaturas de parceiros",
      "Atribuir planos Simples, Premium e Premium Pro",
      "Gerir catálogo de produtos de parceiros",
    ],
  },
  {
    role: "finance_admin",
    title: "Finance Admin",
    badgeColor: "bg-green-600 text-white",
    description: "Controle de receitas, comissões de produtos, extratos M-Pesa e e-Mola e faturamento.",
    permissions: [
      "Visualizar relatórios financeiros e de comissões",
      "Monitorizar pagamentos de assinaturas de parceiros",
      "Gerir taxas de câmbio MZN / USD",
    ],
  },
  {
    role: "support_admin",
    title: "Support Admin",
    badgeColor: "bg-cyan-500 text-white",
    description: "Atendimento ao cliente, resolução de dúvidas e suporte técnico de primeiro nível.",
    permissions: [
      "Responder a pedidos de suporte e dúvidas",
      "Acompanhar feedback de pesquisas e usabilidade",
    ],
  },
];

export const AdminRbacTab: React.FC<AdminRbacTabProps> = ({
  currentRole,
  onChangeRole,
  staffMembers,
  onAddStaff,
  onDeleteStaff,
}) => {
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<AdminRole>("support_admin");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    onAddStaff({
      name: newStaffName.trim(),
      email: newStaffEmail.trim().toLowerCase(),
      role: newStaffRole,
      phone: newStaffPhone.trim(),
    });

    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPhone("");
  };

  return (
    <div className="space-y-6">
      {/* Current Simulator Header */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Papel Ativo na Sessão Administrativa Atual:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-zinc-900 dark:text-white">
              {ROLES_INFO.find((r) => r.role === currentRole)?.title || "SUPER ADMIN"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                ROLES_INFO.find((r) => r.role === currentRole)?.badgeColor
              }`}
            >
              ATIVO
            </span>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Alternar função:</span>
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as AdminRole)}
            className="py-1.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer"
          >
            {ROLES_INFO.map((r) => (
              <option key={r.role} value={r.role}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Hierarchy & Permissions Cards */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Hierarquia de Níveis de Acesso (7 Perfis RBAC)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES_INFO.map((item) => {
            const isSelected = currentRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => onChangeRole(item.role)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/5 shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase ${item.badgeColor}`}
                    >
                      {item.title}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Selecionado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    {item.description}
                  </p>

                  <div className="space-y-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                    <div className="font-bold text-zinc-400 text-[10px] uppercase">Permissões:</div>
                    {item.permissions.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Staff Form */}
      <form
        onSubmit={handleCreateStaff}
        className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3"
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Atribuir Novo Membro de Equipa / Sub-Administrador
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-500 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="Ex: Carlos Matusse"
              className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 mb-1">E-mail Institucional</label>
            <input
              type="email"
              required
              value={newStaffEmail}
              onChange={(e) => setNewStaffEmail(e.target.value)}
              placeholder="carlos@gotya.co.mz"
              className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 mb-1">Nível de Acesso (Papel)</label>
            <select
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value as AdminRole)}
              className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
            >
              {ROLES_INFO.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 mb-1">Telefone (opcional)</label>
            <input
              type="text"
              value={newStaffPhone}
              onChange={(e) => setNewStaffPhone(e.target.value)}
              placeholder="+258 84..."
              className="w-full py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Membro à Equipa</span>
        </button>
      </form>

      {/* Staff List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
          Membros Registados ({staffMembers.length})
        </h4>

        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
          >
            <div>
              <strong className="text-zinc-900 dark:text-white font-bold block">{staff.name}</strong>
              <span className="text-zinc-500">
                {staff.email} • {staff.role} {staff.phone ? `• ${staff.phone}` : ""}
              </span>
            </div>

            <button
              onClick={() => onDeleteStaff(staff.id)}
              className="p-1.5 text-zinc-400 hover:text-red-500 cursor-pointer"
              title="Remover da equipa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
