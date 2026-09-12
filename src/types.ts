export type SearchMode = "ai" | "simple";
export type PartnerTier = "simples" | "premium" | "premium_pro";
export type CurrencyCode = "USD" | "MZN" | "EUR" | "BRL";
export type LanguageCode = "pt" | "en" | "es" | "fr";

export type AdminRole =
  | "super_admin"
  | "security_admin"
  | "content_admin"
  | "moderation_admin"
  | "business_admin"
  | "finance_admin"
  | "support_admin";

export interface LocationOption {
  id: string;
  name: string;
  region: string;
  country: string;
  isPopular?: boolean;
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserAccount {
  email: string;
  name?: string;
  phone?: string;
  isAdmin: boolean;
  adminRole?: AdminRole;
  isPartner?: boolean;
  partnerStatus?: "pending" | "approved" | "rejected";
  partnerTier?: PartnerTier;
  maxSubUsers?: number;
  subUsers?: string[];
  registeredAt: string;
  photoUrl?: string;
  twoFactorEnabled?: boolean;
  activeSessions?: DeviceSession[];
  aiQueriesUsed?: number;
  aiQueriesLimit?: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  mode: SearchMode;
  searchType?: "text" | "image" | "audio";
  category?: string;
  resultCount?: number;
  thumbnail?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  category?: string;
}

export interface FavoriteItem {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  badge?: string;
  savedAt: string;
}

export interface PortalLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tag: string;
  verified: boolean;
  directActionText?: string;
  phone?: string;
  location?: string;
  isFeaturedDaily?: boolean;
  dailyVisits?: string;
  canDownload?: boolean;
  canBuy?: boolean;
  downloadUrl?: string;
  buyUrl?: string;
  price?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  popularQuery: string;
  itemCount: number;
  portals: PortalLink[];
}

export type CategoryData = CategoryItem;

export interface AiSearchResult {
  directSummary: string;
  keyTips: string[];
  recommendedPortals: {
    name: string;
    url: string;
    tag: string;
    description: string;
    canDownload?: boolean;
    canBuy?: boolean;
  }[];
  estimatedPriceOrRange?: string;
  suggestedNextQueries?: string[];
  identifiedSubject?: string;
}

export interface PartnerProduct {
  id: string;
  partnerEmail: string;
  partnerBusinessName: string;
  partnerTier: PartnerTier;
  title: string;
  category: string;
  price: number;
  currency: CurrencyCode;
  imageUrl?: string;
  externalLink: string;
  description: string;
  commissionRate: number; // 2.5%
  isApproved: boolean;
  createdAt: string;
}

export interface PartnerAd {
  id: string;
  partnerEmail: string;
  partnerBusinessName: string;
  partnerTier: PartnerTier;
  title: string;
  description: string;
  bannerUrl?: string;
  targetUrl: string;
  status: "pending_review" | "active" | "rejected";
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface PartnerSubmission {
  id: string;
  businessName: string;
  category: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  tier: PartnerTier;
  status: "pending" | "approved" | "contacted" | "rejected";
  subUsers: string[];
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  addedAt: string;
}

export interface AdminSettings {
  adminEmail: string;
  adminPasswordHash: string; // "Imperium1@.com"
  planPrices: {
    premiumUSD: number;
    premiumProUSD: number;
    premiumMZN: number;
    premiumProMZN: number;
  };
  motherAccount: {
    visaNumber: string;
    cvv: string;
    expiry: string;
    mpesa: string;
    emola: string;
  };
  contacts: {
    whatsapp: string;
    instagram: string;
    email: string;
  };
  staffMembers: StaffMember[];
  commissionRate: number; // 2.5
}

export interface ReportTicket {
  id: string;
  reportNumber: string; // e.g. "#4921"
  type: "Fraude" | "Conteúdo Adulto" | "Link Suspeito" | "Phishing" | "Outro";
  url: string;
  reportedBy: string;
  reportedAt: string;
  riskScore: number; // 0 - 100
  status: "pending" | "investigating" | "blocked" | "dismissed";
  notes?: string;
}

export interface AuditLogItem {
  id: string;
  actor: string; // "SUPER ADMIN", "ADMIN", "MODERATOR", "SECURITY ADMIN"
  action: string; // "alterou categoria", "bloqueou domínio", "removeu conteúdo", "suspendeu usuário", "alterou configuração"
  target: string;
  timestamp: string;
}

export interface OfficialDestination {
  id: string;
  keyword: string;
  name: string;
  officialDomain: string;
  targetUrl: string;
  category: string;
  logoText?: string;
  sslVerified: boolean;
  reputation: "Seguro" | "Verificado" | "Oficial";
  riskScore: number; // e.g. 0
  description: string;
}

export interface SafetyAnalysis {
  isBlocked: boolean;
  blockReason?: string;
  evasionDetected?: boolean;
  riskScore: number;
  fraudWarning?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

export interface SellerChatMessage {
  id: string;
  productId?: string;
  productTitle?: string;
  partnerEmail: string;
  partnerBusinessName: string;
  sender: "buyer" | "seller" | "system";
  senderName: string;
  senderEmail: string;
  message: string;
  timestamp: string;
}

export interface AdCampaignRequest {
  id: string;
  userEmail: string;
  userName?: string;
  title: string;
  description: string;
  bannerUrl?: string;
  targetUrl: string;
  days: number;
  dailyRateUSD: number; // 0.90 USD/day
  totalUSD: number;
  totalMZN: number;
  paymentMethod: "mpesa" | "emola" | "visa" | "mastercard";
  status: "pending_review" | "active" | "rejected" | "expired";
  phone?: string;
  createdAt: string;
  impressions?: number;
  clicks?: number;
}

export interface PartnerCompanyProfile {
  businessName: string;
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  category: string;
  province: string;
  cityDistrict: string;
  physicalAddress: string;
  googleMapsUrl?: string;
  phonePrimary: string;
  phoneSecondary?: string;
  whatsapp: string;
  email: string;
  website?: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
  };
  openingHours?: string;
  nuit?: string;
  verifiedBadge?: boolean;
}

export interface AdminCopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: "image" | "document" | "log";
}

export interface PackageBenefitConfig {
  tier: PartnerTier;
  name: string;
  priceUSD: number;
  priceMZN: number;
  badge: string;
  description: string;
  maxSeats: number;
  aiLimits: string;
  features: string[];
  isHighlighted?: boolean;
}

