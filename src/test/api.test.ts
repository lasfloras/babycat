import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from '../server/app.ts';

let server: http.Server;
let baseUrl: string;

test.before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        baseUrl = `http://127.0.0.1:${addr.port}`;
      }
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

async function requestJson(path: string, options?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, options);
  const json = await res.json();
  return { status: res.status, headers: res.headers, json };
}

test('GET /api/briefings returns valid array of daily briefings', async () => {
  const { status, json } = await requestJson('/api/briefings');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json));
  assert.ok(json.length > 0);
  assert.ok(json[0].editionDate);
  assert.ok(json[0].executiveSummary);
});

test('GET /api/briefings/latest returns current daily briefing', async () => {
  const { status, json } = await requestJson('/api/briefings/latest');
  assert.equal(status, 200);
  assert.ok(json.editionDate);
  assert.ok(json.leadStoryId);
  assert.ok(json.environmentOverview);
});

test('GET /api/stories returns stories and supports filtering', async () => {
  const { status, json } = await requestJson('/api/stories');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json));
  assert.ok(json.length > 0);
  assert.ok(json[0].headline);
  assert.ok(json[0].classification);
  assert.ok(json[0].theoreticalFrameworks);

  // Test filter
  const filtered = await requestJson('/api/stories?jurisdiction=Eurozone');
  assert.equal(filtered.status, 200);
  assert.ok(Array.isArray(filtered.json));
  assert.ok(filtered.json.every((s: any) => s.jurisdiction === 'Eurozone'));
});

test('GET /api/policies returns institutional policy announcements', async () => {
  const { status, json } = await requestJson('/api/policies');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json));
  assert.ok(json.length > 0);
  assert.ok(json[0].title);
  assert.ok(json[0].institution);
});

test('GET /api/research returns academic literature and working papers', async () => {
  const { status, json } = await requestJson('/api/research');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json));
  assert.ok(json.length > 0);
  assert.ok(json[0].title);
  assert.ok(json[0].authors);
  assert.ok(json[0].mainFindings);
});

test('GET /api/indicators returns benchmark macroeconomic indicators', async () => {
  const { status, json } = await requestJson('/api/indicators');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json));
  assert.ok(json.length > 0);
  assert.ok(json[0].name);
  assert.ok(json[0].latestObservation !== undefined);
});

test('GET /api/connections returns relationship graph with nodes and links', async () => {
  const { status, json } = await requestJson('/api/connections');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json.connections));
  assert.ok(Array.isArray(json.nodes));
  assert.ok(json.connections.length > 0);
  assert.ok(json.nodes.length > 0);
});

test('GET /api/sources returns configured institutional feeds', async () => {
  const { status, json } = await requestJson('/api/sources');
  assert.equal(status, 200);
  assert.ok(Array.isArray(json));
  assert.ok(json.length > 0);
  assert.ok(json.some((s: any) => s.institution.includes('Federal Reserve')));
});

test('GET /api/pipeline/status returns pipeline execution telemetry', async () => {
  const { status, json } = await requestJson('/api/pipeline/status');
  assert.equal(status, 200);
  assert.ok(json.status);
  assert.ok(Array.isArray(json.logs));
});

test('GET /api/health and /api root info respond correctly', async () => {
  const health = await requestJson('/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.json.status, 'healthy');

  const root = await requestJson('/api');
  assert.equal(root.status, 200);
  assert.equal(root.json.status, 'online');
});
