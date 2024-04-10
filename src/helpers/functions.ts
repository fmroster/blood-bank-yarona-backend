import { HttpStatusCode } from 'axios';
import { IBloodRequestWithCenterInfo, IErrorResponse, IStdResponse } from '../interfaces/function.interfaces';
import { Response } from 'express';
import { ErrorKey } from './message-keys';
import { IBloodRequest, IDonationCenter } from '../models/yarona-models';

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

export const getActiveBloodRequests = (
  donationCenters: IDonationCenter[],
  bloodRequests: IBloodRequest[]
): IBloodRequestWithCenterInfo[] => {
  const activeRequests: IBloodRequest[] = bloodRequests.filter((request) => request.active);
  const validCenterIds: Set<string> = new Set(donationCenters.map((center) => center._id));

  const activeBloodRequestsWithCenterInfo: IBloodRequestWithCenterInfo[] = [];

  for (const request of activeRequests) {
    if (validCenterIds.has(request.center_id)) {
      const matchingCenter = donationCenters.find((center) => center._id === request.center_id);
      if (matchingCenter) {
        const bloodRequestWithCenterInfo = {
          _id: request._id,
          blood_group: request.blood_group,
          center_id: request.center_id,
          active: request.active,
          center_name: matchingCenter.center_name,
          location: matchingCenter.location
        };
        activeBloodRequestsWithCenterInfo.push(bloodRequestWithCenterInfo as IBloodRequestWithCenterInfo);
      } else {
        throw new Error(`No matching center found for request with center_id ${request.center_id}`);
      }
    }
  }

  return activeBloodRequestsWithCenterInfo;
};
