#!/usr/bin/env node
/**
 * TypeORM Migration CLI Wrapper
 * 
 * This wrapper script handles argument parsing for TypeORM migration commands
 * and ensures proper path resolution in the Nx monorepo context.
 * 
 * Usage:
 *   tsx apps/api/scripts/migration-wrapper.ts create --name=MigrationName
 *   tsx apps/api/scripts/migration-wrapper.ts generate --name=MigrationName
 *   tsx apps/api/scripts/migration-wrapper.ts run
 *   tsx apps/api/scripts/migration-wrapper.ts revert
 */

// Import reflect-metadata FIRST - it must be loaded before any TypeORM decorators
import 'reflect-metadata';

import { spawn } from 'child_process';
import * as path from 'path';

// Parse arguments
// Skip node executable and script path (which may be ts-node wrapper or the script itself)
const allArgs = process.argv.slice(1); // Skip node executable
// Find the first argument that is a known command (not a file path)
const knownCommands = ['create', 'generate', 'run', 'revert'];
const commandIndex = allArgs.findIndex((arg) => knownCommands.includes(arg));
const command = commandIndex >= 0 ? allArgs[commandIndex] : null;
const args = allArgs.slice(commandIndex + 1); // Arguments after the command

// Paths relative to workspace root - scripts run from apps/api/scripts
const migrationPath = path.join(__dirname, '..', 'src', 'migrations');
const dataSourcePath = path.join(__dirname, '..', 'src', 'config', 'data-source.ts');

// Parse --name argument from remaining args
const nameArg = args.find((arg) => arg.startsWith('--name='));
const migrationName = nameArg ? nameArg.split('=')[1] : null;

if (!command) {
  console.error('Usage: tsx migration-wrapper.ts <command> [--name=<name>]');
  console.error('Commands: create, generate, run, revert');
  process.exit(1);
}

// For 'run', use DataSource directly - it's more reliable
// Use dynamic import to ensure reflect-metadata is ready before loading entities
if (command === 'run') {
  async function runMigrationCommand() {
    // Dynamically import dataSource after reflect-metadata is set up
    const { default: dataSource } = await import('../src/config/data-source');
    
    try {
      await dataSource.initialize();
      console.log('✅ DataSource initialized');

      const migrations = await dataSource.runMigrations();
      if (migrations.length === 0) {
        console.log('✅ No pending migrations');
      } else {
        console.log(`✅ Ran ${migrations.length} migration(s):`);
        migrations.forEach((migration) => {
          console.log(`   - ${migration.name}`);
        });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    } finally {
      await dataSource.destroy();
    }
  }

  runMigrationCommand();
} else {
  // For 'create', 'generate', and 'revert', use TypeORM CLI
  let typeormArgs: string[] = [];

  switch (command) {
    case 'revert':
      typeormArgs = ['migration:revert', '-d', dataSourcePath];
      break;

    case 'create':
      if (!migrationName) {
        console.error('❌ Migration name is required. Use --name=<name>');
        console.error('Example: tsx migration-wrapper.ts create --name=AddUsersTable');
        process.exit(1);
      }
      typeormArgs = [
        'migration:create',
        path.join(migrationPath, migrationName),
      ];
      break;

    case 'generate':
      if (!migrationName) {
        console.error('❌ Migration name is required. Use --name=<name>');
        console.error('Example: tsx migration-wrapper.ts generate --name=AddUsersTable');
        process.exit(1);
      }
      typeormArgs = [
        'migration:generate',
        path.join(migrationPath, migrationName),
        '-d',
        dataSourcePath,
      ];
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.error('Commands: create, generate, run, revert');
      process.exit(1);
  }

  const typeormCli = path.resolve(process.cwd(), 'node_modules/typeorm/cli.js');
  // Use ts-node to run TypeORM CLI with TypeScript support
  // ts-node with tsconfig-paths handles path resolution and decorators correctly
  const proc = spawn(
    'pnpm',
    ['exec', 'ts-node', '--project', 'apps/api/tsconfig.migration.json', '-r', 'tsconfig-paths/register', typeormCli, ...typeormArgs],
    {
      stdio: 'inherit',
      shell: true,
      env: process.env,
      cwd: process.cwd(),
    },
  );

  proc.on('exit', (code) => {
    process.exit(code || 0);
  });

  proc.on('error', (error) => {
    console.error('❌ Error running TypeORM CLI:', error);
    process.exit(1);
  });
}

