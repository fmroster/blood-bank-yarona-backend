import { CreateRouter } from '../middleware/request-handler.middleware';
import { Request, RequestHandler, Response } from 'express';
import { getDonorSchema } from '../helpers/validations/donor.validation';
import { DonorRepository } from '../repositories/donor.repository';
import { NotFoundError } from '../helpers/error-classes';
import { successResponse } from '../helpers/functions';
import { HttpStatusCode } from 'axios';
import { IDonor } from '../models/yarona-models';
import { IBloodDonorWithPoints } from '../interfaces/function.interfaces';
import { DonationRepository } from '../repositories/donation.repository';

const DonorRoutes = CreateRouter();

export const getDonor: RequestHandler = async (req: Request, res: Response) => {
  const donorQuery = getDonorSchema.parse(req.query);

  const getDonor: IDonor[] = await DonorRepository.getDonor(donorQuery);

  if (getDonor.length === 0) throw new NotFoundError('Donor information not found');

  const donorWithPoints: IBloodDonorWithPoints[] = [];
  for (const donor of getDonor) {
    const donations = await DonationRepository.getBloodDonation(undefined, donor.user_id);
    const points = donations.length * 10;

    donorWithPoints.push({
      _id: donor._id.toString(),
      user_id: donor.user_id,
      first_name: donor.first_name,
      last_name: donor.last_name,
      gender: donor.gender,
      date_of_birth: donor.date_of_birth,
      nationality: donor.nationality,
      identification: donor.identification,
      validation_status: donor.validation_status,
      points: points
    });
  }

  return successResponse(res, HttpStatusCode.Ok, 'Donor details found', donorWithPoints);
};

DonorRoutes.get('/', getDonor);

export { DonorRoutes };
