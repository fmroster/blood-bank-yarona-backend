import { CreateRouter } from '../middleware/request-handler.middleware';
import { Request, RequestHandler, Response } from 'express';
import { createDonorSchema, validateDonorSchema } from '../helpers/validations/donor.validation';
import { UserRepository } from '../repositories/user.repository';
import { IDonor, IUser } from '../models/yarona-models';
import { successResponse } from '../helpers/functions';
import { HttpStatusCode } from 'axios';
import { deleteDonorSchema, getUserSchema } from '../helpers/validations/user.validation';
import { GenericError, NotFoundError } from '../helpers/error-classes';
import { DonorRepository } from '../repositories/donor.repository';

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
    _id: donorBody.user_id
  };

  const createDonorUser = await UserRepository.createUserAndDonor(userData as IUser, donorData as IDonor);

  return successResponse(res, HttpStatusCode.Created, 'User created', createDonorUser);
};

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const userQuery = getUserSchema.parse(req.query);

  const userDetails = await UserRepository.getUser(userQuery.user_id, userQuery.contact);

  if (!userDetails) {
    throw new NotFoundError();
  }

  return successResponse(res, HttpStatusCode.Ok, 'User details found', userDetails);
};

export const validateDonor: RequestHandler = async (req: Request, res: Response) => {
  const userValidationBody = validateDonorSchema.parse(req.body);

  const verifyDonor = await DonorRepository.verifyDonor(userValidationBody);
  if (!verifyDonor) {
    throw new GenericError('Could not be verify donor', HttpStatusCode.UnprocessableEntity);
  }
  return successResponse(res, HttpStatusCode.Created, 'Verification success');
};
const deleteDonor: RequestHandler = async (req: Request, res: Response) => {
  const deleteDonorQuery = deleteDonorSchema.parse(req.query);
  const getDonor = await DonorRepository.getDonor(deleteDonorQuery);
  if (getDonor.length === 0) {
    throw new GenericError('Could not delete donor who does not exits', HttpStatusCode.UnprocessableEntity);
  }
  const deleteDonor = await UserRepository.deleteDonor(getDonor[0].user_id.toString());
  if (!deleteDonor) throw new GenericError('Donor possibly already verified', HttpStatusCode.UnprocessableEntity);

  return successResponse(res, HttpStatusCode.Created, 'Donor deleted successfully');
};

UserRoutes.post('/', createDonor).get('/', getUser).put('/verification', validateDonor).delete('/', deleteDonor);

export { UserRoutes };
