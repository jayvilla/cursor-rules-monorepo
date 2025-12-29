import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

/**
 * Seed script for populating initial database data.
 * Run with: pnpm nx run api:seed
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get<DataSource>(getDataSourceToken());

  try {
    // Add your seeding logic here
    console.log('🌱 Starting database seed...');

    // Example seed logic:
    // const userRepository = dataSource.getRepository(UserEntity);
    // await userRepository.save({
    //   name: 'Admin',
    //   email: 'admin@example.com',
    // });

    console.log('✅ Database seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
    await dataSource.destroy();
  }
}

bootstrap();

