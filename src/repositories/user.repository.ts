import { DonationCenter, Donor, IDonationCenter, IDonor, IUser, User } from '../models/yarona-models';
import mongoose, { ClientSession } from 'mongoose';
import { GenericError } from '../helpers/error-classes';
import { HttpStatusCode } from 'axios';
const createDonor = async (userData: IUser, donorData: IDonor): Promise<{ user_id: number }> => {
  let session: ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.create([{ contact: userData.contact, _id: userData._id, user_role: 1 }], { session }); // Use create() with array for transaction
    await Donor.create([{ ...donorData, user_id: user[0]._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    return { user_id: user[0]._id };
  } catch (error) {
    // Rollback changes if an error occurs
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    if ((error as Error).message.toLowerCase().includes('duplicate key')) {
      throw new GenericError('Duplicate email or identification number', HttpStatusCode.UnprocessableEntity);
    }
    throw new GenericError(
      (error as Error).message || 'User creation could not be completed',
      HttpStatusCode.UnprocessableEntity
    );
  }
};

const createCenter = async (userData: IUser, centerData: IDonationCenter) => {
  let session: ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.create([{ contact: userData.contact, _id: userData._id, user_role: 2 }], { session });
    await DonationCenter.create([{ ...centerData, _id: user[0]._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    return { user_id: user[0]._id };
  } catch (error) {
    // Rollback changes if an error occurs
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    if ((error as Error).message.toLowerCase().includes('duplicate key')) {
      throw new GenericError('Duplicate email', HttpStatusCode.UnprocessableEntity);
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
  query = query.select('-__v');
  return query.exec();
};

const deleteDonor = async (userId: string): Promise<boolean> => {
  let session: ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Delete donor first
    const donorDeleteResults: mongoose.mongo.DeleteResult = await Donor.deleteOne(
      { user_id: userId, validation_status: false },
      { session }
    );

    if (donorDeleteResults.deletedCount === 0) {
      return false;
    }

    // Then delete user
    await User.deleteOne({ _id: userId }, { session });

    await session.commitTransaction();
    await session.endSession();

    return true;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    throw new GenericError((error as Error).message || 'Failed to delete donor', HttpStatusCode.UnprocessableEntity);
  }
};

export const UserRepository = { createUserAndDonor: createDonor, getUser, deleteDonor, createCenter };
