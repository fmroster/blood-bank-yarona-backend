import mongoose, { Schema, Document } from 'mongoose';

interface IDonationCenter extends Document {
  center_name: string;
}

interface IUser extends Document {
  contact: string;
  password: string;
}

interface IAppointment extends Document {
  center_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  appointment_date: Date;
  status: string;
}

interface IBloodRequest extends Document {
  blood_group: string;
  center_id: Schema.Types.ObjectId; // Changed type to ObjectId
  status: boolean;
}

interface IBloodDonation extends Document {
  donor_id: Schema.Types.ObjectId; // Changed type to ObjectId
  blood_group: string;
  donation_date: Date;
  syphilis: boolean;
  HIV: boolean;
  center_id: Schema.Types.ObjectId; // Changed type to ObjectId
}

interface IDonor extends Document {
  user_id: Schema.Types.ObjectId; // Changed type to ObjectId
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: Date;
  nationality: string;
  identification: string;
}

// Define Mongoose schemas
const DonationCenterSchema = new Schema({
  center_name: String
});

const UserSchema = new Schema({
  lastname: String,
  contact: String,
  password: String
});

const AppointmentSchema = new Schema({
  center_id: { type: Schema.Types.ObjectId, ref: 'DonationCenter' }, // Added ref
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // Added ref
  appointment_date: Date,
  status: String
});

const BloodRequestSchema = new Schema({
  blood_group: String,
  center_id: { type: Schema.Types.ObjectId, ref: 'DonationCenter' }, // Added ref
  status: Boolean
});

const BloodDonationSchema = new Schema({
  donor_id: { type: Schema.Types.ObjectId, ref: 'User' }, // Added ref
  blood_group: String,
  donation_date: Date,
  syphilis: Boolean,
  HIV: Boolean,
  center_id: { type: Schema.Types.ObjectId, ref: 'DonationCenter' } // Added ref
});

const DonorSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // Added ref
  first_name: String,
  last_name: String,
  gender: String,
  date_of_birth: Date,
  nationality: String,
  identification: String
});

// Define models
const DonationCenter = mongoose.model<IDonationCenter>('DonationCenter', DonationCenterSchema);
const User = mongoose.model<IUser>('User', UserSchema);
const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);
const BloodDonation = mongoose.model<IBloodDonation>('BloodDonation', BloodDonationSchema);
const Donor = mongoose.model<IDonor>('Donor', DonorSchema);

export { DonationCenter, User, Appointment, BloodRequest, BloodDonation, Donor };
