import { z } from 'zod';
import {
  createBloodRequestSchema,
  deactivateBloodRequestSchema,
  getBloodRequestSchema
} from '../helpers/validations/blood-request.validation';
import { BloodRequest, IBloodRequest } from '../models/yarona-models';

const createBloodRequest = async (bloodRequestBody: z.infer<typeof createBloodRequestSchema>) => {
  await BloodRequest.create(bloodRequestBody);
};

const getBloodRequests = async (bloodRequestQuery: z.infer<typeof getBloodRequestSchema>): Promise<IBloodRequest[]> => {
  let query = BloodRequest.find();

  if (bloodRequestQuery.blood_group) {
    query = query.where('blood_group', bloodRequestQuery.blood_group);
  }
  if (bloodRequestQuery.center_id) {
    query = query.where('center_id', bloodRequestQuery.center_id);
  }
  if (bloodRequestQuery.request_id) {
    query = query.where('_id', bloodRequestQuery.request_id);
  }
  query = query.select('-__v');
  return query.exec();
};

const deactivateBloodRequest = async (bloodRequestQuery: z.infer<typeof deactivateBloodRequestSchema>) => {
  const request = await BloodRequest.findOneAndUpdate(
    { active: true, _id: bloodRequestQuery.request_id },
    { $set: { active: false } }
  );
  console.log(request);
  return request;
};

export const BloodRequestRepository = { createBloodRequest, getBloodRequests, deactivateBloodRequest };
