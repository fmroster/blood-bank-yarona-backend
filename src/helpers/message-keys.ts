export type ObjectValues<T> = T[keyof T];
export const ERROR_KEY = {
  VALIDATION_ERROR: 'errors.ValidationError',
  NOT_FOUND_ERROR: 'errors.NotFound',
  CONFLICT: 'errors.Conflict',
  EXTERNAL_API_ERROR: 'errors.ExternalApiError',
  INTERNAL_SERVER_ERROR: 'errors.InternalServerError',
  INVALID_CREDENTIALS: 'errors.InvalidCredentials',
  TOO_MANY_ATTEMPTS: 'errors.TooManyAttempts',
  UNPROCESSABLE_ENTITY: 'errors.UnprocessableEntity',
  OPERATION_NOT_ALLOWED: 'errors.OperationNotAllowed',
  TOO_MANY_REQUESTS: 'errors.TooManyRequests'
} as const;

export type ErrorKey = ObjectValues<typeof ERROR_KEY>;
