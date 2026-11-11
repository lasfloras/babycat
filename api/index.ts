import type { IncomingMessage, ServerResponse } from 'node:http';
import app from '../src/server/app.ts';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  // Normalize path if serverless router stripped the /api prefix
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req as any, res as any);
}
