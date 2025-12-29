/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 8000;
  
  try {
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
  } catch (error: any) {
    if (error.code === 'EADDRINUSE') {
      Logger.error(
        `❌ Port ${port} is already in use. Please stop the process using that port or set a different PORT in your .env file.`,
      );
      Logger.error(
        `   On Windows, run: Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process -Force`,
      );
      process.exit(1);
    }
    throw error;
  }
}

bootstrap();
