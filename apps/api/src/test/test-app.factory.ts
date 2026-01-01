/**
 * Phase 0 Test App Factory
 * 
 * Creates a NestJS application instance for testing.
 * Uses the test database from setup.ts.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { AppModule } from '../app/app.module';
import { getTestDataSource } from './setup';
// Use require for CommonJS modules
// eslint-disable-next-line @typescript-eslint/no-var-requires
const session = require('express-session');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const connectPgSimple = require('connect-pg-simple');
const PgSession = connectPgSimple(session);

/**
 * Create a test NestJS application
 * 
 * - Boots the app in test mode
 * - Uses test database from Testcontainers
 * - Disables non-essential background jobs
 * - Returns app + httpServer
 */
export async function createTestApp(): Promise<INestApplication> {
  const testDataSource = await getTestDataSource();
  
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
        ignoreEnvFile: true, // Use programmatic config
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: () => ({
          type: 'postgres',
          host: testDataSource.options.host,
          port: testDataSource.options.port,
          username: testDataSource.options.username,
          password: testDataSource.options.password,
          database: testDataSource.options.database,
          entities: testDataSource.options.entities,
          synchronize: false,
          logging: false,
          ssl: false,
          extra: {
            max: 1,
            min: 1,
            idleTimeoutMillis: 0,
          },
        }),
      }),
      AppModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const configService = app.get(ConfigService);

  // Configure cookie parser (must be before session)
  app.use(cookieParser());

  // Configure CORS
  app.enableCors({
    origin: configService.get<string>('WEB_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-api-key'],
  });

  // Configure express-session with PostgreSQL store
  const sessionSecret = configService.get<string>('SESSION_SECRET', 'test-secret');
  
  app.use(
    session({
      store: new PgSession({
        conObject: {
          host: testDataSource.options.host,
          port: testDataSource.options.port,
          user: testDataSource.options.username as string,
          password: testDataSource.options.password as string,
          database: testDataSource.options.database as string,
          ssl: false,
        },
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // Tests run over HTTP
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
      name: 'sessionId',
    }),
  );

  // Enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global prefix to match main app
  app.setGlobalPrefix('api');

  await app.init();

  return app;
}

/**
 * Get a Supertest agent for making HTTP requests
 */
export function getTestAgent(app: INestApplication) {
  return request.agent(app.getHttpServer());
}

