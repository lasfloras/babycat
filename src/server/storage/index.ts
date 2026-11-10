import fs from 'node:fs';
import path from 'node:path';
import {
  EconomicStory,
  DailyBriefing,
  PolicyItem,
  ResearchPaper,
  EconomicConnection,
  EconomicIndicator,
  SourceConfig,
  PipelineExecutionStatus
} from '../../types/index.ts';
import {
  initialSources,
  initialStories,
  initialBriefings,
  initialPolicies,
  initialResearch,
  initialConnections,
  initialIndicators
} from './seedData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filename, fallback);
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) {
      writeJsonFile(filename, fallback);
      return fallback;
    }
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filename}, falling back to initial:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

export class StorageManager {
  private static defaultStatus: PipelineExecutionStatus = {
    lastRunTimestamp: '2026-11-09T20:00:00Z',
    status: 'idle',
    totalStoriesProcessed: 42,
    newStoriesAdded: 5,
    sourcesContacted: 10,
    errors: [],
    logs: [
      '2026-11-09T20:00:00Z - Daily economic ingestion pipeline completed successfully.',
      'Sources queried: 10 institutional feeds.',
      'Identified 5 high-significance stories. Structured analysis and taxonomy validated.'
    ]
  };

  // Sources
  static getSources(): SourceConfig[] {
    return readJsonFile<SourceConfig[]>('sources.json', initialSources);
  }

  static saveSource(source: SourceConfig): SourceConfig {
    const sources = this.getSources();
    const index = sources.findIndex((s) => s.id === source.id);
    if (index >= 0) {
      sources[index] = source;
    } else {
      sources.push(source);
    }
    writeJsonFile('sources.json', sources);
    return source;
  }

  static deleteSource(id: string): boolean {
    const sources = this.getSources();
    const filtered = sources.filter((s) => s.id !== id);
    if (filtered.length !== sources.length) {
      writeJsonFile('sources.json', filtered);
      return true;
    }
    return false;
  }

  // Stories
  static getStories(): EconomicStory[] {
    return readJsonFile<EconomicStory[]>('stories.json', initialStories);
  }

  static getStoryById(id: string): EconomicStory | undefined {
    return this.getStories().find((s) => s.id === id);
  }

  static saveStory(story: EconomicStory): EconomicStory {
    const stories = this.getStories();
    const index = stories.findIndex((s) => s.id === story.id);
    if (index >= 0) {
      stories[index] = story;
    } else {
      stories.unshift(story);
    }
    writeJsonFile('stories.json', stories);
    return story;
  }

  static saveStories(newStories: EconomicStory[]): void {
    const stories = this.getStories();
    const storyMap = new Map(stories.map((s) => [s.id, s]));
    for (const story of newStories) {
      storyMap.set(story.id, story);
    }
    const merged = Array.from(storyMap.values()).sort(
      (a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
    );
    writeJsonFile('stories.json', merged);
  }

  // Briefings
  static getBriefings(): DailyBriefing[] {
    return readJsonFile<DailyBriefing[]>('briefings.json', initialBriefings);
  }

  static getLatestBriefing(): DailyBriefing {
    const briefings = this.getBriefings();
    if (briefings.length === 0) {
      return initialBriefings[0];
    }
    return briefings.sort(
      (a, b) => new Date(b.editionDate).getTime() - new Date(a.editionDate).getTime()
    )[0];
  }

  static getBriefingByDate(date: string): DailyBriefing | undefined {
    return this.getBriefings().find((b) => b.editionDate === date);
  }

  static saveBriefing(briefing: DailyBriefing): DailyBriefing {
    const briefings = this.getBriefings();
    const index = briefings.findIndex((b) => b.editionDate === briefing.editionDate);
    if (index >= 0) {
      briefings[index] = briefing;
    } else {
      briefings.unshift(briefing);
    }
    writeJsonFile('briefings.json', briefings);
    return briefing;
  }

  // Policies
  static getPolicies(): PolicyItem[] {
    return readJsonFile<PolicyItem[]>('policies.json', initialPolicies);
  }

  static getPolicyById(id: string): PolicyItem | undefined {
    return this.getPolicies().find((p) => p.id === id);
  }

  static savePolicy(policy: PolicyItem): PolicyItem {
    const policies = this.getPolicies();
    const index = policies.findIndex((p) => p.id === policy.id);
    if (index >= 0) {
      policies[index] = policy;
    } else {
      policies.unshift(policy);
    }
    writeJsonFile('policies.json', policies);
    return policy;
  }

  // Research
  static getResearch(): ResearchPaper[] {
    return readJsonFile<ResearchPaper[]>('research.json', initialResearch);
  }

  static saveResearchPaper(paper: ResearchPaper): ResearchPaper {
    const papers = this.getResearch();
    const index = papers.findIndex((p) => p.id === paper.id);
    if (index >= 0) {
      papers[index] = paper;
    } else {
      papers.unshift(paper);
    }
    writeJsonFile('research.json', papers);
    return paper;
  }

  // Connections
  static getConnections(): EconomicConnection[] {
    return readJsonFile<EconomicConnection[]>('connections.json', initialConnections);
  }

  static saveConnection(conn: EconomicConnection): EconomicConnection {
    const connections = this.getConnections();
    const index = connections.findIndex((c) => c.id === conn.id);
    if (index >= 0) {
      connections[index] = conn;
    } else {
      connections.push(conn);
    }
    writeJsonFile('connections.json', connections);
    return conn;
  }

  // Indicators
  static getIndicators(): EconomicIndicator[] {
    return readJsonFile<EconomicIndicator[]>('indicators.json', initialIndicators);
  }

  static updateIndicator(indicator: EconomicIndicator): EconomicIndicator {
    const indicators = this.getIndicators();
    const index = indicators.findIndex((i) => i.id === indicator.id);
    if (index >= 0) {
      indicators[index] = indicator;
    } else {
      indicators.push(indicator);
    }
    writeJsonFile('indicators.json', indicators);
    return indicator;
  }

  // Pipeline Status
  static getPipelineStatus(): PipelineExecutionStatus {
    return readJsonFile<PipelineExecutionStatus>('pipeline_status.json', this.defaultStatus);
  }

  static updatePipelineStatus(update: Partial<PipelineExecutionStatus>): PipelineExecutionStatus {
    const current = this.getPipelineStatus();
    const updated: PipelineExecutionStatus = {
      ...current,
      ...update,
      logs: update.logs ? update.logs : current.logs
    };
    writeJsonFile('pipeline_status.json', updated);
    return updated;
  }
}
