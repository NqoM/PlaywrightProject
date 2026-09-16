import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export interface CapturedRequest {
  url: string;
  method: string;
  resourceType: string;
}

const OUTPUT_DIR = path.join(process.cwd(), 'test-results');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'discovered-endpoints.json');

export function recordNetworkRequests(page: Page): CapturedRequest[] {
  const captured: CapturedRequest[] = [];

  page.on('request', (request) => {
    const type = request.resourceType();
    if (type === 'xhr' || type === 'fetch') {
      captured.push({
        url: request.url(),
        method: request.method(),
        resourceType: type,
      });
    }
  });

  return captured;
}

export function saveDiscoveredEndpoints(requests: CapturedRequest[]) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const unique = Array.from(
    new Map(requests.map((r) => [`${r.method} ${r.url}`, r])).values()
  );

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2));
}

export function loadDiscoveredEndpoints(): CapturedRequest[] {
  if (!fs.existsSync(OUTPUT_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
}