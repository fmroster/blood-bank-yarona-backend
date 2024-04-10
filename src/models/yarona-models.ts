import mongoose, { Schema, Document } from 'mongoose';

export interface IDonationCenter extends Document {
  center_name: string;
  location: string;
}

export interface IUser extends Document {
  contact: string;
  user_role: 1 | 2;
}

export interface IAppointment extends Document {
  center_id: string;
  user_id: number;
  appointment_date: Date;
  status: boolean;
}

export interface IBloodRequest extends Document {
  blood_group: string;
  center_id: string;
  active: boolean; // if true then blood request is still active
}

export interface IBloodDonation extends Document {
  donor_id: number; // Changed type to ObjectId
  blood_group: string;
  donation_date: Date;
  syphilis: boolean;
  HIV: boolean;
  center_id: string; // Changed type to ObjectId
  blood_results: boolean;
  has_been_transfused: boolean;
}

export interface IDonor extends Document {
  user_id: string; // Changed type to ObjectId
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
  _id: String,
  center_name: String,
  location: String
});

const UserSchema = new Schema<IUser>({
  _id: String,
  contact: String,
  user_role: { type: Number, enum: [1, 2], default: 1 }
});

UserSchema.index({ contact: 1 }, { unique: true });

const AppointmentSchema = new Schema<IAppointment>({
  center_id: { type: String, ref: 'DonationCenter' }, // Added ref
  user_id: { type: Number, ref: 'User' }, // Added ref
  appointment_date: Date,
  status: { type: Boolean, default: false }
});

const BloodRequestSchema = new Schema<IBloodRequest>({
  blood_group: String,
  center_id: { type: String, ref: 'DonationCenter' }, // Added ref
  active: { type: Boolean, default: true }
});

const BloodDonationSchema = new Schema<IBloodDonation>({
  donor_id: { type: Number, ref: 'User' }, // Added ref
  blood_group: String,
  donation_date: Date,
  syphilis: { type: Boolean, default: false },
  HIV: { type: Boolean, default: false },
  center_id: { type: String, ref: 'DonationCenter' }, // Added ref
  blood_results: { type: Boolean, default: false },
  has_been_transfused: { type: Boolean, default: false }
});

const DonorSchema = new Schema<IDonor>({
  user_id: { type: String, ref: 'User' }, // Added ref
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
