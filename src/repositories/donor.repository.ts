import { z } from 'zod';
import { getDonorSchema, validateDonorSchema } from '../helpers/validations/donor.validation';
import mongoose from 'mongoose';
import { Donor, IDonor } from '../models/yarona-models';

const getDonor = async (donorQuery: z.infer<typeof getDonorSchema>): Promise<IDonor[]> => {
  let query = Donor.find();

  // Build the query based on the provided parameters
  if (donorQuery.user_id) {
    query = query.where('user_id', donorQuery.user_id);
  }
  if (donorQuery.identification) {
    query = query.where('identification', donorQuery.identification);
  }
  if (donorQuery.verification !== undefined) {
    query = query.where('validation_status', donorQuery.verification);
  }
  query = query.select('-__v');
  // Execute the query and return the results
  return query.exec();
};

const verifyDonor = async (verifyDonorBody: z.infer<typeof validateDonorSchema>): Promise<boolean> => {
  const { identification, verification } = verifyDonorBody;
  const result: mongoose.UpdateWriteOpResult = await Donor.updateOne(
    { identification: identification, validation_status: false },
    { $set: { validation_status: verification } }
  );
  return !!result.modifiedCount;
};

export const DonorRepository = { getDonor, verifyDonor };
