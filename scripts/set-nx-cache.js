#!/usr/bin/env node
/**
 * Sets NX_CACHE_DIRECTORY to temp directory to avoid Windows permission errors
 * If that doesn't work, falls back to disabling cache entirely
 * then runs the remaining command arguments
 */
const os = require('os');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Try using temp directory first to avoid Windows permission issues
const cacheDir = path.join(os.tmpdir(), '.nx-cache');

// Ensure cache directory exists
try {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
} catch (error) {
  // If we can't create cache directory, skip caching
  process.env.NX_SKIP_NX_CACHE = 'true';
}

// Set environment variables
const env = {
  ...process.env,
  NX_CACHE_DIRECTORY: cacheDir,
};

// Get remaining arguments (everything after the script name)
const args = process.argv.slice(2);

// Spawn pnpm with the remaining arguments
const child = spawn('pnpm', args, {
  stdio: 'inherit',
  shell: true,
  env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

