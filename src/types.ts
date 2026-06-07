export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isPaidTier: boolean;
  subscriptionId?: string;
  subscriptionStatus?: string;
  customerPortalUrl?: string;
}

export interface StrategyObjective {
  id: string;
  text: string;
}

export interface StrategyMapData {
  title?: string;
  financial: StrategyObjective[];
  customer: StrategyObjective[];
  internal: StrategyObjective[];
  learning: StrategyObjective[];
}

export interface SwotData {
  title?: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface PestelData {
  political: string;
  economic: string;
  social: string;
  technological: string;
  environmental: string;
  legal: string;
}

export interface PorterForcesData {
  competitiveRivalry: string;
  threatOfNewEntrants: string;
  threatOfSubstitutes: string;
  bargainingPowerOfBuyers: string;
  bargainingPowerOfSuppliers: string;
}

export interface LeanCanvasData {
  problem: string;
  solution: string;
  uniqueValueProposition: string;
  unfairAdvantage: string;
  lcCustomerSegments: string;
  keyMetrics: string;
  lcChannels: string;
  lcCostStructure: string;
  lcRevenueStreams: string;
}

export interface AnsoffMatrixData {
  marketPenetration: string;
  productDevelopment: string;
  marketDevelopment: string;
  diversification: string;
}

export interface BcgMatrixData {
  stars: string;
  cashCows: string;
  questionMarks: string;
  dogs: string;
}

export interface Mckinsey7SData {
  sharedValues: string;
  strategy: string;
  structure: string;
  systems: string;
  style: string;
  staff: string;
  skills: string;
}

export interface ElevatorPitchData {
  targetCustomer: string;
  unmetNeed: string;
  productName: string;
  marketCategory: string;
  productBenefit: string;
  competitors: string;
  differentiator: string;
}

export interface ValueChainData {
  inboundLogistics: string;
  operations: string;
  outboundLogistics: string;
  marketingSales: string;
  service: string;
  firmInfrastructure: string;
  hrManagement: string;
  technologyDevelopment: string;
  procurement: string;
}

export interface CustomerJourneyData {
  awareness: string;
  consideration: string;
  purchase: string;
  retention: string;
  advocacy: string;
}

export interface MarketSizingData {
  tam: string;
  sam: string;
  som: string;
  tamDescription: string;
  samDescription: string;
  somDescription: string;
}

export interface RiskRegisterItem {
  id: string;
  type: 'Risk' | 'Opportunity';
  risk: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export type RiskRegisterData = RiskRegisterItem[];

export interface FinancialYear {
  year: number;
  revenue: number;
  cogs: number;
  salaries?: number;
  rent?: number;
  bankingCharges?: number;
  insurances?: number;
  stock?: number;
  depreciation?: number;
  otherOpEx?: number;
  operatingExpenses: number;
}

export interface StartupCosts {
  itComputers: number;
  stock: number;
  tools: number;
  professionalFees: number;
  insurance: number;
  rentDeposit: number;
  licenses: number;
  wagesRecruitment: number;
  other: number;
}

export interface PersonalBudget {
  mortgageRent: number;
  utilities: number;
  food: number;
  taxes: number;
  otherExpenditure: number;
  personalIncome: number;
}

export interface SourcingFinance {
  borrowingRequirements: number;
  startupContributions: number;
  assetsSecurity: string;
}

export interface FinancialProjectionsData {
  years: FinancialYear[];
  startupCosts?: StartupCosts;
  personalBudget?: PersonalBudget;
  sourcingFinance?: SourcingFinance;
}

export interface KeyPerson {
  id: string;
  name: string;
  position: string;
  experience: string;
  previousEmployment: string;
  keySkills: string;
  qualifications: string;
  recentSalary: string;
}

export interface FeatureBenefit {
  id: string;
  feature: string;
  benefit: string;
}

export interface CompetitorItem {
  id: string;
  name: string;
  strengths: string;
  weaknesses: string;
}

export interface CompetitorPrice {
  id: string;
  productService: string;
  yourPrice: string;
  competitorPriceRange: string;
  differenceReason: string;
}

export interface StaffMember {
  id: string;
  role: string;
  totalCost: string;
  experience: string;
  skillsQualifications: string;
}

export interface SupplierItem {
  id: string;
  name: string;
  productServiceProvided: string;
  creditTermsDays: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  cost: string;
  timing: string;
  fundingSource: string;
}

export interface BusinessPlanData {
  executiveSummary: string;
  mission: string;
  vision: string;
  values: string;
  businessName?: string;
  address?: string;
  telephone?: string;
  legalStatus?: string;
  dateEstablished?: string;
  registrationNumber?: string;
  advisers?: string;
  isVatRegistered?: boolean;
  onlinePresence?: string;
  keyPersonnel?: KeyPerson[];
  fairWorkPractices?: string;
  sustainabilityPolicy?: string;
  featuresBenefits?: FeatureBenefit[];
  marketTrends?: string;
  marketTrendsResearch?: string;
  customerGroups?: string;
  customerDemands?: string;
  customerResearch?: string;
  competitors?: CompetitorItem[];
  competitorPricing?: CompetitorPrice[];
  gatheredCompetitorInfo?: string;
  competitorImprovement?: string;
  competitiveAdvantage?: string;
  staffMembers?: StaffMember[];
  premisesStartupCosts?: string;
  premisesFutureRequirements?: string;
  suppliers?: SupplierItem[];
  equipment?: EquipmentItem[];
  businessGoals?: string;
}

export interface CanvasData {
  id?: string;
  userId: string;
  title: string;
  keyPartners: string;
  keyActivities: string;
  valuePropositions: string;
  customerRelationships: string;
  customerSegments: string;
  keyResources: string;
  channels: string;
  costStructure: string;
  revenueStreams: string;
  strategyMap?: StrategyMapData;
  swot?: SwotData;
  pestel?: PestelData;
  porterForces?: PorterForcesData;
  leanCanvas?: LeanCanvasData;
  ansoffMatrix?: AnsoffMatrixData;
  bcgMatrix?: BcgMatrixData;
  valueChain?: ValueChainData;
  customerJourney?: CustomerJourneyData;
  businessPlan?: BusinessPlanData;
  marketSizing?: MarketSizingData;
  riskRegister?: RiskRegisterData;
  financials?: FinancialProjectionsData;
  mckinsey7s?: Mckinsey7SData;
  elevatorPitch?: ElevatorPitchData;
  createdAt: any;
  updatedAt: any;
  imageUrl?: string;
  logoUrl?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
