import process from 'node:process';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { ofetch } from 'ofetch';
import { consola } from 'consola';

/** Sync npmmirror Options */
export interface SyncOptions {
  /** The project root directory */
  cwd: string;
  /** Show log of sync npmmirror */
  log: boolean;
  /**
   * Timeout of sync npmmirror
   *
   * @default 1000 * 60 (ms)
   */
  timeout: number;
}

/**
 * Sync npmmirror
 *
 * @param pkgName Package name, id has multiple packages, you can use ',' to separate them.
 * @param options Sync npmmirror options
 */
export async function sync(pkgName?: string | string[] | boolean, options?: Partial<SyncOptions>) {
  const { cwd, log, timeout } = createSyncOptions(options);

  if (!pkgName || pkgName === true) {
    const pkgJson = await readFile(path.join(cwd, 'package.json'), 'utf8');

    try {
      const pkg = JSON.parse(pkgJson);

      await syncNpmmirror(pkg.name, { log, timeout });
    } catch (error) {}

    return;
  }

  const names: string[] = [];

  if (Array.isArray(pkgName)) {
    names.push(...pkgName);
  } else {
    names.push(...pkgName.split(','));
  }

  const formatNames = names.filter(Boolean).map(item => item.trim());

  const pkgNames = [...new Set(formatNames)];

  for await (const name of pkgNames) {
    await syncNpmmirror(name, { log, timeout });
  }
}

/**
 * Create sync npmmirror options
 *
 * @param options
 */
function createSyncOptions(options?: Partial<SyncOptions>): SyncOptions {
  const { cwd = process.cwd(), log = true, timeout = 1000 * 60 } = options || {};

  return { cwd, log, timeout };
}

/**
 * Sync npmmirror action
 *
 * @param pkgName Package name. Defaults to package name in package.json
 * @param options Sync npmmirror options
 */
async function syncNpmmirror(pkgName: string, options: Pick<SyncOptions, 'log' | 'timeout'>) {
  const { log, timeout } = options;

  consola.start(`Sync ${pkgName}...`);

  const url = `https://registry-direct.npmmirror.com/${pkgName}/sync?sync_upstream=true`;

  const { logId = '' } = await ofetch<{ logId: string }>(url, { method: 'PUT' });

  if (!logId) return;

  const logUrl = `https://registry.npmmirror.com/-/package/${pkgName}/syncs/${logId}/log`;

  const SUCCESS_LOG = `Sync ${pkgName} success`;

  const now = Date.now();

  let syncLog = '';

  let intervalId: NodeJS.Timeout | null = setInterval(async () => {
    try {
      syncLog = await ofetch<string>(logUrl, { method: 'GET' });

      if (log) {
        consola.log(syncLog);
      }

      const isTimeout = Date.now() - now > timeout;

      if (intervalId && (syncLog.includes(SUCCESS_LOG) || isTimeout)) {
        clearInterval(intervalId);
        intervalId = null;

        if (isTimeout) {
          consola.error(`Sync ${pkgName} timeout`);
        } else {
          consola.success(`Sync ${pkgName} success`);
        }
      }
    } catch {}
  }, 2000);
}
