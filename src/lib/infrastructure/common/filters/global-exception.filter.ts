import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InvalidPremiumProductAmountException } from '../../../domain/exceptions/InvalidPremiumProductAmountException';
import { ValidationError } from 'class-validator';

interface ExceptionConfig {
  exception: new (...args: any[]) => Error;
  statusCode: number | ((exception: Error) => number);
  message: string | string[] | ((exception: Error) => string | string[]);
}

interface ValidationErrorDetail {
  property: string;
  value?: any;
  constraints?: { [type: string]: string };
  children?: ValidationErrorDetail[];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

  private readonly exceptionConfigs: ExceptionConfig[] = [
    {
      exception: InvalidPremiumProductAmountException,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid premium product amount',
    },
    {
      exception: BadRequestException,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation error',
    },
    {
      exception: HttpException,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    },
  ];

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionConfig = this.findExceptionConfig(exception);
    const validationDetails = this.extractValidationDetails(exception);
    const statusCode = this.getStatusCode(exception, exceptionConfig);
    const message = this.getMessage(exception, exceptionConfig);

    const errorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: this.getErrorMessage(exception),
      ...(validationDetails && validationDetails.length > 0 && { errors: validationDetails }),
    };

    response.status(statusCode).json(errorResponse);
  }

  private findExceptionConfig(exception: unknown): ExceptionConfig | undefined {
    return this.exceptionConfigs.find((config) =>
      exception instanceof config.exception,
    );
  }

  private extractValidationDetails(
    exception: unknown,
  ): ValidationErrorDetail[] | undefined {
    if (!(exception instanceof BadRequestException)) {
      return undefined;
    }

    const exceptionResponse = exception.getResponse();
    
    if (!this.isValidationErrorResponse(exceptionResponse)) {
      return undefined;
    }

    return this.formatValidationErrors(
      exceptionResponse.message as ValidationError[],
    );
  }

  private isValidationErrorResponse(
    response: unknown,
  ): response is { message: ValidationError[] } {
    return (
      typeof response === 'object' &&
      response !== null &&
      'message' in response &&
      Array.isArray(response.message) &&
      response.message.length > 0 &&
      typeof response.message[0] === 'object' &&
      'property' in response.message[0]
    );
  }

  private getStatusCode(
    exception: unknown,
    config: ExceptionConfig | undefined,
  ): number {
    if (exception instanceof BadRequestException) {
      return HttpStatus.BAD_REQUEST;
    }

    if (config) {
      return typeof config.statusCode === 'function'
        ? config.statusCode(exception as Error)
        : config.statusCode;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(
    exception: unknown,
    config: ExceptionConfig | undefined,
  ): string | string[] {
    if (config) {
      return typeof config.message === 'function'
        ? config.message(exception as Error)
        : config.message;
    }

    return 'Internal server error';
  }

  private getErrorMessage(exception: unknown): string {
    return exception instanceof Error
      ? exception.message
      : 'Internal server error';
  }

  private formatValidationErrors(
    errors: ValidationError[],
  ): ValidationErrorDetail[] {
    return errors.map((error) => {
      const detail: ValidationErrorDetail = {
        property: error.property,
      };

      if (error.value !== undefined) {
        detail.value = error.value;
      }

      if (error.constraints && Object.keys(error.constraints).length > 0) {
        detail.constraints = error.constraints;
      }

      if (error.children && error.children.length > 0) {
        detail.children = this.formatValidationErrors(error.children);
      }

      return detail;
    });
  }
}
