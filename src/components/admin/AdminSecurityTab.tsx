import React, { useState, useEffect } from "react";
import { ReportTicket, AuditLogItem } from "../../types";
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Laptop,
  Shield,
  Activity,
  UserX,
  FileText,
  Clock,
  Eye,
} from "lucide-react";

interface AdminSecurityTabProps {
  adminRole?: string;
  adminEmail: string;
}

export const AdminSecurityTab: React.FC<AdminSecurityTabProps> = ({
  adminRole = "SUPER ADMIN",
  adminEmail,
}) => {
  const [securityData, setSecurityData] = useState<any>(null);
  const [reports, setReports] = useState<ReportTicket[]>([
    {
      id: "rep-4921",
      reportNumber: "#4921",
      type: "Fraude",
      url: "https://m-pesa-premio-falso.online",
      reportedBy: "cliente29@gmail.com",
      reportedAt: "Hoje 14:32",
      riskScore: 94,
      status: "pending",
      notes: "Página falsa simulando sorteio de prémios M-Pesa com recolha indevida de PIN.",
    },
    {
      id: "rep-4810",
      reportNumber: "#4810",
      type: "Conteúdo Adulto",
      url: "https://cam-adult-stream.net/live",
      reportedBy: "familia.segura@gotya.co.mz",
      reportedAt: "Ontem 21:15",
      riskScore: 98,
      status: "blocked",
      notes: "Vídeos adultos explícitos violando diretrizes comunitárias.",
    },
    {
      id: "rep-4755",
      reportNumber: "#4755",
      type: "Phishing",
      url: "https://login-bim-seguro.xyz",
      reportedBy: "seguranca@bancobim.co.mz",
      reportedAt: "08/09/2026",
      riskScore: 99,
      status: "investigating",
      notes: "Clone idêntico do internet banking do Millennium BIM.",
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    { id: "log-1", actor: "SUPER ADMIN", action: "alterou configuração", target: "Gateway de Segurança V2", timestamp: "Hoje às 15:40" },
    { id: "log-2", actor: "SECURITY ADMIN", action: "suspendeu usuário", target: "scammer88@mail.ru", timestamp: "Hoje às 14:50" },
    { id: "log-3", actor: "MODERATOR", action: "removeu conteúdo", target: "Anúncio não verificado #109", timestamp: "Hoje às 13:20" },
    { id: "log-4", actor: "ADMIN", action: "bloqueou domínio", target: "m-pesa-premio-falso.online", timestamp: "Ontem às 18:11" },
    { id: "log-5", actor: "ADMIN", action: "alterou categoria", target: "Empregos & Recrutamento Moçambique", timestamp: "09/09/2026" },
  ]);

  const [blockedDomains, setBlockedDomains] = useState<string[]>([
    "m-pesa-premio-falso.online",
    "login-bim-seguro.xyz",
    "premios-moz-golpe.site",
    "phishing-bank.xyz",
    "cam-adult-stream.net",
  ]);

  const [blockedIps, setBlockedIps] = useState<string[]>([
    "197.234.21.90",
    "102.164.12.5",
    "41.223.119.8",
    "185.220.101.44",
  ]);

  const [blockedDevices, setBlockedDevices] = useState<string[]>([
    "DEV-90812-LINUX",
    "DEV-44210-ANDROID",
    "DEV-77192-MAC",
  ]);

  const [suspectUsers, setSuspectUsers] = useState<any[]>([
    { id: "susp-1", email: "scammer88@mail.ru", reason: "Tentativa de phishing M-Pesa", date: "Hoje", risk: 95 },
    { id: "susp-2", email: "bot_crawler_99@xyz.net", reason: "Scraping abusivo detectado", date: "Ontem", risk: 88 },
  ]);

  const [newDomainToBlock, setNewDomainToBlock] = useState("");
  const [newIpToBlock, setNewIpToBlock] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<
    "reports" | "domains" | "ips" | "suspects" | "audit"
  >("reports");

  useEffect(() => {
    fetch("/api/admin/security")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          if (data.reports?.length) setReports(data.reports);
          if (data.blockedDomains?.length) setBlockedDomains(data.blockedDomains);
          if (data.blockedIps?.length) setBlockedIps(data.blockedIps);
          if (data.blockedDevices?.length) setBlockedDevices(data.blockedDevices);
          if (data.suspectUsers?.length) setSuspectUsers(data.suspectUsers);
          if (data.auditLogs?.length) setAuditLogs(data.auditLogs);
        }
      })
      .catch(() => {});
  }, []);

  const handleReportAction = async (reportId: string, action: "investigate" | "block" | "dismiss") => {
    const status =
      action === "block" ? "blocked" : action === "investigate" ? "investigating" : "dismissed";

    const report = reports.find((r) => r.id === reportId);

    // Update local state
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );

    if (action === "block" && report) {
      if (!blockedDomains.includes(report.url)) {
        setBlockedDomains((prev) => [report.url, ...prev]);
      }
    }

    // Add to Audit Log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actor: "ADMIN",
      action:
        action === "block"
          ? "bloqueou domínio"
          : action === "investigate"
          ? "iniciou investigação"
          : "ignorou denúncia",
      target: report ? `${report.reportNumber} (${report.url})` : "Denúncia",
      timestamp: "Agora",
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    try {
      await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, actor: "ADMIN" }),
      });
    } catch {
      // safe fallback
    }
  };

  const handleBlockDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomainToBlock.trim().toLowerCase();
    if (!clean) return;
    if (!blockedDomains.includes(clean)) {
      setBlockedDomains((prev) => [clean, ...prev]);
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          actor: "ADMIN",
          action: "bloqueou domínio",
          target: clean,
          timestamp: "Agora",
        },
        ...prev,
      ]);
    }
    setNewDomainToBlock("");
  };

  const handleBlockIp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newIpToBlock.trim();
    if (!clean) return;
    if (!blockedIps.includes(clean)) {
      setBlockedIps((prev) => [clean, ...prev]);
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          actor: "SECURITY ADMIN",
          action: "bloqueou IP",
          target: clean,
          timestamp: "Agora",
        },
        ...prev,
      ]);
    }
    setNewIpToBlock("");
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubTab("reports")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "reports"
              ? "bg-red-500 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Fila de Denúncias ({reports.filter((r) => r.status === "pending").length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("domains")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "domains"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Domínios Bloqueados ({blockedDomains.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ips")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "ips"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>IPs & Dispositivos ({blockedIps.length + blockedDevices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("suspects")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "suspects"
              ? "bg-amber-500 text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <UserX className="w-3.5 h-3.5" />
          <span>Usuários Suspeitos ({suspectUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("audit")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "audit"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: Conteúdo Denunciado & Fila de Moderação */}
      {activeSubTab === "reports" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Conteúdo Denunciado (Fila de Moderação & Anti-Burla)</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Denúncias enviadas por usuários e algoritmos automáticos com Risk Score avaliado.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  report.status === "blocked"
                    ? "bg-red-500/5 border-red-500/30"
                    : report.status === "investigating"
                    ? "bg-amber-500/5 border-amber-500/30"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* Specific Header format as requested: REPORT #4921 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="font-mono font-black text-sm text-zinc-900 dark:text-white tracking-wider">
                      REPORT {report.reportNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        report.status === "blocked"
                          ? "bg-red-500 text-white"
                          : report.status === "investigating"
                          ? "bg-amber-500 text-zinc-950"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {report.status === "blocked"
                        ? "Bloqueado"
                        : report.status === "investigating"
                        ? "Em Investigação"
                        : "Pendente"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Tipo:</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{report.type}</span>
                    </div>

                    <div className="flex justify-between items-start gap-2">
                      <span className="text-zinc-400">URL:</span>
                      <span className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200 truncate max-w-[170px]">
                        {report.url}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Usuário:</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[170px]">
                        {report.reportedBy}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Data:</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{report.reportedAt}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">Risk Score:</span>
                      <span className="px-2 py-0.5 rounded font-black text-xs bg-red-500/15 text-red-600 dark:text-red-400">
                        {report.riskScore}/100
                      </span>
                    </div>

                    {report.notes && (
                      <p className="text-[11px] text-zinc-500 italic pt-1 line-clamp-2">
                        "{report.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Specific Action Buttons as requested: [Investigar] [Bloquear] [Ignorar] */}
                <div className="grid grid-cols-3 gap-1.5 pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => handleReportAction(report.id, "investigate")}
                    className="py-1.5 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-[11px] transition-colors cursor-pointer text-center"
                  >
                    Investigar
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, "block")}
                    className="py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-colors cursor-pointer text-center"
                  >
                    Bloquear
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, "dismiss")}
                    className="py-1.5 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold text-[11px] transition-colors cursor-pointer text-center"
                  >
                    Ignorar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Domínios Bloqueados */}
      {activeSubTab === "domains" && (
        <div className="space-y-4">
          <form onSubmit={handleBlockDomain} className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={newDomainToBlock}
              onChange={(e) => setNewDomainToBlock(e.target.value)}
              placeholder="Digite o domínio ou URL para bloquear (ex: golpe-mpesa.online)..."
              className="flex-1 py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-500"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloquear Domínio</span>
            </button>
          </form>

          <div className="space-y-2 max-w-2xl">
            {blockedDomains.map((domain, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-red-500" />
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">
                    {domain}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setBlockedDomains((prev) => prev.filter((d) => d !== domain))
                  }
                  className="p-1 text-zinc-400 hover:text-red-500 cursor-pointer"
                  title="Desbloquear domínio"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: IPs & Dispositivos Bloqueados */}
      {activeSubTab === "ips" && (
        <div className="space-y-5">
          <form onSubmit={handleBlockIp} className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={newIpToBlock}
              onChange={(e) => setNewIpToBlock(e.target.value)}
              placeholder="Adicionar IP abusivo para lista negra (ex: 197.234.21.90)..."
              className="flex-1 py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-500"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bloquear IP</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                IPs Bloqueados ({blockedIps.length})
              </h4>
              <div className="space-y-1.5">
                {blockedIps.map((ip, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs font-mono flex justify-between items-center"
                  >
                    <span>{ip}</span>
                    <span className="text-[10px] text-red-500 font-sans font-bold">Bloqueado</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Dispositivos Bloqueados ({blockedDevices.length})
              </h4>
              <div className="space-y-1.5">
                {blockedDevices.map((dev, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs font-mono flex justify-between items-center"
                  >
                    <span className="flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                      {dev}
                    </span>
                    <span className="text-[10px] text-red-500 font-sans font-bold">Banido</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Usuários Suspeitos & Tentativas de Ataque */}
      {activeSubTab === "suspects" && (
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Usuários Sinalizados com Atividade Suspeita
            </h4>
            <div className="space-y-2">
              {suspectUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white">{u.email}</div>
                    <div className="text-[11px] text-zinc-500">{u.reason} • Data: {u.date}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-red-500/15 text-red-600">
                    Risco {u.risk}/100
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-2 text-xs">
            <h4 className="font-bold text-amber-400">Tentativas de Ataque & Eventos de Rate-Limit:</h4>
            <p className="text-zinc-400">
              O WAF (Web Application Firewall) registou 3 tentativas de exploração prevenidas nas últimas 24 horas:
            </p>
            <ul className="space-y-1 font-mono text-[11px] text-zinc-300">
              <li>• 185.220.101.44 (Tor Exit) → Tentativa de injeção de parâmetros (Bloqueado)</li>
              <li>• 197.234.21.90 → Tentativa de força bruta no login administrativo (Rate Limit 5 erradas)</li>
              <li>• Subnet 102.164.0.0/16 → DDoS Flood HTTP (Mitigação WAF acionada)</li>
            </ul>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Audit Logs */}
      {activeSubTab === "audit" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
              Audit Logs (Registo de Auditoria do Sistema)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Rastreamento de todas as alterações feitas pelos administradores e moderadores.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono">
                    {log.actor}
                  </span>
                  <span className="text-zinc-500">{log.action}</span>
                  <strong className="text-zinc-900 dark:text-white font-mono">{log.target}</strong>
                </div>
                <span className="text-[11px] text-zinc-400 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
