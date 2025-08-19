#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';
import fs from 'fs';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Check for .env file and load if it exists
const envPath = resolve(rootDir, '.env');
if (fs.existsSync(envPath)) {
  config({ path: envPath });
  console.log('Loaded environment variables from .env file');
} else {
  console.log('No .env file found. Using existing environment variables.');
}

// Check for required environment variable
const userSid = process.env.PATHWAVE_USER_SID;

if (!userSid || userSid.trim() === '') {
  console.error('\x1b[31m%s\x1b[0m', 'Error: PATHWAVE_USER_SID environment variable is not set.');
  console.error('\x1b[33m%s\x1b[0m', 'This environment variable is required to use the Pathwave.io SDK.');
  console.error('\x1b[33m%s\x1b[0m', 'Please set it in your environment or create a .env file with:');
  console.error('\x1b[36m%s\x1b[0m', 'PATHWAVE_USER_SID=your_user_sid_here');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✓ PATHWAVE_USER_SID is set');
console.log('\x1b[32m%s\x1b[0m', 'Environment validation completed successfully');
process.exit(0);