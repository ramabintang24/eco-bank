import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { LogService } from './log.service';
import { ErrorLog } from './entities/error-log.entity';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const { user } = request;

    const errorLog: ErrorLog = {
      path: request.url.split('?')[0],
      app: 'auth',
      method: request.method,
      query: request.query,
      ip: request.ip,
      id_user: user?.user_id,
      headers: request.headers,
      body: request.body,
      responseTime: 0,
      errorMessage: message,
      errorStack: exception instanceof Error ? exception.stack : '',
      id: 0,
    };

    console.log(exception);

    this.logService
      .createErrorLog(errorLog)
      .then(() => {
        return this.logService.createErrorLog(errorLog);
      })
      .catch((error) => {
        console.error('Failed to log error:', error);
      });

    const responseBody: any = {
      statusCode: status,
      message: message,
      fulfilled: 0,
    };

    if (process.env.IS_DEBUG === 'true') {
      responseBody.debug_error = errorLog.errorStack;
    }

    if (exception instanceof BadRequestException) {
      const responseMessage = (exception.getResponse() as any).message;
      responseBody.message = responseMessage;
    }

    response.status(status).json(responseBody);
  }
}
