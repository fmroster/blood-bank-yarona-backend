import { CreateRouter } from '../middleware/request-handler.middleware';
import { Request, RequestHandler, Response } from 'express';
import { createDonorSchema } from '../helpers/validations/donor.validation';
import { UserRepository } from '../repositories/user.repository';
import { IDonor, IUser } from '../models/yarona-models';
import { successResponse } from '../helpers/functions';
import { HttpStatusCode } from 'axios';

const UserRoutes = CreateRouter();

export const createDonor: RequestHandler = async (req: Request, res: Response) => {
  const donorBody = createDonorSchema.parse(req.body);

  const donorData = {
    first_name: donorBody.first_name,
    last_name: donorBody.last_name,
    gender: donorBody.gender,
    date_of_birth: donorBody.date_of_birth,
    nationality: donorBody.nationality,
    identification: donorBody.identification
  };

  const userData = {
    contact: donorBody.contact,
    password: donorBody.password
  };

  const createDonorUser = await UserRepository.createUserAndDonor(userData as IUser, donorData as IDonor);

  return successResponse(res, HttpStatusCode.Created, 'User created', createDonorUser);
};

UserRoutes.post('/', createDonor);

export { UserRoutes };
