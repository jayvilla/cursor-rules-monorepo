/**
 * TypeORM CLI wrapper for migrations
 * Usage: ts-node migration-cli.ts <command> [args...]
 */
import { spawn } from 'child_process';
import * as path from 'path';

const command = process.argv[2];
const migrationName = process.argv[3];

if (!command) {
  console.error('Usage: ts-node migration-cli.ts <command> [migration-name]');
  console.error('Commands: generate, run, revert');
  process.exit(1);
}

const dataSourcePath = path.resolve(__dirname, 'data-source.ts');
const migrationsPath = path.resolve(__dirname, 'migrations');

let typeormArgs: string[] = [];

switch (command) {
  case 'generate':
    if (!migrationName) {
      console.error('Migration name is required for generate command');
      console.error('Usage: ts-node migration-cli.ts generate <migration-name>');
      process.exit(1);
    }
    typeormArgs = [
      'migration:generate',
      path.join(migrationsPath, migrationName),
      '-d',
      dataSourcePath,
    ];
    break;
  case 'run':
    typeormArgs = ['migration:run', '-d', dataSourcePath];
    break;
  case 'revert':
    typeormArgs = ['migration:revert', '-d', dataSourcePath];
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}

const typeormCli = path.resolve(process.cwd(), 'node_modules/typeorm/cli.js');
const proc = spawn('ts-node', [typeormCli, ...typeormArgs], {
  stdio: 'inherit',
  shell: true,
});

proc.on('exit', (code) => {
  process.exit(code || 0);
});

