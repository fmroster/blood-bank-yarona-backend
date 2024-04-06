import { z } from 'zod';
import { donationCenterSchema, getDonationCenterSchema } from '../helpers/validations/donation-center.validation';
import { DonationCenter, IDonationCenter } from '../models/yarona-models';

const createDonationCenter = async (
  donationCentreBody: z.infer<typeof donationCenterSchema>
): Promise<{ center_id: number }> => {
  const center = await DonationCenter.create(donationCentreBody);
  const center_id: number = center._id;

  return { center_id };
};

const getDonationCenters = async (centerQuery: z.infer<typeof getDonationCenterSchema>): Promise<IDonationCenter[]> => {
  let query = DonationCenter.find();

  // Build the query based on the provided parameters
  if (centerQuery.center_name) {
    // Use regex to perform case-insensitive partial matching on center_name
    const regex = new RegExp(centerQuery.center_name, 'i');
    query = query.where('center_name', regex);
  }

  if (centerQuery.location) {
    const regex = new RegExp(centerQuery.location, 'i');
    query = query.where('location', regex);
  }
  if (centerQuery.center_id) {
    query = query.where('_id', centerQuery.center_id);
  }
  query = query.select('-__v');
  // Execute the query and return the results
  return query.exec();
};
export const donationCenterRepository = { createDonationCenter, getDonationCenters };
