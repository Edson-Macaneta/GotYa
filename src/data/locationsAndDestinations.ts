import { LocationOption, OfficialDestination, SafetyAnalysis } from "../types";

export const LOCATIONS_LIST: LocationOption[] = [
  { id: "all", name: "Moçambique (Todas as Províncias)", region: "Nacional", country: "Moçambique", isPopular: true },
  { id: "maputo", name: "Maputo Cidade", region: "Maputo", country: "Moçambique", isPopular: true },
  { id: "matola", name: "Matola", region: "Maputo Província", country: "Moçambique", isPopular: true },
  { id: "beira", name: "Beira", region: "Sofala", country: "Moçambique", isPopular: true },
  { id: "nampula", name: "Nampula", region: "Nampula", country: "Moçambique", isPopular: true },
  { id: "chimoio", name: "Chimoio", region: "Manica", country: "Moçambique" },
  { id: "tete", name: "Tete", region: "Tete", country: "Moçambique" },
  { id: "pemba", name: "Pemba", region: "Cabo Delgado", country: "Moçambique" },
  { id: "quelimane", name: "Quelimane", region: "Zambézia", country: "Moçambique" },
  { id: "xai-xai", name: "Xai-Xai", region: "Gaza", country: "Moçambique" },
  { id: "inhambane", name: "Inhambane / Vilankulo", region: "Inhambane", country: "Moçambique" },
  { id: "lichinga", name: "Lichinga", region: "Niassa", country: "Moçambique" },
  { id: "world", name: "🌍 Mundo / Internacional", region: "Global", country: "Global", isPopular: true },
];

export const OFFICIAL_DESTINATIONS: OfficialDestination[] = [
  {
    id: "dest-facebook",
    keyword: "facebook",
    name: "Facebook",
    officialDomain: "facebook.com",
    targetUrl: "https://www.facebook.com",
    category: "Redes Sociais & Comunicação",
    logoText: "f",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Plataforma oficial da Meta para conexão com amigos, grupos e páginas.",
  },
  {
    id: "dest-bci",
    keyword: "bci",
    name: "BCI — Banco Comercial e de Investimentos",
    officialDomain: "bci.co.mz",
    targetUrl: "https://www.bci.co.mz",
    category: "Bancos & Finanças",
    logoText: "BCI",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Portal oficial do BCI Moçambique. Internet banking seguro e serviços bancários.",
  },
  {
    id: "dest-millennium",
    keyword: "millennium",
    name: "Millennium BIM",
    officialDomain: "millenniumbim.co.mz",
    targetUrl: "https://www.millenniumbim.co.mz",
    category: "Bancos & Finanças",
    logoText: "BIM",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Maior instituição financeira privada de Moçambique com acesso seguro ao BIM Net.",
  },
  {
    id: "dest-standardbank",
    keyword: "standard bank",
    name: "Standard Bank Moçambique",
    officialDomain: "standardbank.co.mz",
    targetUrl: "https://www.standardbank.co.mz",
    category: "Bancos & Finanças",
    logoText: "SB",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Serviços de banco corporativo, pessoal e internet banking credenciado.",
  },
  {
    id: "dest-vodacom",
    keyword: "vodacom",
    name: "Vodacom Moçambique & M-Pesa",
    officialDomain: "vm.co.mz",
    targetUrl: "https://vm.co.mz",
    category: "Telecomunicações & Carteira Móvel",
    logoText: "VM",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Portal oficial da Vodacom e informações seguras do serviço M-Pesa.",
  },
  {
    id: "dest-tmcel",
    keyword: "tmcel",
    name: "Tmcel Moçambique Telecom",
    officialDomain: "tmcel.mz",
    targetUrl: "https://www.tmcel.mz",
    category: "Telecomunicações",
    logoText: "TM",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Operadora nacional de telecomunicações de Moçambique.",
  },
  {
    id: "dest-movitel",
    keyword: "movitel",
    name: "Movitel & e-Mola",
    officialDomain: "movitel.co.mz",
    targetUrl: "https://movitel.co.mz",
    category: "Telecomunicações & Carteira Móvel",
    logoText: "MOV",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Operadora móvel com cobertura alargada e carteira digital e-Mola.",
  },
  {
    id: "dest-emprego",
    keyword: "emprego.co.mz",
    name: "Emprego.co.mz",
    officialDomain: "emprego.co.mz",
    targetUrl: "https://www.emprego.co.mz",
    category: "Empregos & Recrutamento",
    logoText: "EMP",
    sslVerified: true,
    reputation: "Verificado",
    riskScore: 0,
    description: "Principal portal de ofertas de trabalho e estágios em Moçambique.",
  },
  {
    id: "dest-beforward",
    keyword: "beforward",
    name: "Be Forward Moçambique",
    officialDomain: "beforward.jp",
    targetUrl: "https://www.beforward.jp",
    category: "Carros & Importação",
    logoText: "BF",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Canal oficial de importação de viaturas japonesas usadas para os portos de Maputo e Beira.",
  },
  {
    id: "dest-spotify",
    keyword: "spotify",
    name: "Spotify Web Player",
    officialDomain: "spotify.com",
    targetUrl: "https://open.spotify.com",
    category: "Músicas & Podcasts",
    logoText: "S",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Streaming oficial com milhões de músicas, álbuns e playlists autorizadas.",
  },
  {
    id: "dest-youtube",
    keyword: "youtube",
    name: "YouTube",
    officialDomain: "youtube.com",
    targetUrl: "https://www.youtube.com",
    category: "Vídeo & Entretenimento",
    logoText: "YT",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Maior canal de vídeos, transmissões ao vivo e conteúdo musical do mundo.",
  },
  {
    id: "dest-netflix",
    keyword: "netflix",
    name: "Netflix",
    officialDomain: "netflix.com",
    targetUrl: "https://www.netflix.com",
    category: "Filmes & Séries",
    logoText: "N",
    sslVerified: true,
    reputation: "Oficial",
    riskScore: 0,
    description: "Plataforma oficial de streaming de séries, documentários e filmes.",
  },
];

/**
 * Trust & Safety Content Safety and Fraud Detection Pipeline
 * Implements evasive pattern matching for adult content and anti-burla scam warnings.
 */
export function analyzeQuerySafety(rawQuery: string): SafetyAnalysis {
  const query = rawQuery.trim().toLowerCase();

  // Adult content patterns with evasion detection (p0rn, p o r n, p@rn, porn0, etc.)
  const adultPatterns = [
    /\bp[o0\s@_.-]*r[n\s_.-]*/i,
    /\bxxx\b/i,
    /\bporn[o0]?\b/i,
    /\bnudez\s*(sexual|explicita)?\b/i,
    /\bacompanhantes?\s*(de\s*luxo|sexo)?\b/i,
    /\bsexo\s*(explicito|ao\s*vivo)?\b/i,
    /\bputaria\b/i,
    /\bhentai\b/i,
    /\bcamgirls?\b/i,
    /\bescort\s*(service|girls?)?\b/i,
    /\bconteudo\s*adulto\b/i,
  ];

  for (const pat of adultPatterns) {
    if (pat.test(query)) {
      return {
        isBlocked: true,
        blockReason:
          "Conteúdo restrito pelas políticas de segurança familiar GotYa Trust & Safety (Bloqueio de pornografia, nudez explícita ou evasão de filtros).",
        evasionDetected: /p[0\s@_.-]r/i.test(query),
        riskScore: 98,
      };
    }
  }

  // Anti-Burla / Scam Detection patterns
  const scamPatterns = [
    {
      pat: /\b(premio\s*m-?pesa|m-?pesa\s*premio|ganhou\s*premio\s*vodacom)\b/i,
      warning:
        "ALERTA ANTI-BURLA GOTYA: O M-Pesa e a Vodacom não distribuem prémios solicitando senhas, PINs ou transferências antecipadas. Nunca forneça seu código PIN a ninguém!",
      score: 95,
    },
    {
      pat: /\b(fazer\s*dinheiro\s*facil|multiplicar\s*dinheiro|renda\s*magica\s*mpesa)\b/i,
      warning:
        "AVISO DE SEGURANÇA: Esquemas de 'multiplicação de dinheiro' ou 'investimentos mágicos' são fraudes comuns. Desconfie de promessas de lucros fáceis.",
      score: 90,
    },
    {
      pat: /\b(clonar\s*whatsapp|hackear\s*conta|espiar\s*conversas)\b/i,
      warning:
        "AVISO LEGAL: Ferramentas ou serviços que prometem clonagem de contas ou invasão de privacidade são ilegais e constituem vetores de infecção por vírus e extorsão.",
      score: 85,
    },
    {
      pat: /\b(cartao\s*clonado|comprar\s*cartao\s*credito|dump\s*visa)\b/i,
      warning:
        "CONTEÚDO BLOQUEADO: Tentativa de busca associada a fraudes financeiras e crimes cibernéticos.",
      score: 99,
      block: true,
    },
  ];

  for (const s of scamPatterns) {
    if (s.pat.test(query)) {
      return {
        isBlocked: s.block || false,
        blockReason: s.block ? "Tentativa de busca associada a fraudes financeiras ou crimes cibernéticos." : undefined,
        fraudWarning: s.warning,
        riskScore: s.score,
      };
    }
  }

  return {
    isBlocked: false,
    riskScore: 5,
  };
}

/**
 * Match query against official destinations database for Instant Direct Search
 */
export function findOfficialDestination(rawQuery: string): OfficialDestination | null {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return null;

  for (const dest of OFFICIAL_DESTINATIONS) {
    if (
      q === dest.keyword ||
      q === dest.name.toLowerCase() ||
      q === dest.officialDomain.toLowerCase() ||
      q.startsWith(dest.keyword + " ") ||
      q.includes(dest.keyword)
    ) {
      return dest;
    }
  }

  return null;
}
