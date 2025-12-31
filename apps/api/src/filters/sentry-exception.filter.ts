import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Capture exception in Sentry (only for non-4xx errors or if explicitly needed)
    if (status >= 500 || !(exception instanceof HttpException)) {
      Sentry.captureException(exception, {
        contexts: {
          request: {
            method: request.method,
            url: request.url,
            headers: {
              // Don't include sensitive headers
              'user-agent': request.headers['user-agent'],
            },
          },
        },
        tags: {
          statusCode: status.toString(),
        },
      });
    }

    // Let NestJS handle the response normally
    // This filter only captures to Sentry, doesn't modify response
    if (exception instanceof HttpException) {
      response.status(status).json(exception.getResponse());
    } else {
      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
      });
    }
  }
}

