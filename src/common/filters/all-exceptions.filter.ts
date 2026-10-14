import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const { status, message } = this.getError(exception);

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: message,
    });
  }

  private getError(exception: unknown): {
    status: number;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        return { status: exception.getStatus(), message: exceptionResponse };
      }

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        (typeof exceptionResponse.message === 'string' ||
          Array.isArray(exceptionResponse.message))
      ) {
        return {
          status: exception.getStatus(),
          message: exceptionResponse.message,
        };
      }

      return {
        status: exception.getStatus(),
        message: 'Erro ao processar a requisição.',
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return {
            status: HttpStatus.CONFLICT,
            message: 'Já existe um registro com os dados informados.',
          };
        case 'P2003':
          return {
            status: HttpStatus.CONFLICT,
            message: 'A operação viola uma restrição de integridade.',
          };
        case 'P2025':
          return {
            status: HttpStatus.NOT_FOUND,
            message: 'Registro não encontrado.',
          };
        default:
          break;
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
