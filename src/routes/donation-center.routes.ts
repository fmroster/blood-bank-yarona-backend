import { CreateRouter } from '../middleware/request-handler.middleware';
import { Request, RequestHandler, Response } from 'express';
import { donationCenterSchema, getDonationCenterSchema } from '../helpers/validations/donation-center.validation';
import { donationCenterRepository } from '../repositories/donation-center.repository';
import { successResponse } from '../helpers/functions';
import { HttpStatusCode } from 'axios';
import { NotFoundError } from '../helpers/error-classes';
import { UserRepository } from '../repositories/user.repository';
import { IDonationCenter, IUser } from '../models/yarona-models';

const centerRoutes = CreateRouter();

export const createDonationCenter: RequestHandler = async (req: Request, res: Response) => {
  const centerBody = donationCenterSchema.parse(req.body);

  const centerData = { center_name: centerBody.center_name, location: centerBody.location };

  const userData = {
    contact: centerBody.contact,
    _id: centerBody.user_id
  };

  const createCenter = await UserRepository.createCenter(userData as IUser, centerData as IDonationCenter);

  return successResponse(res, HttpStatusCode.Created, 'Donation center created', createCenter);
};

export const getDonationCenter: RequestHandler = async (req: Request, res: Response) => {
  const centerQuery = getDonationCenterSchema.parse(req.query);

  const getCenters = await donationCenterRepository.getDonationCenters(centerQuery);

  if (getCenters.length === 0) {
    throw new NotFoundError('Centers not found');
  }
  return successResponse(res, HttpStatusCode.Ok, 'Center(s) found', getCenters);
};

centerRoutes.post('/', createDonationCenter).get('/', getDonationCenter);

export { centerRoutes };
