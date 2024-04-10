import { CreateRouter } from '../middleware/request-handler.middleware';
import { Request, RequestHandler, Response } from 'express';
import {
  createBloodRequestSchema,
  deactivateBloodRequestSchema,
  getBloodRequestSchema
} from '../helpers/validations/blood-request.validation';
import { BloodRequestRepository } from '../repositories/blood-request.repository';
import { getActiveBloodRequests, successResponse } from '../helpers/functions';
import { HttpStatusCode } from 'axios';
import { DonationCenterRepository } from '../repositories/donation-center.repository';
import { IBloodRequest, IDonationCenter } from '../models/yarona-models';
import { GenericError, NotFoundError } from '../helpers/error-classes';

const BloodRequestRoutes = CreateRouter();

export const createBloodRequest: RequestHandler = async (req: Request, res: Response) => {
  const requestBody = createBloodRequestSchema.parse(req.body);
  const center: IDonationCenter[] = await DonationCenterRepository.getDonationCenters({
    center_id: requestBody.center_id
  });

  if (center.length === 0) {
    throw new GenericError('cannot create request for non existent center', HttpStatusCode.UnprocessableEntity);
  }
  await BloodRequestRepository.createBloodRequest(requestBody);

  return successResponse(res, HttpStatusCode.Created, 'Request for blood created');
};

export const updateBloodRequest: RequestHandler = async (req: Request, res: Response) => {
  const requestQuery = deactivateBloodRequestSchema.parse(req.query);
  const deactivateRequest = await BloodRequestRepository.deactivateBloodRequest(requestQuery);

  if (!deactivateRequest) {
    throw new GenericError(
      'Cannot deactivate a request that has already been deactivated or does not exist',
      HttpStatusCode.UnprocessableEntity
    );
  }
  return successResponse(res, HttpStatusCode.Created, 'Request for blood deactivated');
};

export const getBloodRequest: RequestHandler = async (req: Request, res: Response) => {
  const requestQuery = getBloodRequestSchema.parse(req.query);

  const center: IDonationCenter[] = await DonationCenterRepository.getDonationCenters({
    location: requestQuery.location,
    center_id: requestQuery.center_id
  });

  if (center.length === 0) {
    throw new NotFoundError('No results pertaining to the selected location or center as it does not exist');
  }

  const getBloodRequest: IBloodRequest[] = await BloodRequestRepository.getBloodRequests(requestQuery);

  const bloodRequests = getActiveBloodRequests(center, getBloodRequest);

  return successResponse(res, HttpStatusCode.Ok, 'Blood requests found', bloodRequests);
};

BloodRequestRoutes.post('/', createBloodRequest).put('/', updateBloodRequest).get('/', getBloodRequest);

export { BloodRequestRoutes };
