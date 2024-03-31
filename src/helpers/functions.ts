import { HttpStatusCode } from 'axios';
import { IErrorResponse, IStdResponse } from '../interfaces/function.interfaces';
import { Response } from 'express';
import { ErrorKey } from './message-keys';

export const createStdResponse = (success: boolean, status: number, message: string, data?: any): IStdResponse => {
  //returns an object of StdResponse
  return {
    success: success,
    status: status,
    message: message,
    data: data
  };
};

export const successResponse = (
  response: Response,
  status: HttpStatusCode,
  message: string,
  data?: [] | object
): Response => {
  return response.status(status).json(createStdResponse(true, status, message, data));
};

export const createErrorResponse = (status: number, message: ErrorKey | string, errors: any[] = []): IErrorResponse => {
  return {
    success: false,
    status: status,
    message: message,
    errors: errors,
    data: []
  };
};

export const errorResponse = (
  response: Response,
  status: HttpStatusCode,
  message: ErrorKey | string,
  errors: any[] = []
): Response => {
  return response.status(status).json(createErrorResponse(status, message, errors));
};
