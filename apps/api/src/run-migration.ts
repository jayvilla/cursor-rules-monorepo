import 'reflect-metadata';
import dataSource from './data-source';

async function runMigrations() {
  try {
    await dataSource.initialize();
    console.log('✅ DataSource initialized');

    const migrations = await dataSource.runMigrations();
    console.log(`✅ Ran ${migrations.length} migration(s)`);
    migrations.forEach((migration) => {
      console.log(`   - ${migration.name}`);
    });
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runMigrations();

