import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../loggers/winston.logger';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception["response"]["message"] || exception.message ||'Something went wrong';

    if (status >= 500) {
      this.logger.error(`logger[${request.method}] ${request.url} - ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}