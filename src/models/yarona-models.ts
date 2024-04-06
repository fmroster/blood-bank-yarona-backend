import mongoose, { Schema, Document } from 'mongoose';

export interface IDonationCenter extends Document {
  center_name: string;
  location: string;
}

export interface IUser extends Document {
  contact: string;
  password: string;
}

export interface IAppointment extends Document {
  center_id: number;
  user_id: number;
  appointment_date: Date;
  status: boolean;
}

export interface IBloodRequest extends Document {
  blood_group: string;
  center_id: number;
  active: boolean; // if true then blood request is still active
}

export interface IBloodDonation extends Document {
  donor_id: number;
  blood_group: string;
  donation_date: Date;
  syphilis: boolean;
  HIV: boolean;
  center_id: number;
  blood_results: boolean;
  is_donatable: boolean;
  has_been_transfused: boolean;
}

export interface IDonor extends Document {
  user_id: number; // Changed type to ObjectId
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: Date;
  nationality: string;
  identification: string;
  validation_status: boolean;
}

// Define Mongoose schemas
const DonationCenterSchema = new Schema<IDonationCenter>({
  _id: Number,
  center_name: String,
  location: String
});

const UserSchema = new Schema<IUser>({
  _id: Number,
  contact: String,
  password: String
});

const UserSequenceSchema = new Schema({
  collectionName: { type: String, required: true },
  sequenceValue: { type: Number, default: 1 }
});

UserSchema.index({ contact: 1 }, { unique: true });
const Sequence = mongoose.model('Sequence', UserSequenceSchema);

// Middleware to auto-increment _id
UserSchema.pre<IUser>('save', async function (next) {
  if (this.isNew) {
    const sequence = await Sequence.findOneAndUpdate(
      { collectionName: 'users' }, // collectionName should match the name of your collection
      { $inc: { sequenceValue: 1 } },
      { upsert: true, new: true }
    );
    this._id = sequence.sequenceValue;
    next();
  } else {
    next();
  }
});
DonationCenterSchema.pre<IDonationCenter>('save', async function (next) {
  if (this.isNew) {
    const sequence = await Sequence.findOneAndUpdate(
      { collectionName: 'donationcenters' }, // collectionName should match the name of your collection
      { $inc: { sequenceValue: 1 } },
      { upsert: true, new: true }
    );
    this._id = sequence.sequenceValue;
    next();
  } else {
    next();
  }
});

const AppointmentSchema = new Schema<IAppointment>({
  center_id: { type: Number, ref: 'DonationCenter' }, // Added ref
  user_id: { type: Number, ref: 'User' }, // Added ref
  appointment_date: Date,
  status: { type: Boolean, default: false }
});

const BloodRequestSchema = new Schema<IBloodRequest>({
  blood_group: String,
  center_id: { type: Number, ref: 'DonationCenter' }, // Added ref
  active: { type: Boolean, default: true }
});

const BloodDonationSchema = new Schema<IBloodDonation>({
  donor_id: { type: Number, ref: 'User' }, // Added ref
  blood_group: { type: String, default: null },
  donation_date: Date,
  syphilis: { type: Boolean, default: false },
  HIV: { type: Boolean, default: false },
  center_id: { type: Number, ref: 'DonationCenter' }, // Added ref
  blood_results: { type: Boolean, default: false },
  is_donatable: { type: Boolean, default: false },
  has_been_transfused: { type: Boolean, default: false }
});

const DonorSchema = new Schema<IDonor>({
  user_id: { type: Number, ref: 'User' }, // Added ref
  first_name: String,
  last_name: String,
  gender: String,
  date_of_birth: Date,
  nationality: String,
  identification: String,
  validation_status: { type: Boolean, default: false }
});

DonorSchema.index({ identification: 1 }, { unique: true });

// Define models
const DonationCenter = mongoose.model<IDonationCenter>('DonationCenter', DonationCenterSchema);
const User = mongoose.model<IUser>('User', UserSchema);
const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);
const BloodDonation = mongoose.model<IBloodDonation>('BloodDonation', BloodDonationSchema);
const Donor = mongoose.model<IDonor>('Donor', DonorSchema);

export { DonationCenter, User, Appointment, BloodRequest, BloodDonation, Donor };
