#!/usr/bin/env node
import process from 'node:process';
import cac from 'cac';
import { consola } from 'consola';
import { dim, red } from 'kolorist';
import { name, version } from '../package.json';
import { sync } from '.';

function setupCli() {
  const cli = cac(name);

  cli
    .version(version)
    .option('-s, --syncName [name]', 'Package name, id has multiple packages, you can use "," to separate them.')
    .option('-l, --log', 'Show log of sync npmmirror')
    .option('-t, --timeout [timeout]', 'Timeout of sync npmmirror', { default: 1000 * 60 })
    .help();

  cli.command('').action(async (args: any) => {
    try {
      const cwd = process.cwd();
      const { syncName, log, timeout } = args;
      await sync(syncName, { cwd, log, timeout });
    } catch (e: any) {
      consola.error(red(String(e)));
      if (e?.stack) {
        consola.error(dim(e.stack?.split('\n').slice(1).join('\n')));
      }

      process.exit(1);
    }
  });

  cli.parse();
}

setupCli();
