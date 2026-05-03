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
