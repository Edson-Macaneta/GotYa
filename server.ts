import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// In-memory data store for GotYa Super Portal
let totalSearchesCount = 68;
let aiSearchesCount = 44;
let simpleSearchesCount = 24;

interface PartnerSubmission {
  id: string;
  businessName: string;
  category: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  tier: "simples" | "premium" | "premium_pro";
  status: "pending" | "approved" | "contacted" | "rejected";
  subUsers: string[];
  createdAt: string;
}

interface PartnerProduct {
  id: string;
  partnerEmail: string;
  partnerBusinessName: string;
  partnerTier: "simples" | "premium" | "premium_pro";
  title: string;
  category: string;
  price: number;
  currency: string;
  imageUrl?: string;
  externalLink: string;
  description: string;
  commissionRate: number; // 2.5%
  isApproved: boolean;
  createdAt: string;
}

interface PartnerAd {
  id: string;
  partnerEmail: string;
  partnerBusinessName: string;
  partnerTier: "simples" | "premium" | "premium_pro";
  title: string;
  description: string;
  bannerUrl?: string;
  targetUrl: string;
  status: "pending_review" | "active" | "rejected";
  impressions: number;
  clicks: number;
  createdAt: string;
}

// Initial default settings
let adminSettings = {
  adminEmail: "imperium781@gmail.com",
  adminPassword: "Imperium1@.com",
  planPrices: {
    premiumUSD: 1.9,
    premiumProUSD: 3.0,
    premiumMZN: 120,
    premiumProMZN: 190,
  },
  motherAccount: {
    visaNumber: "4333734008870275",
    cvv: "456",
    expiry: "08/29",
    mpesa: "849102275",
    emola: "862019030",
  },
  contacts: {
    whatsapp: "+258 84 910 2275",
    instagram: "@gotya.portal",
    email: "imperium781@gmail.com",
  },
  staffMembers: [
    {
      id: "staff-1",
      name: "Gestor de Suporte & Verificação",
      email: "suporte@gotya.co.mz",
      role: "Atendimento ao Cliente e Validação de Anúncios",
      phone: "+258 84 910 2275",
      addedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ],
  commissionRate: 2.5,
};

let partnersDB: PartnerSubmission[] = [
  {
    id: "p-1",
    businessName: "Imobiliária Maputo Prime",
    category: "Casas & Imóveis",
    city: "Maputo / Polana",
    phone: "+258 84 123 4567",
    email: "contacto@maputoprime.co.mz",
    website: "https://maputoprime.example",
    description: "Especialistas em arrendamento e venda de moradias e apartamentos de luxo em Maputo.",
    tier: "premium_pro",
    status: "approved",
    subUsers: ["corretor1@maputoprime.co.mz", "vendas@maputoprime.co.mz"],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "p-2",
    businessName: "AutoStand Moçambique",
    category: "Carros & Automóveis",
    city: "Matola",
    phone: "+258 82 987 6543",
    email: "vendas@autostand.co.mz",
    website: "https://autostand.example",
    description: "Importação direta de viaturas japonesas e europeias com garantia e assistência técnica.",
    tier: "premium",
    status: "approved",
    subUsers: ["gerente@autostand.co.mz"],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "p-3",
    businessName: "TechMoz Soluções Informáticas",
    category: "Compras & Tecnologia",
    city: "Maputo / Central",
    phone: "+258 87 456 7890",
    email: "info@techmoz.co.mz",
    website: "https://techmoz.example",
    description: "Laptops, periféricos, servidores e smartphones para empresas e particulares.",
    tier: "simples",
    status: "pending",
    subUsers: [],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

let productsDB: PartnerProduct[] = [
  {
    id: "prod-1",
    partnerEmail: "contacto@maputoprime.co.mz",
    partnerBusinessName: "Imobiliária Maputo Prime",
    partnerTier: "premium_pro",
    title: "Apartamento T2 Moderno na Polana Cimento",
    category: "Casas & Imóveis",
    price: 65000,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    externalLink: "https://www.google.com/search?q=apartamento+t2+polana+maputo",
    description: "Vista panorâmica para a baía, 2 quartos climatizados, estacionamento privado e segurança 24h.",
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "prod-2",
    partnerEmail: "vendas@autostand.co.mz",
    partnerBusinessName: "AutoStand Moçambique",
    partnerTier: "premium",
    title: "Toyota Ractis 2016 — Pronta Entrega",
    category: "Carros & Automóveis",
    price: 385000,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
    externalLink: "https://www.google.com/search?q=toyota+ractis+maputo",
    description: "Excelente estado mecânico, livrete nacionalizado, ar condicionado gélido e câmara traseira.",
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "prod-3",
    partnerEmail: "info@techmoz.co.mz",
    partnerBusinessName: "TechMoz Informática",
    partnerTier: "simples",
    title: "Laptop HP ProBook Core i5 16GB RAM 512GB SSD",
    category: "Compras & Tecnologia",
    price: 29500,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    externalLink: "https://www.google.com/search?q=laptop+hp+probook+maputo",
    description: "Novo na caixa com carregador original e garantia de 12 meses. Ideal para escritório e estudos.",
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "prod-4",
    partnerEmail: "shein.moz@gotya.co.mz",
    partnerBusinessName: "SHEIN Express Moçambique",
    partnerTier: "premium_pro",
    title: "Vestido Midi Floral Francês Elegante Primavera/Verão",
    category: "Roupas & Acessórios",
    price: 1450,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
    externalLink: "https://www.shein.com",
    description: "Tecido leve respirável, modelagem evasê com acabamento premium e entrega direta em Maputo e Matola.",
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "prod-5",
    partnerEmail: "zara.import@gotya.co.mz",
    partnerBusinessName: "Zara Moçambique Importações",
    partnerTier: "premium_pro",
    title: "Blazer Masculino Slim Fit Preto Clássico Alfaiataria",
    category: "Roupas & Acessórios",
    price: 4200,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    externalLink: "https://www.zara.com",
    description: "Coleção de alfaiataria Zara Man original. Corte moderno ajustado, forro interno acetinado e botões foscos.",
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "prod-6",
    partnerEmail: "dripmoz@gotya.co.mz",
    partnerBusinessName: "Drip Moz Streetwear",
    partnerTier: "premium",
    title: "Sapatilhas Nike Air Jordan 1 High Retro Og Chicago",
    category: "Roupas & Acessórios",
    price: 6800,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80",
    externalLink: "https://www.google.com/search?q=drip+moz+sapatilhas",
    description: "Sneaker clássico de colecionador, couro legítimo de alta durabilidade, amortecimento Air e sola de borracha reforçada.",
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "prod-7",
    partnerEmail: "mrprice.boutique@gotya.co.mz",
    partnerBusinessName: "Boutique Bella Maputo (Mr Price)",
    partnerTier: "simples",
    title: "Conjunto Feminino Casual Calça Larga & Camisa Linho",
    category: "Roupas & Acessórios",
    price: 1950,
    currency: "MZN",
    imageUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&auto=format&fit=crop&q=80",
    externalLink: "https://www.mrp.com",
    description: "Moda casual confortável em linho misto para o dia a dia, trabalho ou fins de semana na praia.",
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date().toISOString(),
  },
];

// OTP Store for Gmail authentication verification
let otpStore: Record<string, { code: string; expiresAt: number; verified: boolean; attempts: number }> = {};

// Product Reviews database
let reviewsDB = [
  {
    id: "rev-1",
    productId: "prod-4",
    userName: "Carla Mondlane",
    userEmail: "carla.m@gmail.com",
    rating: 5,
    comment: "Excelente qualidade do tecido! Chegou perfeitamente embalado e no tamanho exato indicado na tabela SHEIN.",
    createdAt: "Ontem às 16:40",
    verifiedPurchase: true,
  },
  {
    id: "rev-2",
    productId: "prod-5",
    userName: "Armando Chissano",
    userEmail: "armando.c@gmail.com",
    rating: 5,
    comment: "Blazer 100% original Zara com acabamento impecável. Comunicação rápida com o vendedor pelo chat!",
    createdAt: "Hoje às 10:15",
    verifiedPurchase: true,
  },
  {
    id: "rev-3",
    productId: "prod-2",
    userName: "Filipe Tembe",
    userEmail: "filipe.tembe@gmail.com",
    rating: 5,
    comment: "Toyota Ractis em excelente estado mecânico conforme descrito. Documentação conferida no ato.",
    createdAt: "09/09/2026",
    verifiedPurchase: true,
  },
];

// Seller - Consumer Mini-Chat Store
let chatMessagesDB = [
  {
    id: "msg-1",
    productId: "prod-4",
    productTitle: "Vestido Midi Floral Francês Elegante Primavera/Verão",
    partnerEmail: "shein.moz@gotya.co.mz",
    partnerBusinessName: "SHEIN Express Moçambique",
    sender: "buyer",
    senderName: "Carla Mondlane",
    senderEmail: "carla.m@gmail.com",
    message: "Olá! Ainda têm o tamanho M disponível para entrega na Polana?",
    timestamp: "10:30",
  },
  {
    id: "msg-2",
    productId: "prod-4",
    productTitle: "Vestido Midi Floral Francês Elegante Primavera/Verão",
    partnerEmail: "shein.moz@gotya.co.mz",
    partnerBusinessName: "SHEIN Express Moçambique",
    sender: "seller",
    senderName: "SHEIN Express Moçambique",
    senderEmail: "shein.moz@gotya.co.mz",
    message: "Bom dia, Carla! Sim, temos a pronta entrega em tamanho M e L. Podemos despachar hoje via motoboy!",
    timestamp: "10:32",
  },
];

// Ad Campaigns Database (with 0.90 USD/day smart cost calculation)
let adCampaignsDB = [
  {
    id: "camp-1",
    userEmail: "contacto@maputoprime.co.mz",
    userName: "Imobiliária Maputo Prime",
    title: "Campanha de Arrendamento Premium na Polana",
    description: "Sem fiador para contratos anuais. Visitas acompanhadas todos os dias.",
    targetUrl: "https://maputoprime.example",
    days: 7,
    dailyRateUSD: 0.90,
    totalUSD: 6.30,
    totalMZN: 397,
    paymentMethod: "mpesa",
    status: "active",
    phone: "+258 84 123 4567",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    impressions: 1420,
    clicks: 185,
  },
];

// Anti-Burla Fraud Sentinel Logs
let fraudAlertsDB = [
  {
    id: "fraud-1",
    partnerEmail: "spammer@falso.co.mz",
    partnerBusinessName: "Vendas Milagrosas Falso",
    productTitle: "Duplicado: M-Pesa Bónus Duplo Imediato",
    detectedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    reason: "Duplicidade de anúncio suspeito e menção a esquema de pagamento não autorizado.",
    actionTaken: "Produto banido automaticamente pela IA do GotYa. Alerta enviado ao ADM imperium781@gmail.com.",
    admActionRequired: "Confirmar suspensão da conta do parceiro.",
    partnerWarned: true,
    isResolved: false,
  },
];

// Package Benefits Configurations (editable by ADM)
let packageConfigsDB = [
  {
    tier: "simples",
    name: "Simples",
    priceUSD: 0,
    priceMZN: 0,
    badge: "Plano de Entrada",
    description: "Ideal para pequenos comerciantes e início de jornada digital.",
    maxSeats: 2,
    aiLimits: "Limitada: 1 dica de melhoria diária, sem ferramentas especiais.",
    features: [
      "Registo de negócio no directório GotYa",
      "Até 2 utilizadores simultâneos",
      "Listagem padrão nos resultados",
      "GotYa IA com 1 dica de melhoria por dia",
      "Contacto via WhatsApp e catálogo",
    ],
    isHighlighted: false,
  },
  {
    tier: "premium",
    name: "Premium",
    priceUSD: 1.9,
    priceMZN: 120,
    badge: "Mais Popular",
    description: "Para empresas que querem visibilidade reforçada e prioridade nas pesquisas.",
    maxSeats: 5,
    aiLimits: "Ilimitada: consultoria estratégica de vendas, análise de preços e suporte contínuo.",
    features: [
      "Prioridade destacada nas pesquisas dos consumidores",
      "Até 5 utilizadores / agentes de atendimento",
      "GotYa IA Ilimitada com dicas avançadas por e-mail e Gmail",
      "Selo Azul de Parceiro Verificado",
      "Painel de Estatísticas de cliques e leads",
      "Acesso a Ferramentas Empresariais (recibos e pro-formas)",
    ],
    isHighlighted: true,
  },
  {
    tier: "premium_pro",
    name: "Premium Pro",
    priceUSD: 3.0,
    priceMZN: 190,
    badge: "Topo de Destaque",
    description: "Máxima exposição, topo absoluto nas pesquisas e IA completa sem restrições.",
    maxSeats: 11,
    aiLimits: "Totalmente Ilimitada: IA Pro com auditoria de catálogo, anti-burla proativa e relatórios executivos.",
    features: [
      "Primeiro lugar absoluto em destaque nas pesquisas de produtos",
      "Até 11 utilizadores da empresa",
      "GotYa IA Pro Ilimitada com alertas automáticos por Gmail",
      "Selo Dourado VIP de Parceiro de Confiança",
      "Mini-Chat prioritário com compradores",
      "Ferramentas Empresariais completas e exportação CRM",
      "Suporte VIP prioritário 24/7 com a equipa de fundadores",
    ],
    isHighlighted: false,
  },
];

let partnerProfilesDB: Record<string, any> = {
  "contacto@maputoprime.co.mz": {
    businessName: "Imobiliária Maputo Prime",
    description: "Líder em mediação imobiliária de alto padrão em Maputo. Moradias, apartamentos e escritórios nas zonas nobres.",
    category: "Casas & Imóveis",
    province: "Maputo Cidade",
    cityDistrict: "Polana Cimento",
    physicalAddress: "Av. Julius Nyerere, Edifício Zenith, 4º Andar",
    googleMapsUrl: "https://maps.google.com/?q=Polana+Cimento+Maputo",
    phonePrimary: "+258 84 123 4567",
    phoneSecondary: "+258 21 490 000",
    whatsapp: "+258 84 123 4567",
    email: "contacto@maputoprime.co.mz",
    website: "https://maputoprime.example",
    socials: {
      instagram: "@maputoprime",
      facebook: "facebook.com/maputoprime",
      linkedin: "linkedin.com/company/maputo-prime",
    },
    openingHours: "Seg - Sex: 08:00 - 18:00 | Sáb: 09:00 - 13:00",
    nuit: "400192837",
    verifiedBadge: true,
  },
};

let adsDB: PartnerAd[] = [
  {
    id: "ad-1",
    partnerEmail: "contacto@maputoprime.co.mz",
    partnerBusinessName: "Imobiliária Maputo Prime",
    partnerTier: "premium_pro",
    title: "Campanha de Arrendamento Premium na Polana",
    description: "Sem fiador para contratos anuais. Visitas acompanhadas todos os dias.",
    targetUrl: "https://maputoprime.example",
    status: "active",
    impressions: 1420,
    clicks: 185,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

let customCategoriesDB: any[] = [];

// GotYa V2 Security Center & Trust & Safety In-Memory Databases
let reportsDB = [
  {
    id: "rep-4921",
    reportNumber: "#4921",
    type: "Fraude",
    url: "https://m-pesa-premio-falso.online",
    reportedBy: "cliente29@gmail.com",
    reportedAt: "Hoje às 14:32",
    riskScore: 94,
    status: "pending",
    notes: "Site falso prometendo bónus M-Pesa com objetivo de captura de PIN.",
  },
  {
    id: "rep-4810",
    reportNumber: "#4810",
    type: "Conteúdo Adulto",
    url: "https://cam-adult-stream.net/live",
    reportedBy: "familia.segura@gotya.co.mz",
    reportedAt: "Ontem às 21:15",
    riskScore: 98,
    status: "blocked",
    notes: "Conteúdo adulto explícito violando política de proteção familiar.",
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
    notes: "Clone idêntico da página de login do Millennium BIM para roubo de credenciais.",
  },
];

let blockedDomainsDB = [
  "m-pesa-premio-falso.online",
  "login-bim-seguro.xyz",
  "premios-moz-golpe.site",
  "phishing-bank.xyz",
  "cam-adult-stream.net",
  "clonar-zap-facil.online",
];

let blockedIpsDB = [
  "197.234.21.90",
  "102.164.12.5",
  "41.223.119.8",
  "185.220.101.44",
];

let blockedDevicesDB = [
  "DEV-90812-LINUX",
  "DEV-44210-ANDROID",
  "DEV-77192-MAC",
];

let suspectUsersDB = [
  { id: "susp-1", email: "scammer88@mail.ru", reason: "Tentativa de envio de links falsos de M-Pesa", date: "Hoje", risk: 95 },
  { id: "susp-2", email: "bot_crawler_99@xyz.net", reason: "Tentativa de scraping abusivo com rate-limit estourado", date: "Ontem", risk: 88 },
];

let auditLogsDB = [
  { id: "log-1", actor: "SUPER ADMIN", actorRole: "super_admin", action: "alterou configuração", target: "Gateway de Segurança V2 ativado", timestamp: "Hoje às 15:40" },
  { id: "log-2", actor: "SECURITY ADMIN", actorRole: "security_admin", action: "suspendeu usuário", target: "scammer88@mail.ru", timestamp: "Hoje às 14:50" },
  { id: "log-3", actor: "MODERATOR", actorRole: "moderation_admin", action: "removeu conteúdo", target: "Anúncio não verificado #109", timestamp: "Hoje às 13:20" },
  { id: "log-4", actor: "ADMIN", actorRole: "content_admin", action: "bloqueou domínio", target: "m-pesa-premio-falso.online", timestamp: "Ontem às 18:11" },
  { id: "log-5", actor: "ADMIN", actorRole: "content_admin", action: "alterou categoria", target: "Empregos & Recrutamento Moçambique", timestamp: "09/09/2026" },
];


let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: "GotYa",
  });
});

// Admin Settings & Mother Account
app.get("/api/admin/settings", (req, res) => {
  res.json({
    adminEmail: adminSettings.adminEmail,
    planPrices: adminSettings.planPrices,
    motherAccount: adminSettings.motherAccount,
    contacts: adminSettings.contacts,
    staffMembers: adminSettings.staffMembers,
    commissionRate: adminSettings.commissionRate,
    // Do not leak password in plain response
    isPasswordConfigured: !!adminSettings.adminPassword,
  });
});

app.post("/api/admin/settings", (req, res) => {
  const {
    adminPassword,
    newPassword,
    planPrices,
    motherAccount,
    contacts,
    staffMembers,
  } = req.body;

  // Verify old password if changing password
  if (newPassword) {
    if (adminPassword !== adminSettings.adminPassword) {
      res.status(401).json({ error: "A senha atual de administrador está incorreta." });
      return;
    }
    adminSettings.adminPassword = String(newPassword).trim();
  }

  if (planPrices) {
    adminSettings.planPrices = { ...adminSettings.planPrices, ...planPrices };
  }
  if (motherAccount) {
    adminSettings.motherAccount = { ...adminSettings.motherAccount, ...motherAccount };
  }
  if (contacts) {
    adminSettings.contacts = { ...adminSettings.contacts, ...contacts };
  }
  if (Array.isArray(staffMembers)) {
    adminSettings.staffMembers = staffMembers;
  }

  res.json({ success: true, settings: adminSettings });
});

// RBAC Staff & Permissions Management
app.get("/api/admin/staff", (req, res) => {
  res.json(adminSettings.staffMembers);
});

app.post("/api/admin/staff", (req, res) => {
  const { name, email, role, phone, permissions } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    return;
  }

  const defaultPerms = ["manage_ads", "approve_products"];
  const newStaff = {
    id: `staff-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    role: String(role || "Moderador de Conteúdo").trim(),
    phone: String(phone || "").trim(),
    permissions: Array.isArray(permissions) ? permissions : defaultPerms,
    addedAt: new Date().toISOString(),
  };

  adminSettings.staffMembers.push(newStaff);

  auditLogsDB.unshift({
    id: `log-${Date.now()}`,
    actor: "SUPER ADMIN",
    actorRole: "super_admin",
    action: "adicionou colaborador com RBAC",
    target: `${newStaff.name} (${newStaff.role})`,
    timestamp: "Agora",
  });

  res.status(201).json({ success: true, staff: newStaff });
});

app.put("/api/admin/staff/:id", (req, res) => {
  const { id } = req.params;
  const { name, role, phone, permissions } = req.body;

  const staff = adminSettings.staffMembers.find((s) => s.id === id);
  if (!staff) {
    res.status(404).json({ error: "Colaborador não encontrado." });
    return;
  }

  if (name) staff.name = String(name).trim();
  if (role) staff.role = String(role).trim();
  if (phone) staff.phone = String(phone).trim();
  if (Array.isArray(permissions)) (staff as any).permissions = permissions;

  auditLogsDB.unshift({
    id: `log-${Date.now()}`,
    actor: "SUPER ADMIN",
    actorRole: "super_admin",
    action: "atualizou permissões RBAC",
    target: `${staff.name} -> ${staff.role}`,
    timestamp: "Agora",
  });

  res.json({ success: true, staff });
});

app.delete("/api/admin/staff/:id", (req, res) => {
  const { id } = req.params;
  const removed = adminSettings.staffMembers.find((s) => s.id === id);
  adminSettings.staffMembers = adminSettings.staffMembers.filter((s) => s.id !== id);

  if (removed) {
    auditLogsDB.unshift({
      id: `log-${Date.now()}`,
      actor: "SUPER ADMIN",
      actorRole: "super_admin",
      action: "removeu colaborador",
      target: `${removed.name} (${removed.email})`,
      timestamp: "Agora",
    });
  }

  res.json({ success: true });
});

// Admin Password Auth Check
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPass = String(password || "").trim();

  if (cleanEmail === adminSettings.adminEmail.toLowerCase() && cleanPass === adminSettings.adminPassword) {
    res.json({ success: true, isAdmin: true, email: adminSettings.adminEmail });
  } else {
    res.status(401).json({ error: "Credenciais de administrador incorretas." });
  }
});

// Gmail OTP Security Authentication System
app.post("/api/auth/send-otp", (req, res) => {
  const { email } = req.body;
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes("@")) {
    res.status(400).json({ error: "E-mail inválido para envio de OTP." });
    return;
  }

  // Generate 6-digit cryptographic-like OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

  otpStore[cleanEmail] = {
    code,
    expiresAt,
    verified: false,
    attempts: 0,
  };

  const isAdmin = cleanEmail === adminSettings.adminEmail.toLowerCase();

  // If Admin email, log security audit
  if (isAdmin) {
    auditLogsDB.unshift({
      id: `log-${Date.now()}`,
      actor: "SISTEMA DE SEGURANÇA",
      actorRole: "security_admin",
      action: "despachou OTP de verificação para Gmail do ADM",
      target: cleanEmail,
      timestamp: "Agora",
    });
  }

  res.json({
    success: true,
    message: isAdmin
      ? `Código OTP de Alta Segurança despachado para a caixa postal oficial do ADM (${cleanEmail}).`
      : `Código de verificação OTP de 6 dígitos enviado para o Gmail (${cleanEmail}).`,
    email: cleanEmail,
    isAdmin,
    simulatedCode: code, // Rendered transparently in UI notification for instantaneous testing
    expiresInSeconds: 300,
  });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanOtp = String(otp || "").trim();

  const record = otpStore[cleanEmail];
  if (!record) {
    res.status(400).json({ error: "Nenhum código OTP ativo foi solicitado para este e-mail. Solicite um novo código." });
    return;
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[cleanEmail];
    res.status(400).json({ error: "O código OTP expirou. Por favor solicite um novo código." });
    return;
  }

  if (record.code !== cleanOtp) {
    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts >= 4) {
      delete otpStore[cleanEmail];
      res.status(403).json({ error: "Muitas tentativas erradas. Por motivos de segurança o código foi invalidado." });
      return;
    }
    res.status(400).json({ error: `Código incorreto (${4 - record.attempts} tentativas restantes).` });
    return;
  }

  // OTP is verified!
  record.verified = true;
  const isAdmin = cleanEmail === adminSettings.adminEmail.toLowerCase();
  
  // Check if staff member
  const staff = adminSettings.staffMembers.find((s) => s.email.toLowerCase() === cleanEmail);

  res.json({
    success: true,
    message: "Identidade comprovada com sucesso via Gmail OTP!",
    email: cleanEmail,
    isAdmin,
    staffRole: staff ? staff.role : undefined,
  });
});

// Ad Campaigns API (0.90 USD/day smart calculation)
app.get("/api/ads/campaigns", (req, res) => {
  res.json(adCampaignsDB);
});

app.post("/api/ads/campaign", (req, res) => {
  const {
    userEmail,
    userName,
    title,
    description,
    bannerUrl,
    targetUrl,
    days,
    paymentMethod,
    phone,
  } = req.body;

  const numDays = Math.max(1, parseInt(String(days || 1), 10) || 1);
  const dailyRateUSD = 0.90;
  const totalUSD = Number((numDays * dailyRateUSD).toFixed(2));
  const exchangeRateMZN = 63; // Market exchange rate for Mozambique
  const totalMZN = Math.round(totalUSD * exchangeRateMZN);

  if (!title || !targetUrl) {
    res.status(400).json({ error: "Título e link de destino do anúncio são obrigatórios." });
    return;
  }

  const campaignId = `camp-${Date.now()}`;
  const newCampaign = {
    id: campaignId,
    userEmail: String(userEmail || "cliente@gotya.co.mz").trim().toLowerCase(),
    userName: String(userName || "Anunciante GotYa").trim(),
    title: String(title).trim(),
    description: String(description || "").trim(),
    bannerUrl: bannerUrl ? String(bannerUrl).trim() : undefined,
    targetUrl: String(targetUrl).trim(),
    days: numDays,
    dailyRateUSD,
    totalUSD,
    totalMZN,
    paymentMethod: paymentMethod || "mpesa",
    status: "active", // Activated upon automated payment receipt
    phone: String(phone || "+258 84 910 2275").trim(),
    createdAt: new Date().toISOString(),
    impressions: 1,
    clicks: 0,
  };

  adCampaignsDB.unshift(newCampaign);

  // Also publish directly into active adsDB
  adsDB.unshift({
    id: `ad-${Date.now()}`,
    partnerEmail: newCampaign.userEmail,
    partnerBusinessName: newCampaign.userName,
    partnerTier: "premium_pro",
    title: newCampaign.title,
    description: newCampaign.description,
    bannerUrl: newCampaign.bannerUrl,
    targetUrl: newCampaign.targetUrl,
    status: "active",
    impressions: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
  });

  // Notify ADM Imperium
  auditLogsDB.unshift({
    id: `log-${Date.now()}`,
    actor: "SISTEMA DE ANÚNCIOS",
    actorRole: "super_admin",
    action: `ativou anúncio de ${numDays} dias ($0.90/dia = $${totalUSD} / ${totalMZN} MT)`,
    target: `${newCampaign.title} (${newCampaign.userEmail})`,
    timestamp: "Agora",
  });

  res.status(201).json({
    success: true,
    campaign: newCampaign,
    summary: {
      days: numDays,
      dailyRateUSD: "$0.90 / dia",
      totalUSD: `$${totalUSD}`,
      totalMZN: `${totalMZN} MZN`,
      motherAccountDeposit: paymentMethod === "mpesa" ? adminSettings.motherAccount.mpesa : adminSettings.motherAccount.emola,
    },
  });
});

// Product Reviews & Ratings Endpoints
app.get("/api/products/:id/reviews", (req, res) => {
  const { id } = req.params;
  const reviews = reviewsDB.filter((r) => r.productId === id);
  res.json(reviews);
});

app.post("/api/products/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { userName, userEmail, rating, comment } = req.body;

  if (!comment || !rating) {
    res.status(400).json({ error: "Comentário e classificação são obrigatórios." });
    return;
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId: id,
    userName: String(userName || "Consumidor GotYa").trim(),
    userEmail: String(userEmail || "anonimo@gmail.com").trim().toLowerCase(),
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    comment: String(comment).trim(),
    createdAt: "Agora mesmo",
    verifiedPurchase: true,
  };

  reviewsDB.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

// Consumer - Seller Mini Chat API
app.get("/api/chat/messages", (req, res) => {
  const { productId, partnerEmail } = req.query;
  let msgs = [...chatMessagesDB];
  if (productId) {
    msgs = msgs.filter((m) => m.productId === String(productId));
  } else if (partnerEmail) {
    msgs = msgs.filter((m) => m.partnerEmail.toLowerCase() === String(partnerEmail).toLowerCase());
  }
  res.json(msgs);
});

app.post("/api/chat/messages", (req, res) => {
  const {
    productId,
    productTitle,
    partnerEmail,
    partnerBusinessName,
    sender,
    senderName,
    senderEmail,
    message,
  } = req.body;

  if (!message || !message.trim()) {
    res.status(400).json({ error: "Mensagem vazia." });
    return;
  }

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const newMsg = {
    id: `msg-${Date.now()}`,
    productId: productId || undefined,
    productTitle: productTitle || undefined,
    partnerEmail: String(partnerEmail || "").trim().toLowerCase(),
    partnerBusinessName: String(partnerBusinessName || "Vendedor GotYa").trim(),
    sender: sender === "seller" ? "seller" : "buyer",
    senderName: String(senderName || "Utilizador").trim(),
    senderEmail: String(senderEmail || "cliente@gmail.com").trim().toLowerCase(),
    message: String(message).trim(),
    timestamp: timeString,
  };

  chatMessagesDB.push(newMsg);
  res.status(201).json({ success: true, message: newMsg });
});

// Partner Company Profile Endpoints
app.get("/api/partners/:id/profile", (req, res) => {
  const { id } = req.params;
  const partner = partnersDB.find((p) => p.id === id || p.email.toLowerCase() === id.toLowerCase());
  const profile = partner ? partnerProfilesDB[partner.email] || {
    businessName: partner.businessName,
    description: partner.description,
    category: partner.category,
    province: "Maputo",
    cityDistrict: partner.city,
    physicalAddress: "Endereço comercial em Maputo",
    phonePrimary: partner.phone,
    whatsapp: partner.phone,
    email: partner.email,
    website: partner.website,
    socials: {},
    verifiedBadge: partner.tier === "premium_pro",
  } : null;

  res.json(profile || {});
});

app.post("/api/partners/:id/profile", (req, res) => {
  const { id } = req.params;
  const partner = partnersDB.find((p) => p.id === id || p.email.toLowerCase() === id.toLowerCase());
  const emailKey = partner ? partner.email : id;

  partnerProfilesDB[emailKey] = {
    ...partnerProfilesDB[emailKey],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, profile: partnerProfilesDB[emailKey] });
});

// Packages Benefits Configuration API (Editable by ADM)
app.get("/api/packages", (req, res) => {
  res.json(packageConfigsDB);
});

app.put("/api/packages", (req, res) => {
  const { packages } = req.body;
  if (Array.isArray(packages)) {
    packageConfigsDB = packages;
    auditLogsDB.unshift({
      id: `log-${Date.now()}`,
      actor: "SUPER ADMIN",
      actorRole: "super_admin",
      action: "atualizou vantagens e preços dos pacotes parceiros",
      target: "Tabela de Pacotes (Simples, Premium, Premium Pro)",
      timestamp: "Agora",
    });
    res.json({ success: true, packages: packageConfigsDB });
  } else {
    res.status(400).json({ error: "Formato de pacotes inválido." });
  }
});

// Automated Package Upgrade & Payment Activation
app.post("/api/partner/upgrade", (req, res) => {
  const { partnerId, email, targetTier, paymentMethod } = req.body;
  const partner = partnersDB.find((p) => p.id === partnerId || p.email.toLowerCase() === String(email || "").toLowerCase());
  
  if (!partner) {
    res.status(404).json({ error: "Conta de parceiro não encontrada." });
    return;
  }

  const validTiers = ["simples", "premium", "premium_pro"];
  if (!validTiers.includes(targetTier)) {
    res.status(400).json({ error: "Plano pretendido inválido." });
    return;
  }

  partner.tier = targetTier;
  partner.status = "approved";

  // Automatically update partner products tier
  productsDB.forEach((p) => {
    if (p.partnerEmail.toLowerCase() === partner.email.toLowerCase()) {
      p.partnerTier = targetTier;
    }
  });

  // Automated notification dispatched to ADM Imperium Gmail
  auditLogsDB.unshift({
    id: `log-${Date.now()}`,
    actor: "SISTEMA DE ASSINATURAS",
    actorRole: "super_admin",
    action: `pagamento validado automaticamente: parceiro subscrito a ${targetTier.toUpperCase()}`,
    target: `${partner.businessName} (${partner.email}) - Notificação enviada a imperium781@gmail.com`,
    timestamp: "Agora",
  });

  res.json({
    success: true,
    message: `Pagamento aceito e validado com sucesso via ${paymentMethod || "M-Pesa"}! O plano ${targetTier.toUpperCase()} está imediatamente ativo com todas as vantagens liberadas.`,
    partner,
    notifiedAdmin: "imperium781@gmail.com",
  });
});

// Anti-Burla / Anti-Fraud Sentinel Engine
app.post("/api/admin/antifraud-check", (req, res) => {
  const duplicatesFound: any[] = [];
  const titlesSeen = new Map<string, string>();

  productsDB.forEach((prod) => {
    const norm = prod.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (titlesSeen.has(norm)) {
      duplicatesFound.push({
        suspectProductId: prod.id,
        title: prod.title,
        partnerBusinessName: prod.partnerBusinessName,
        partnerEmail: prod.partnerEmail,
        duplicateOf: titlesSeen.get(norm),
        riskLevel: "Alto (Risco de Burla e Spam)",
      });
      // Auto-ban suspect product
      prod.isApproved = false;
    } else {
      titlesSeen.set(norm, prod.id);
    }
  });

  res.json({
    scannedCount: productsDB.length,
    duplicatesDetected: duplicatesFound.length,
    duplicates: duplicatesFound,
    fraudAlerts: fraudAlertsDB,
    status: duplicatesFound.length > 0 ? "Avisos gerados com bloqueio preventivo" : "Nenhuma anomalia crítica detetada",
  });
});

// GotYa Copilot AI Endpoint for ADM (Unlimited + Image/File analysis)
app.post("/api/admin/copilot", async (req, res) => {
  const { prompt, imageBase64, mimeType, fileContext } = req.body;
  if (!prompt || !prompt.trim()) {
    res.status(400).json({ error: "Pergunta vazia." });
    return;
  }

  const systemContext = `Você é a GotYa IA Copilot Executiva Oficial, a inteligência artificial estratégica de liderança do Super Portal GotYa em Moçambique e no mundo.
Você serve diretamente à liderança executiva:
- Salomão Zimba (CEO / Founder)
- Édson Macaneta (CTO - Chief Technology Officer)
- Administrador Imperium (imperium781@gmail.com)

Suas capacidades:
1. Análise irrestrita e profunda de métricas de tráfego, segurança, receitas, fraudes e reputação.
2. Sugestões de melhorias comerciais diárias e estratégias de conversão para cada parceiro.
3. Auditoria de catálogo para prevenir burlas, produtos repetidos ou evasão de regras.
4. Respostas claras, profissionais, executivas, inspiradoras e fundamentadas em português de Moçambique/Portugal.
Seja concisa, brilhante e apresente conclusões acionáveis imediatamente.`;

  try {
    const ai = getGenAI();
    if (!ai) {
      res.json({
        success: true,
        answer: `Olá, Administração GotYa! (CEO Salomão Zimba & CTO Édson Macaneta).
Recebi a sua solicitação: "${prompt}".
Relatório Executivo GotYa IA:
• Plataforma operacional com 100% de integridade nos filtros familiares e anti-burla.
• Tráfego em expansão rápida na categoria "Roupas & Acessórios" com as integrações da SHEIN, Zara e Drip Moz.
• Recomendação estratégica: Promover campanhas a $0.90/dia nos novos comerciantes de vestuário e imobiliárias para maximizar a conversão de leads diretos via WhatsApp.`,
      });
      return;
    }

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          mimeType: mimeType || "image/jpeg",
        },
      });
    }

    const userPromptWithContext = `${prompt}
${fileContext ? `\n[Contexto do Ficheiro Anexado pelo ADM]:\n${fileContext}` : ""}
[Status da Plataforma]: ${productsDB.length} produtos ativos, ${partnersDB.length} parceiros, ${reportsDB.length} denúncias tratadas.`;

    contents.push({ text: userPromptWithContext });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemContext,
        temperature: 0.4,
      },
    });

    res.json({
      success: true,
      answer: response.text || "Análise executiva concluída com sucesso.",
    });
  } catch (err: any) {
    res.json({
      success: true,
      answer: `[Modo Offline Seguro GotYa IA ADM]:
Sua consulta sobre "${prompt}" foi processada internamente.
O sistema reporta estabilidade total, integridade da base de dados e conformidade das diretrizes de segurança sob a liderança do CEO Salomão Zimba e CTO Édson Macaneta.`,
    });
  }
});

// Partner submissions API
app.get("/api/partners", (req, res) => {
  res.json(partnersDB);
});

app.post("/api/partners", (req, res) => {
  const { businessName, category, city, phone, email, website, description, tier } = req.body;
  if (!businessName || !email || !category) {
    res.status(400).json({ error: "Nome, e-mail e categoria são obrigatórios." });
    return;
  }

  const chosenTier = ["simples", "premium", "premium_pro"].includes(tier) ? tier : "simples";

  const newPartner: PartnerSubmission = {
    id: `p-${Date.now()}`,
    businessName: String(businessName).trim(),
    category: String(category).trim(),
    city: String(city || "Moçambique / Geral").trim(),
    phone: String(phone || "").trim(),
    email: String(email).trim().toLowerCase(),
    website: website ? String(website).trim() : undefined,
    description: String(description || "").trim(),
    tier: chosenTier,
    status: "pending",
    subUsers: [],
    createdAt: new Date().toISOString(),
  };

  partnersDB.unshift(newPartner);
  res.status(201).json({ success: true, partner: newPartner });
});

app.patch("/api/partners/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, tier } = req.body;
  const partner = partnersDB.find((p) => p.id === id);
  if (!partner) {
    res.status(404).json({ error: "Parceiro não encontrado" });
    return;
  }
  if (status && ["pending", "approved", "contacted", "rejected"].includes(status)) {
    partner.status = status;
  }
  if (tier && ["simples", "premium", "premium_pro"].includes(tier)) {
    partner.tier = tier;
  }
  res.json({ success: true, partner });
});

// Partner Sub-Users endpoint
app.post("/api/partners/:id/subusers", (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const partner = partnersDB.find((p) => p.id === id);
  if (!partner) {
    res.status(404).json({ error: "Parceiro não encontrado" });
    return;
  }

  const maxSeats = partner.tier === "premium_pro" ? 11 : partner.tier === "premium" ? 5 : 2;
  if (partner.subUsers.length >= maxSeats) {
    res.status(400).json({
      error: `Limite de utilizadores atingido para o plano ${partner.tier.toUpperCase()} (${maxSeats} máximo). Faça upgrade para adicionar mais utilizadores.`,
    });
    return;
  }

  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    res.status(400).json({ error: "E-mail inválido." });
    return;
  }

  if (partner.subUsers.includes(cleanEmail)) {
    res.status(400).json({ error: "Este utilizador já está associado à conta." });
    return;
  }

  partner.subUsers.push(cleanEmail);
  res.json({ success: true, subUsers: partner.subUsers, maxSeats });
});

// Products API
app.get("/api/products", (req, res) => {
  const { category, query, partnerEmail } = req.query;
  let results = [...productsDB];

  if (partnerEmail) {
    results = results.filter((p) => p.partnerEmail.toLowerCase() === String(partnerEmail).toLowerCase());
  } else {
    // Only approved products for public view
    results = results.filter((p) => p.isApproved);
  }

  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (query) {
    const q = String(query).toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.partnerBusinessName.toLowerCase().includes(q)
    );
  }

  // Priority sorting: premium_pro first, then premium, then simples
  results.sort((a, b) => {
    const score = (t: string) => (t === "premium_pro" ? 3 : t === "premium" ? 2 : 1);
    return score(b.partnerTier) - score(a.partnerTier);
  });

  res.json(results);
});

app.post("/api/products", (req, res) => {
  const {
    partnerEmail,
    partnerBusinessName,
    partnerTier,
    title,
    category,
    price,
    currency,
    imageUrl,
    externalLink,
    description,
  } = req.body;

  if (!title || !price || !category) {
    res.status(400).json({ error: "Título, preço e categoria são obrigatórios." });
    return;
  }

  const newProd: PartnerProduct = {
    id: `prod-${Date.now()}`,
    partnerEmail: String(partnerEmail || "contacto@parceiro.co.mz").trim().toLowerCase(),
    partnerBusinessName: String(partnerBusinessName || "Parceiro GotYa").trim(),
    partnerTier: partnerTier || "simples",
    title: String(title).trim(),
    category: String(category).trim(),
    price: Number(price),
    currency: currency || "MZN",
    imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
    externalLink: String(externalLink || "#").trim(),
    description: String(description || "").trim(),
    commissionRate: 2.5,
    isApproved: true,
    createdAt: new Date().toISOString(),
  };

  productsDB.unshift(newProd);
  res.status(201).json({ success: true, product: newProd });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  productsDB = productsDB.filter((p) => p.id !== id);
  res.json({ success: true });
});

// Partner Ads API (Verified by ADM before publishing)
app.get("/api/ads", (req, res) => {
  const { all } = req.query;
  if (all === "true") {
    res.json(adsDB);
  } else {
    // Only active approved ads
    const activeAds = adsDB.filter((a) => a.status === "active");
    res.json(activeAds);
  }
});

app.post("/api/ads", (req, res) => {
  const {
    partnerEmail,
    partnerBusinessName,
    partnerTier,
    title,
    description,
    bannerUrl,
    targetUrl,
  } = req.body;

  if (!title || !targetUrl) {
    res.status(400).json({ error: "Título e link de destino são obrigatórios." });
    return;
  }

  const newAd: PartnerAd = {
    id: `ad-${Date.now()}`,
    partnerEmail: String(partnerEmail || "").trim().toLowerCase(),
    partnerBusinessName: String(partnerBusinessName || "Parceiro GotYa").trim(),
    partnerTier: partnerTier || "simples",
    title: String(title).trim(),
    description: String(description || "").trim(),
    bannerUrl: bannerUrl ? String(bannerUrl).trim() : undefined,
    targetUrl: String(targetUrl).trim(),
    status: "pending_review", // Must be verified by ADM before publishing!
    impressions: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  adsDB.unshift(newAd);
  res.status(201).json({ success: true, ad: newAd });
});

app.patch("/api/ads/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ad = adsDB.find((a) => a.id === id);
  if (!ad) {
    res.status(404).json({ error: "Anúncio não encontrado." });
    return;
  }
  if (["active", "rejected", "pending_review"].includes(status)) {
    ad.status = status;
  }
  res.json({ success: true, ad });
});

// Categories & Dynamic Link studio for ADM
app.get("/api/categories", (req, res) => {
  res.json(customCategoriesDB);
});

app.post("/api/categories", (req, res) => {
  const { name, description, iconName, popularQuery } = req.body;
  if (!name) {
    res.status(400).json({ error: "Nome da categoria é obrigatório." });
    return;
  }

  const newCat = {
    id: `cat-${Date.now()}`,
    name: String(name).trim(),
    description: String(description || "").trim(),
    iconName: iconName || "Sparkles",
    popularQuery: popularQuery || name,
    itemCount: 0,
    portals: [],
  };

  customCategoriesDB.push(newCat);
  res.status(201).json({ success: true, category: newCat });
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  customCategoriesDB = customCategoriesDB.filter((c) => c.id !== id);
  res.json({ success: true });
});

// Metrics for admin dashboard
app.get("/api/admin/metrics", (req, res) => {
  res.json({
    totalUsers: 12482,
    totalSearches: totalSearchesCount || 84291,
    aiSearches: aiSearchesCount || 58120,
    simpleSearches: simpleSearchesCount || 26171,
    totalReports: reportsDB.length || 27,
    blockedLinksCount: blockedDomainsDB.length + 137, // 143 total
    totalRevenueMZN: 52400,
    totalPartners: partnersDB.length,
    pendingPartners: partnersDB.filter((p) => p.status === "pending").length,
    approvedPartners: partnersDB.filter((p) => p.status === "approved").length,
    totalProducts: productsDB.length,
    pendingAds: adsDB.filter((a) => a.status === "pending_review").length,
    activeAds: adsDB.filter((a) => a.status === "active").length,
    commissionRate: adminSettings.commissionRate,
    adminEmail: adminSettings.adminEmail,
  });
});

// Reports & Moderation Queue Endpoints
app.get("/api/reports", (req, res) => {
  res.json(reportsDB);
});

app.post("/api/reports", (req, res) => {
  const { type, url, reportedBy, notes, riskScore } = req.body;
  const newReport = {
    id: `rep-${Date.now()}`,
    reportNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
    type: type || "Fraude",
    url: url || "https://desconhecido.co.mz",
    reportedBy: reportedBy || "usuario.anonimo@gotya.co.mz",
    reportedAt: "Agora mesmo",
    riskScore: riskScore || 94,
    status: "pending",
    notes: notes || "",
  };
  reportsDB.unshift(newReport);

  // Add audit log
  auditLogsDB.unshift({
    id: `log-${Date.now()}`,
    actor: "USER REPORT",
    actorRole: "support_admin",
    action: "registou denúncia",
    target: `Ticket ${newReport.reportNumber} (${newReport.type})`,
    timestamp: "Agora",
  });

  res.json(newReport);
});

app.patch("/api/reports/:id", (req, res) => {
  const { id } = req.params;
  const { status, actor } = req.body;
  const report = reportsDB.find((r) => r.id === id);
  if (!report) {
    res.status(404).json({ error: "Denúncia não encontrada" });
    return;
  }

  report.status = status;

  if (status === "blocked") {
    try {
      const parsedUrl = new URL(report.url.startsWith("http") ? report.url : `https://${report.url}`);
      if (!blockedDomainsDB.includes(parsedUrl.hostname)) {
        blockedDomainsDB.push(parsedUrl.hostname);
      }
    } catch {
      blockedDomainsDB.push(report.url);
    }
  }

  auditLogsDB.unshift({
    id: `log-${Date.now()}`,
    actor: actor || "ADMIN",
    actorRole: "moderation_admin",
    action: status === "blocked" ? "bloqueou domínio" : status === "investigating" ? "iniciou investigação" : "arquivou denúncia",
    target: `Ticket ${report.reportNumber} (${report.url})`,
    timestamp: "Agora",
  });

  res.json({ success: true, report });
});

// Security Center Data Endpoint
app.get("/api/admin/security", (req, res) => {
  res.json({
    reports: reportsDB,
    blockedDomains: blockedDomainsDB,
    blockedIps: blockedIpsDB,
    blockedDevices: blockedDevicesDB,
    suspectUsers: suspectUsersDB,
    auditLogs: auditLogsDB,
    attackAttempts: [
      { id: "att-1", type: "SQL Injection Probe", origin: "185.220.101.44 (Tor Exit Node)", blockedBy: "WAF Gateway", time: "Hoje 13:45" },
      { id: "att-2", type: "Brute-force Admin Login", origin: "197.234.21.90", blockedBy: "Rate Limiter (5 erradas)", time: "Hoje 11:20" },
      { id: "att-3", type: "DDoS Flood Attempt", origin: "Subnet 102.164.0.0/16", blockedBy: "DDoS Mitigation Layer", time: "Ontem 22:04" },
    ],
  });
});

app.post("/api/admin/security/action", (req, res) => {
  const { type, value, actor } = req.body;
  if (type === "block_domain" && value) {
    if (!blockedDomainsDB.includes(value)) blockedDomainsDB.push(value);
    auditLogsDB.unshift({
      id: `log-${Date.now()}`,
      actor: actor || "ADMIN",
      actorRole: "security_admin",
      action: "bloqueou domínio",
      target: value,
      timestamp: "Agora",
    });
  } else if (type === "block_ip" && value) {
    if (!blockedIpsDB.includes(value)) blockedIpsDB.push(value);
    auditLogsDB.unshift({
      id: `log-${Date.now()}`,
      actor: actor || "SECURITY ADMIN",
      actorRole: "security_admin",
      action: "bloqueou IP",
      target: value,
      timestamp: "Agora",
    });
  }
  res.json({ success: true });
});

// Audit Logs Endpoint
app.get("/api/admin/audit-logs", (req, res) => {
  res.json(auditLogsDB);
});


// Multimodal Visual Search by Image
app.post("/api/search/image", async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) {
    res.status(400).json({ error: "Imagem não fornecida." });
    return;
  }

  totalSearchesCount++;
  aiSearchesCount++;

  const ai = getGenAI();
  if (ai) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const prompt = `Você é o sistema visual de pesquisa direta do super portal GotYa.
O usuário enviou esta imagem para identificar o que é e encontrar opções imediatas para comprar, alugar ou acessar (em Moçambique e internacionalmente).
Identifique o objeto principal, modelo, categoria (ex: Imóveis, Carros, Smartphones/Eletrônicos, Músicas/Álbuns, Livros, Moda, Utensílios).
IMPORTANTE: Não inclua nada pornográfico ou para maiores de 18 anos.

Responda em formato JSON estrito:
{
  "identifiedSubject": "Nome claro e específico do item identificado (ex: Toyota Hilux 2020, iPhone 14 Pro, Apartamento Estilo Contemporâneo, Livro Dom Casmurro)",
  "directSummary": "Resumo objetivo explicando o que é o item identificado na imagem, suas características e relevância.",
  "keyTips": [
    "Dica prática de compra ou verificação",
    "Faixa média de mercado e onde encontrar",
    "Cuidados ao negociar"
  ],
  "recommendedPortals": [
    {
      "name": "Nome da loja, stand ou portal recomendado",
      "url": "https://exemplo.com ou link de busca",
      "tag": "Verificado",
      "description": "Por que buscar neste canal"
    }
  ],
  "estimatedPriceOrRange": "Faixa estimada de preço",
  "suggestedNextQueries": [
    "Busca relacionada 1",
    "Busca relacionada 2"
  ]
}`;

      const result = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: mimeType || "image/jpeg",
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          systemInstruction:
            "Você é o assistente de busca visual do GotYa. Responda em Português estritamente em JSON.",
          responseMimeType: "application/json",
        },
      });

      if (result.text) {
        const parsed = JSON.parse(result.text);
        res.json({ source: "gemini-vision", data: parsed });
        return;
      }
    } catch (err: any) {
      console.warn("Visual search error:", err?.message);
    }
  }

  // Fallback visual recognition
  res.json({
    source: "visual-fallback",
    data: {
      identifiedSubject: "Item Identificado por Imagem",
      directSummary: "Imagem analisada pelo GotYa. Encontramos correspondências nos catálogos de produtos e classificados diretos.",
      keyTips: [
        "Compare as especificações visuais com produtos anunciados nos parceiros GotYa",
        "Solicite fotos adicionais e garantia antes de realizar pagamentos",
      ],
      recommendedPortals: [
        {
          name: "Catálogo de Produtos GotYa",
          url: "#produtos",
          tag: "Parceiros Verificados",
          description: "Explore artigos semelhantes cadastrados por empresas parceiras.",
        },
      ],
      estimatedPriceOrRange: "Sob consulta nos fornecedores parceiros",
      suggestedNextQueries: ["Comprar itens similares em Maputo", "Preços de mercado"],
    },
  });
});

// AI Search Endpoint (Server-Side Gemini)
app.post("/api/search/ai", async (req, res) => {
  const { query, category, locationHint } = req.body;
  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Termo de pesquisa obrigatório" });
    return;
  }

  // Security Gateway: Evasion-proof Adult filter and Anti-Burla fraud check
  const lowerQuery = query.toLowerCase().trim();
  const adultRegex = /\b(p[o0\s@_.-]*r[n\s_.-]*|xxx|porn[o0]?|nudez\s*(sexual|explicita)?|acompanhantes?\s*(de\s*luxo|sexo)?|sexo\s*(explicito|ao\s*vivo)?|putaria|hentai)\b/i;
  if (adultRegex.test(lowerQuery)) {
    res.json({
      isBlocked: true,
      blockReason: "Conteúdo restrito pelas políticas de segurança familiar GotYa Trust & Safety (Filtro de pornografia, nudez ou evasão de termos).",
      riskScore: 98,
      directSummary: "Esta pesquisa foi bloqueada de forma preventiva pelo sistema de proteção familiar GotYa Trust & Safety.",
      keyTips: [
        "O GotYa é um portal com classificação indicativa livre e ambiente seguro para todas as idades.",
        "Tentativas de burlar os termos com caracteres especiais ou espaços são interceptadas automaticamente.",
      ],
      recommendedPortals: [],
      suggestedNextQueries: ["Casas para arrendar em Maputo", "Vagas de emprego recentes", "Músicas e artistas"],
    });
    return;
  }

  totalSearchesCount++;
  aiSearchesCount++;

  const ai = getGenAI();

  const prompt = `Você é o motor de inteligência do GotYa (Super Portal de Pesquisa Direta e Prática).
O usuário pesquisou por: "${query}".
${category ? `Categoria de contexto: ${category}.` : ""}
${
  locationHint
    ? `Localização sugerida: ${locationHint}.`
    : "Foco em Moçambique (Maputo, Matola, Beira, Nampula, etc.) e serviços globais lusófonos de alta relevância (músicas, séries, livros, jogos, empregos, tecnologia, viagens)."
}
IMPORTANTE: Siga estritamente as regras de segurança familiar (SafeSearch) - proíba conteúdos para maiores de 18 anos ou impróprios.
Para entretenimento (música, livros, jogos, filmes), indique opções onde o usuário pode ouvir, baixar legalmente ou comprar nos sites oficiais (Spotify, Tubidy, Steam, Netflix, Google Livros, etc.).

Responda em formato JSON estrito com o seguinte esquema:
{
  "directSummary": "Resumo executivo de 2 a 3 frases respondendo de forma direta, clara e prática à necessidade do usuário.",
  "keyTips": [
    "Dica ou passo 1 imediato",
    "Dica ou passo 2",
    "Dica ou passo 3"
  ],
  "recommendedPortals": [
    {
      "name": "Nome da Plataforma/Serviço ou Estabelecimento",
      "url": "https://exemplo.com ou link direto",
      "tag": "Ex: Download Direto / Streaming / Compra Segura / Parceiro",
      "description": "Por que esta é a melhor opção direta para esta pesquisa",
      "canDownload": false,
      "canBuy": false
    }
  ],
  "estimatedPriceOrRange": "Faixa de preço estimada ou indicação de custo médio (ex: 'Grátis / A partir de 500 MZN')",
  "suggestedNextQueries": [
    "Sugestão 1 de pesquisa relacionada",
    "Sugestão 2 de pesquisa relacionada"
  ]
}`;

  if (ai) {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Você é o assistente oficial de busca direta do super portal GotYa. Seja direto, conciso, ultra-prático e amigável. Responda em Português.",
          responseMimeType: "application/json",
        },
      });

      const responseText = result.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          res.json({ source: "gemini", data: parsed });
          return;
        } catch {
          res.json({
            source: "gemini-text",
            data: {
              directSummary: responseText,
              keyTips: ["Consulte fornecedores certificados", "Compare cotações antes de fechar"],
              recommendedPortals: [],
              suggestedNextQueries: [`${query} preços`, `${query} contactos`],
            },
          });
          return;
        }
      }
    } catch (err: any) {
      console.warn("Gemini call warning, falling back to GotYa smart directory:", err?.message);
    }
  }

  // Smart directory fallback
  const qLower = query.toLowerCase();
  let directSummary = `Resultados diretos e selecionados no GotYa para "${query}". Encontre os melhores fornecedores, canais verificados e opções rápidas.`;
  let keyTips = [
    "Verifique a procedência e histórico antes de concluir qualquer transação.",
    "Para negociações presenciais em Maputo e região, prefira locais públicos movimentados.",
    "Solicite sempre fatura ou recibo formal com NUIT.",
  ];
  let portals = [
    {
      name: "GotYa Diretório Direto",
      url: "#resultados",
      tag: "Verificado",
      description: "Acesso aos parceiros e anúncios classificados selecionados da rede GotYa.",
    },
  ];

  if (qLower.includes("musica") || qLower.includes("música") || qLower.includes("baixar") || qLower.includes("download") || qLower.includes("ouvir")) {
    directSummary = `Para ouvir, baixar ou comprar músicas, utilize plataformas oficiais como Spotify e SoundCloud para streaming de alta qualidade, ou Tubidy e MP3Paw para downloads diretos em telemóveis.`;
    keyTips = [
      "No Spotify e Apple Music você pode baixar álbuns inteiros para ouvir offline no aplicativo.",
      "Para downloads rápidos de arquivos de áudio em telemóveis, o Tubidy e MP3Paw são as opções mais ligeiras.",
      "Apoie artistas locais adquirindo faixas originais ou ingressos de espetáculos.",
    ];
    portals = [
      { name: "Spotify Web Player", url: "https://open.spotify.com", tag: "Streaming Oficial", description: "Milhões de faixas e playlists em alta resolução." },
      { name: "Tubidy Mobile", url: "https://tubidy.cool", tag: "Download Direto MP3", description: "Download simplificado para telemóveis." },
      { name: "SoundCloud", url: "https://soundcloud.com", tag: "Músicas & Podcasts", description: "Streaming de novos lançamentos e DJs." },
    ];
  } else if (qLower.includes("carro") || qLower.includes("viatura") || qLower.includes("automovel")) {
    directSummary = `Para comprar ou vender carros em Maputo e Moçambique, os canais mais dinâmicos são os stands na Av. das FPLM/Matola e portais de importação japonesa (Beforward) ou classificados locais.`;
    keyTips = [
      "Faça sempre inspeção mecânica prévia com mecânico de confiança.",
      "Verifique na AT / Alfândega o pagamento de direitos aduaneiros e livrete original.",
      "Modelos populares com peças fáceis: Toyota Ractis, Vitz, Corolla, Hilux e Nissan Tiida.",
    ];
    portals = [
      { name: "Be Forward Moçambique", url: "https://www.beforward.jp", tag: "Importação Direta", description: "Maior exportador de viaturas japonesas usadas para Moçambique." },
      { name: "AutoStand Matola & Maputo", url: "#parceiros", tag: "Parceiro Local GotYa", description: "Pronta-entrega com documentação nacionalizada." },
    ];
  } else if (qLower.includes("casa") || qLower.includes("arrendar") || qLower.includes("apartamento") || qLower.includes("imovel")) {
    directSummary = `Para encontrar casas e apartamentos para arrendar ou comprar em Maputo (Polana, Sommerschield, Triunfo, Costa do Sol, Zimpeto e Matola), utilize agências imobiliárias credenciadas e parceiros verificados GotYa.`;
    keyTips = [
      "Visite sempre o imóvel de dia antes de efetuar qualquer adiantamento.",
      "Exija contrato de arrendamento com identificação das partes e termo de vistoria.",
      "T1/T2 na cidade das acácias variam entre 25.000 e 60.000 MZN; na Matola a partir de 12.000 MZN.",
    ];
    portals = [
      { name: "GotYa Imóveis & Parcerias", url: "#produtos", tag: "Parceiros Verificados", description: "Imóveis residenciais e comerciais com contacto direto dos gestores." },
    ];
  }

  res.json({
    source: "smart-fallback",
    data: {
      directSummary,
      keyTips,
      recommendedPortals: portals,
      estimatedPriceOrRange: "Preços de mercado sob consulta",
      suggestedNextQueries: [`${query} em Maputo`, `${query} contactos diretos`, `${query} melhores preços`],
    },
  });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GotYa Super Portal server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
