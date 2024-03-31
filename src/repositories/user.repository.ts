import { z } from 'zod';
import { createUserSchema } from '../helpers/validations/user.validation';
import { createDonorSchema } from '../helpers/validations/donor.validation';
import { Donor, IDonor, IUser, User } from '../models/yarona-models';
import mongoose, { Document, Schema, ClientSession } from 'mongoose';
import { GenericError } from '../helpers/error-classes';
import { HttpStatusCode } from 'axios';
const createUserAndDonor = async (userData: IUser, donorData: IDonor): Promise<{ user_id: string }> => {
  let session: ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.create(userData, { session });
    await Donor.create({ ...donorData, user_id: user[0]._id }, { session });

    await session.commitTransaction();
    await session.endSession();

    return { user_id: user[0]._id.toString() };
  } catch (error) {
    // Rollback changes if an error occurs
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw new GenericError('User creation could not be completed', HttpStatusCode.UnprocessableEntity);
  }
};

const getUserById = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).exec();
};

export const UserRepository = { createUserAndDonor, getUserById };
