import { CreateRouter } from '../middleware/request-handler.middleware';
import { Request, RequestHandler, Response } from 'express';
import { getDonorSchema } from '../helpers/validations/donor.validation';
import { DonorRepository } from '../repositories/donor.repository';
import { NotFoundError } from '../helpers/error-classes';
import { successResponse } from '../helpers/functions';
import { HttpStatusCode } from 'axios';

const DonorRoutes = CreateRouter();

export const getDonor: RequestHandler = async (req: Request, res: Response) => {
  const donorQuery = getDonorSchema.parse(req.query);

  const getDonor = await DonorRepository.getDonor(donorQuery);

  if (getDonor.length === 0) throw new NotFoundError();

  return successResponse(res, HttpStatusCode.Ok, 'Donor details found', getDonor);
};

DonorRoutes.get('/', getDonor);

export { DonorRoutes };
