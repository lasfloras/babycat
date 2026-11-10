import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { StorageManager } from './src/server/storage/index.ts';
import { PipelineRunner } from './src/server/pipeline/pipelineRunner.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes

// 1. Briefings
app.get('/api/briefings', (_req, res) => {
  const briefings = StorageManager.getBriefings();
  res.json(briefings);
});

app.get('/api/briefings/latest', (_req, res) => {
  const latest = StorageManager.getLatestBriefing();
  res.json(latest);
});

app.get('/api/briefings/:date', (req, res) => {
  const briefing = StorageManager.getBriefingByDate(req.params.date);
  if (!briefing) {
    return res.status(404).json({ error: 'Briefing not found for date' });
  }
  res.json(briefing);
});

// 2. Stories
app.get('/api/stories', (req, res) => {
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

app.get('/api/stories/:id', (req, res) => {
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
app.get('/api/policies', (_req, res) => {
  const policies = StorageManager.getPolicies();
  res.json(policies);
});

app.post('/api/policies', (req, res) => {
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
app.get('/api/research', (_req, res) => {
  const research = StorageManager.getResearch();
  res.json(research);
});

app.post('/api/research', (req, res) => {
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
app.get('/api/indicators', (_req, res) => {
  const indicators = StorageManager.getIndicators();
  res.json(indicators);
});

// 6. Connections
app.get('/api/connections', (_req, res) => {
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
app.get('/api/sources', (_req, res) => {
  const sources = StorageManager.getSources();
  res.json(sources);
});

app.post('/api/sources', (req, res) => {
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

app.delete('/api/sources/:id', (req, res) => {
  const success = StorageManager.deleteSource(req.params.id);
  res.json({ success });
});

// 8. Pipeline Control
app.get('/api/pipeline/status', (_req, res) => {
  const status = StorageManager.getPipelineStatus();
  res.json(status);
});

let isPipelineRunning = false;
app.post('/api/pipeline/run', async (_req, res) => {
  if (isPipelineRunning) {
    return res.status(409).json({ message: 'Pipeline is already running' });
  }
  isPipelineRunning = true;
  // Respond immediately, execution runs asynchronously
  res.json({ message: 'Pipeline execution initiated' });

  try {
    await PipelineRunner.run();
  } catch (err) {
    console.error('Async pipeline runner error:', err);
  } finally {
    isPipelineRunning = false;
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Economic Observatory] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
