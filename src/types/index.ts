export type EconomicField =
  | 'Microeconomics'
  | 'Macroeconomics'
  | 'Monetary economics'
  | 'International economics'
  | 'International finance'
  | 'Financial economics'
  | 'Corporate finance'
  | 'Banking and financial regulation'
  | 'Public economics'
  | 'Industrial organisation'
  | 'Development economics'
  | 'Economic history'
  | 'Institutional economics';

export type EconomicMechanism =
  | 'Incentives'
  | 'Information asymmetry'
  | 'Principal-agent problems'
  | 'Market power'
  | 'Strategic interaction'
  | 'Price mechanisms'
  | 'Expectations and uncertainty'
  | 'Credit transmission'
  | 'Monetary transmission'
  | 'Fiscal transmission'
  | 'Capital allocation'
  | 'International capital flows'
  | 'Institutional change'
  | 'Welfare and distribution';

export type ConnectionType =
  | 'continuation'
  | 'institutional relationship'
  | 'theoretical connection'
  | 'historical analogy'
  | 'causal hypothesis'
  | 'contradictory evidence';

export interface AcademicCitation {
  paperTitle: string;
  authors: string;
  year: number;
  sourceOrJournal: string;
  link?: string;
  keyFinding: string;
}

export interface EconomicStory {
  id: string;
  headline: string;
  originalSource: string;
  sourceUrl: string;
  publicationDate: string; // ISO string or YYYY-MM-DD
  eventDate?: string;
  jurisdiction: string; // e.g. "United States", "Eurozone", "China", "Global", "United Kingdom", "Japan"
  institutions: string[]; // e.g. ["Federal Reserve", "FOMC"]
  factualSummary: string; // strictly verified factual report
  classification: EconomicField[];
  mechanisms: EconomicMechanism[];
  theoreticalFrameworks: string[]; // e.g. ["New Keynesian Phillips Curve", "Mundell-Fleming Trilemma"]
  economicMechanismsDetail: string; // detailed step-by-step transmission explanation
  possibleImplications: {
    nearTerm: string[];
    structural: string[];
  };
  distributionalEffects?: string; // distributional or institutional winners/losers
  uncertaintyAndAlternatives: string; // alternative interpretations and counterarguments
  academicResearchCitations: AcademicCitation[];
  potentialResearchQuestions: string[];
  futureIndicatorsToWatch: string[];
  significanceScore: number; // 1-100
  relatedStoryIds: string[];
  status: 'analyzed' | 'raw';
}

export interface DailyBriefing {
  id: string;
  editionDate: string; // YYYY-MM-DD
  generatedAt: string; // ISO
  lastUpdateStatus: 'success' | 'partial' | 'fallback';
  executiveSummary: string;
  leadStoryId: string;
  topStoryIds: string[];
  environmentOverview: {
    monetaryStance: string;
    fiscalOutlook: string;
    financialStabilityAlerts: string;
    crossBorderRisks: string;
  };
  regionalSummary: Record<string, string>;
  indicatorHighlights: Array<{
    label: string;
    value: string;
    change: string;
    signal: 'hawkish' | 'dovish' | 'expansionary' | 'contractionary' | 'neutral';
  }>;
  sourcesQueriedCount: number;
  articlesIngestedCount: number;
}

export type PolicyStatus = 'Proposed' | 'Consultation' | 'Enacted' | 'Implemented' | 'Under Review';

export interface PolicyItem {
  id: string;
  jurisdiction: string;
  institution: string;
  title: string;
  announcementDate: string;
  consultationDate?: string;
  adoptionDate?: string;
  effectiveDate?: string;
  status: PolicyStatus;
  previousPolicyVersion?: string;
  targetedEconomicProblem: string;
  expectedTransmissionMechanisms: string[];
  winners: string[];
  losers: string[];
  unintendedConsequences: string[];
  relatedStoryIds: string[];
  sourceUrl?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  institution: string; // e.g. "NBER", "CEPR", "BIS", "IMF", "Federal Reserve Board"
  publicationDate: string;
  format: 'Working Paper' | 'Journal Publication' | 'Policy Discussion Paper';
  field: string;
  isAbstractOnly: boolean;
  researchQuestion: string;
  methodology: string;
  mainFindings: string[];
  contribution: string;
  limitations: string[];
  relatedPreviousResearch: string[];
  paperUrl: string;
}

export interface EconomicConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceTitle: string;
  targetTitle: string;
  type: ConnectionType;
  rationale: string;
  historicalPrecedent?: {
    era: string;
    description: string;
    keySimilarity: string;
    keyDifference: string;
  };
  confidence: 'established' | 'hypothesized' | 'analogous';
}

export interface EconomicIndicator {
  id: string;
  name: string;
  category: 'macro' | 'inflation' | 'rates' | 'labor' | 'external' | 'stability';
  jurisdiction: string;
  latestObservation: number | string;
  unit: string;
  referencePeriod: string; // e.g. "Q3 2026", "October 2026"
  releaseDate: string; // e.g. "2026-11-05"
  previousObservation: number | string;
  revision?: string;
  history: Array<{ date: string; value: number }>;
  significance: string;
}

export interface SourceConfig {
  id: string;
  name: string;
  institution: string;
  type: 'rss' | 'api' | 'feed';
  url: string;
  jurisdiction: string;
  category: string;
  active: boolean;
  lastChecked?: string;
  itemCount?: number;
}

export interface PipelineExecutionStatus {
  lastRunTimestamp: string | null;
  status: 'idle' | 'running' | 'success' | 'error';
  currentStage?: string;
  totalStoriesProcessed: number;
  newStoriesAdded: number;
  sourcesContacted: number;
  errors: string[];
  logs: string[];
}
