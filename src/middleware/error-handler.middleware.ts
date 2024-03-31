import { NextFunction, Request, Response } from 'express';
import { BaseError } from '../helpers/error-classes';
import { ZodError } from 'zod';
import { AxiosError, HttpStatusCode } from 'axios';
import { ERROR_KEY } from '../helpers/message-keys';
import { fromZodError, ValidationError } from 'zod-validation-error';
import { errorResponse } from '../helpers/functions';
import { Error as MongooseError } from 'mongoose';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // handle custom errors
  if (error instanceof BaseError) {
    const err: BaseError = error as BaseError;
    return errorResponse(res, err.statusCode, err.message);
  }

  // handle zod errors
  if (error instanceof ZodError) {
    const err: ValidationError = fromZodError(error as ZodError);
    return errorResponse(res, HttpStatusCode.BadRequest, ERROR_KEY.VALIDATION_ERROR, err.details);
  }

  // handle axios errors
  if (error instanceof AxiosError) {
    return errorResponse(res, HttpStatusCode.FailedDependency, ERROR_KEY.EXTERNAL_API_ERROR);
  }

  // handle mongoose errors
  if (error instanceof MongooseError) {
    const mongooseErrors = Object.values(error).map((mongooseError) => mongooseError.message);
    return errorResponse(res, HttpStatusCode.BadRequest, 'Database error occurred', mongooseErrors);
  }

  // handle unknown error
  return errorResponse(res, HttpStatusCode.InternalServerError, 'A logical error occurred.');
};
