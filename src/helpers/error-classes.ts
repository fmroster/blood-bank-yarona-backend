import { HttpStatusCode } from 'axios';
import { ERROR_KEY, ErrorKey } from './message-keys';

/**
 * Base error for our custom error types
 */
export class BaseError extends Error {
  statusCode: number;

  constructor(
    message: string | ErrorKey = 'An error occurred',
    statusCode: number = HttpStatusCode.InternalServerError
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Generic error for non-specific error handling
 */
export class GenericError extends BaseError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

/**
 * Used when an object is not found in the database
 */
export class NotFoundError extends BaseError {
  constructor(message: string = ERROR_KEY.NOT_FOUND_ERROR) {
    super(message, HttpStatusCode.NotFound);
  }
}
export class OperationNotAllowed extends BaseError {
  constructor(message: string = ERROR_KEY.OPERATION_NOT_ALLOWED) {
    super(message, HttpStatusCode.Forbidden);
  }
}

/**
 * Error when there is a custom conflict error handler
 */
export class ConflictError extends BaseError {
  constructor(message: string = ERROR_KEY.CONFLICT, statusCode: number = HttpStatusCode.Conflict) {
    super(message, statusCode);
  }
}

/**
 * Error when there is a custom database error handler that's not a conflict error
 */
export class DatabaseError extends BaseError {
  constructor(message: string = ERROR_KEY.UNPROCESSABLE_ENTITY) {
    super(message, HttpStatusCode.UnprocessableEntity);
  }
}
