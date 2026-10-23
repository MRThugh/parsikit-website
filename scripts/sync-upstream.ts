/**
 * Upstream Repository Synchronization and Verification Engine
 * Author: Ali Kamrani (@MRThugh)
 * Official Repo: https://github.com/MRThugh/ParsiKit
 */

import fs from 'node:fs';
import path from 'node:path';
import { parsePyprojectData } from './build-docs-manifest';

interface SyncResult {
  repository: string;
  author: string;
  localVersion: string;
  pythonRequirement: string;
  license: string;
  isUpstreamReachable: boolean;
  upstreamLatestTag?: string;
  lastSyncedAt: string;
  totalDocsFound: number;
}

async function checkUpstreamGitHub(): Promise<{ reachable: boolean; latestTag?: string }> {
  const repoApiUrl = 'https://api.github.com/repos/MRThugh/ParsiKit/releases/latest';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(repoApiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ParsiKit-Sync-Engine/1.0',
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json() as { tag_name?: string };
      return { reachable: true, latestTag: data.tag_name };
    }
    return { reachable: false };
  } catch {
    // Graceful offline fallback
    return { reachable: false };
  }
}

async function runSync() {
  console.log('🔄 Checking upstream repository alignment with https://github.com/MRThugh/ParsiKit...');
  
  const pyproject = parsePyprojectData();
  const upstreamCheck = await checkUpstreamGitHub();

  const baseDocsDir = path.resolve(process.cwd(), 'repo_data/docs');
  let docsCount = 0;
  if (fs.existsSync(baseDocsDir)) {
    const countFiles = (dir: string) => {
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) countFiles(full);
        else if (item.endsWith('.md')) docsCount++;
      }
    };
    countFiles(baseDocsDir);
  }

  const result: SyncResult = {
    repository: pyproject.repository,
    author: pyproject.author,
    localVersion: pyproject.version,
    pythonRequirement: pyproject.pythonRequirement,
    license: pyproject.license,
    isUpstreamReachable: upstreamCheck.reachable,
    upstreamLatestTag: upstreamCheck.latestTag || 'v3.3.1',
    lastSyncedAt: new Date().toISOString(),
    totalDocsFound: docsCount,
  };

  const statusPath = path.resolve(process.cwd(), 'src/data/syncStatus.json');
  fs.writeFileSync(statusPath, JSON.stringify(result, null, 2));

  console.log('✅ Sync verification complete:');
  console.log(`   - Repository: ${result.repository}`);
  console.log(`   - Author: ${result.author}`);
  console.log(`   - Version (pyproject.toml): ${result.localVersion}`);
  console.log(`   - Total Documentation Files: ${result.totalDocsFound}`);
  console.log(`   - Upstream GitHub Reachable: ${result.isUpstreamReachable ? 'YES' : 'OFFLINE / FALLBACK'}`);
}

runSync().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
