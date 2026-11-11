import express, { Request, Response, NextFunction } from 'express';
import { StorageManager } from './storage/index.ts';
import { PipelineRunner } from './pipeline/pipelineRunner.ts';

export const app = express();

app.use(express.json());

// Enable CORS for client-server decoupling and Vercel preview environments
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Router for API endpoints
const apiRouter = express.Router();

// System Health & Information
apiRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Economic Observatory API',
    status: 'online',
    version: '1.0.0',
    endpoints: [
      '/api/briefings',
      '/api/briefings/latest',
      '/api/stories',
      '/api/policies',
      '/api/research',
      '/api/indicators',
      '/api/connections',
      '/api/sources',
      '/api/pipeline/status',
      '/api/pipeline/run'
    ]
  });
});

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 1. Briefings
apiRouter.get('/briefings', (_req: Request, res: Response) => {
  const briefings = StorageManager.getBriefings();
  res.json(briefings);
});

apiRouter.get('/briefings/latest', (_req: Request, res: Response) => {
  const latest = StorageManager.getLatestBriefing();
  res.json(latest);
});

apiRouter.get('/briefings/:date', (req: Request, res: Response) => {
  const briefing = StorageManager.getBriefingByDate(req.params.date);
  if (!briefing) {
    return res.status(404).json({ error: 'Briefing not found for date' });
  }
  res.json(briefing);
});

// 2. Stories
apiRouter.get('/stories', (req: Request, res: Response) => {
  let stories = StorageManager.getStories();
  const { field, mechanism, jurisdiction, search, status } = req.query;

  if (field && typeof field === 'string') {
    stories = stories.filter((s) => s.classification.includes(field as any));
  }
  if (mechanism && typeof mechanism === 'string') {
    stories = stories.filter((s) => s.mechanisms.includes(mechanism as any));
  }
  if (jurisdiction && typeof jurisdiction === 'string') {
    stories = stories.filter((s) => s.jurisdiction.toLowerCase() === jurisdiction.toLowerCase());
  }
  if (status && typeof status === 'string') {
    stories = stories.filter((s) => s.status === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    stories = stories.filter(
      (s) =>
        s.headline.toLowerCase().includes(q) ||
        s.factualSummary.toLowerCase().includes(q) ||
        s.institutions.some((i) => i.toLowerCase().includes(q)) ||
        s.theoreticalFrameworks.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json(stories);
});

apiRouter.get('/stories/:id', (req: Request, res: Response) => {
  const story = StorageManager.getStoryById(req.params.id);
  if (!story) {
    return res.status(404).json({ error: 'Story not found' });
  }
  // Include direct connections
  const connections = StorageManager.getConnections().filter(
    (c) => c.sourceId === story.id || c.targetId === story.id
  );
  res.json({ ...story, connections });
});

// 3. Policies
apiRouter.get('/policies', (_req: Request, res: Response) => {
  const policies = StorageManager.getPolicies();
  res.json(policies);
});

apiRouter.post('/policies', (req: Request, res: Response) => {
  const policy = req.body;
  if (!policy.title || !policy.institution) {
    return res.status(400).json({ error: 'Title and institution required' });
  }
  if (!policy.id) {
    policy.id = `policy-${Date.now()}`;
  }
  const saved = StorageManager.savePolicy(policy);
  res.json(saved);
});

// 4. Research
apiRouter.get('/research', (_req: Request, res: Response) => {
  const research = StorageManager.getResearch();
  res.json(research);
});

apiRouter.post('/research', (req: Request, res: Response) => {
  const paper = req.body;
  if (!paper.title || !paper.institution) {
    return res.status(400).json({ error: 'Title and institution required' });
  }
  if (!paper.id) {
    paper.id = `research-${Date.now()}`;
  }
  const saved = StorageManager.saveResearchPaper(paper);
  res.json(saved);
});

// 5. Indicators
apiRouter.get('/indicators', (_req: Request, res: Response) => {
  const indicators = StorageManager.getIndicators();
  res.json(indicators);
});

// 6. Connections
apiRouter.get('/connections', (_req: Request, res: Response) => {
  const connections = StorageManager.getConnections();
  const stories = StorageManager.getStories();
  const policies = StorageManager.getPolicies();
  const research = StorageManager.getResearch();

  res.json({
    connections,
    nodes: [
      ...stories.map((s) => ({
        id: s.id,
        label: s.headline,
        type: 'story',
        jurisdiction: s.jurisdiction,
        date: s.publicationDate
      })),
      ...policies.map((p) => ({
        id: p.id,
        label: p.title,
        type: 'policy',
        jurisdiction: p.jurisdiction,
        date: p.announcementDate
      })),
      ...research.map((r) => ({
        id: r.id,
        label: r.title,
        type: 'research',
        institution: r.institution,
        date: r.publicationDate
      })),
      {
        id: 'hist-repo-spike-2019',
        label: 'September 2019 Repo Market Spike',
        type: 'historical',
        date: '2019-09-17'
      },
      {
        id: 'hist-swap-lines-2008',
        label: '2008 Global Financial Crisis Dollar Funding Freeze',
        type: 'historical',
        date: '2008-09-15'
      }
    ]
  });
});

// 7. Sources
apiRouter.get('/sources', (_req: Request, res: Response) => {
  const sources = StorageManager.getSources();
  res.json(sources);
});

apiRouter.post('/sources', (req: Request, res: Response) => {
  const source = req.body;
  if (!source.name || !source.url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }
  if (!source.id) {
    source.id = `source-${Date.now()}`;
  }
  const saved = StorageManager.saveSource(source);
  res.json(saved);
});

apiRouter.delete('/sources/:id', (req: Request, res: Response) => {
  const success = StorageManager.deleteSource(req.params.id);
  res.json({ success });
});

// 8. Pipeline Control
apiRouter.get('/pipeline/status', (_req: Request, res: Response) => {
  const status = StorageManager.getPipelineStatus();
  res.json(status);
});

let isPipelineRunning = false;
apiRouter.post('/pipeline/run', async (_req: Request, res: Response) => {
  if (isPipelineRunning) {
    return res.status(409).json({ message: 'Pipeline is already running' });
  }
  isPipelineRunning = true;

  try {
    const finalStatus = await PipelineRunner.run();
    res.json({ message: 'Pipeline execution completed', status: finalStatus });
  } catch (err) {
    console.error('Pipeline runner error:', err);
    res.status(500).json({ error: 'Pipeline execution failed', details: (err as Error).message });
  } finally {
    isPipelineRunning = false;
  }
});

// Mount the API router at '/api'
app.use('/api', apiRouter);

export default app;
