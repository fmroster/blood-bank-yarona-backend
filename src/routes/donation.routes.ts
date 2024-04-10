import { CreateRouter } from '../middleware/request-handler.middleware';
import { Request, RequestHandler, Response } from 'express';
import {
  createBloodDonationSchema,
  getBloodDonationSchema,
  getCenterStatsSchema,
  transfuseBloodSchema,
  updateBloodDonationResultsSchema
} from '../helpers/validations/blood-donation.validation';
import { DonorRepository } from '../repositories/donor.repository';
import { GenericError, NotFoundError } from '../helpers/error-classes';
import { HttpStatusCode } from 'axios';
import { DonationRepository } from '../repositories/donation.repository';
import { successResponse } from '../helpers/functions';
import { IBloodDonation, IDonationCenter } from '../models/yarona-models';
import {
  calculateDonationCenterStats,
  extractIdsFromDonationCenters,
  IDonationCenterStats
} from '../repositories/repository.helpers';
import { DonationCenterRepository } from '../repositories/donation-center.repository';

const DonationRoutes = CreateRouter();

export const createDonation: RequestHandler = async (req: Request, res: Response) => {
  const donationBody = createBloodDonationSchema.parse(req.body);

  const getDonorDetails = await DonorRepository.getDonor({ identification: donationBody.identification });
  const getDonationCenter = await DonationCenterRepository.getDonationCenters({
    center_id: donationBody.center_id.toString()
  });

  if (getDonationCenter.length == 0) {
    throw new GenericError('Center does not exist', HttpStatusCode.UnprocessableEntity);
  }
  if (getDonorDetails.length === 0) {
    throw new GenericError('User does not exist', HttpStatusCode.UnprocessableEntity);
  }

  const user_id: string = getDonorDetails[0].user_id;

  const createBloodDonation = await DonationRepository.createBloodDonation(donationBody, user_id);

  if (!createBloodDonation) {
    throw new GenericError('Could not create donation', HttpStatusCode.UnprocessableEntity);
  }

  return successResponse(res, HttpStatusCode.Created, 'Donation created');
};

export const getDonation: RequestHandler = async (req: Request, res: Response) => {
  const donationQuery = getBloodDonationSchema.parse(req.query);
  let user_id: string | undefined = undefined;

  if (donationQuery.donor_identification) {
    const getDonorDetails = await DonorRepository.getDonor({ identification: donationQuery.donor_identification });

    if (getDonorDetails.length === 0) {
      throw new GenericError('User does not exist', HttpStatusCode.UnprocessableEntity);
    }

    user_id = getDonorDetails[0].user_id;
  }

  const getDonation: IBloodDonation[] = await DonationRepository.getBloodDonation(donationQuery, user_id);

  if (getDonation.length === 0) {
    throw new NotFoundError('Donation(s) not found');
  }

  return successResponse(res, HttpStatusCode.Ok, 'Donations found', getDonation);
};

const updateBloodDonationResults: RequestHandler = async (req: Request, res: Response) => {
  let is_donatable: boolean = true;

  const updateDonationBody = updateBloodDonationResultsSchema.parse(req.body);

  if (updateDonationBody.hiv || updateDonationBody.syphilis) {
    is_donatable = false;
  }

  const updateDonationResults = await DonationRepository.updateBloodDonationResults(updateDonationBody, is_donatable);

  if (!updateDonationResults) {
    throw new GenericError('Could not update donation results', HttpStatusCode.UnprocessableEntity);
  }

  return successResponse(res, HttpStatusCode.Created, 'Donation results updated');
};

const transfuseDisposeBlood: RequestHandler = async (req: Request, res: Response) => {
  const transfuseBloodQuery = transfuseBloodSchema.parse(req.query);

  const transfuseDisposeBlood = await DonationRepository.transfuseBlood(transfuseBloodQuery);

  if (!transfuseDisposeBlood) {
    throw new GenericError(
      'Cannot dispose or transfuse this blood, check the donation ID',
      HttpStatusCode.UnprocessableEntity
    );
  }
  return successResponse(
    res,
    HttpStatusCode.Created,
    'Blood has been removed from the system and is to be transfused or disposed'
  );
};

const bloodCenterBloodStatistics: RequestHandler = async (req: Request, res: Response) => {
  const bloodCenterQuery = getCenterStatsSchema.parse(req.query);

  const bloodCenters: IDonationCenter[] = await DonationCenterRepository.getDonationCenters(bloodCenterQuery);

  const centerIds: string[] = extractIdsFromDonationCenters(bloodCenters);

  const getBloodDonations: IBloodDonation[] = await DonationRepository.getCenterBloodDonations(centerIds);

  const centerStatistics: IDonationCenterStats[] = calculateDonationCenterStats(getBloodDonations, bloodCenters);

  return successResponse(res, HttpStatusCode.Ok, 'available blood statistics', centerStatistics);
};

DonationRoutes.post('/', createDonation)
  .get('/', getDonation)
  .put('/', updateBloodDonationResults)
  .put('/transfuse', transfuseDisposeBlood)
  .get('/statistics', bloodCenterBloodStatistics);

export { DonationRoutes };
