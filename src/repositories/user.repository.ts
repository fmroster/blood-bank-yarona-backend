import { z } from 'zod';
import { createUserSchema } from '../helpers/validations/user.validation';
import { createDonorSchema, validateDonorSchema } from '../helpers/validations/donor.validation';
import { Donor, IDonor, IUser, User } from '../models/yarona-models';
import mongoose, { Document, Schema, ClientSession } from 'mongoose';
import { GenericError } from '../helpers/error-classes';
import { HttpStatusCode } from 'axios';
const createUserAndDonor = async (userData: IUser, donorData: IDonor): Promise<{ user_id: string }> => {
  let session: ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.create([userData], { session }); // Use create() with array for transaction
    await Donor.create([{ ...donorData, user_id: user[0]._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    return { user_id: user[0]._id.toString() };
  } catch (error) {
    // Rollback changes if an error occurs
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    if ((error as Error).message.toLowerCase().includes('duplicate key')) {
      throw new GenericError('Problem with details', HttpStatusCode.UnprocessableEntity);
    }
    throw new GenericError(
      (error as Error).message || 'User creation could not be completed',
      HttpStatusCode.UnprocessableEntity
    );
  }
};

const getUser = async (user_id?: string, contact?: string): Promise<IUser | null> => {
  let query = User.findOne();
  if (user_id) {
    query = query.where('_id', user_id);
  } else if (contact) {
    query = query.where('contact', contact);
  } else {
    return null;
  }

  query = query.select('-password');

  return query.exec();
};

const verifyDonor = async (verifyDonorBody: z.infer<typeof validateDonorSchema>): Promise<boolean> => {
  const { identification, verification } = verifyDonorBody;
  const result: mongoose.UpdateWriteOpResult = await Donor.updateOne(
    { identification: identification, validation_status: false },
    { $set: { validation_status: verification } }
  );
  if (result.modifiedCount) {
    return true;
  }
  return false;
};

export const UserRepository = { createUserAndDonor, getUser, verifyDonor };
