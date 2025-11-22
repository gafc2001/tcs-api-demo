import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InvalidPremiumProductAmountException } from '../../../domain/exceptions/InvalidPremiumProductAmountException';

interface ExceptionConfig {
  exception: new (...args: any[]) => Error;
  statusCode: number | ((exception: Error) => number);
  message: string | string[] | ((exception: Error) => string | string[]);
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(GlobalExceptionFilter.name);

  private readonly exceptionConfigs: ExceptionConfig[] = [
    {
      exception: HttpException,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    },
    {
      exception: InvalidPremiumProductAmountException,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid premium product amount',
    },
  ];

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    const config = this.exceptionConfigs.find((config) =>
      exception instanceof config.exception,
    );

    const errorResponse = {
      statusCode: config?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: config?.message || 'Internal server error',
      error: exception instanceof Error ? exception.message : 'Internal server error',
    };

    response.status(Number(errorResponse.statusCode)).json(errorResponse);
  }
}
