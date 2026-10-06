#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from './lib/run.js';

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

runCli({ argv: process.argv, cliRoot }).catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
