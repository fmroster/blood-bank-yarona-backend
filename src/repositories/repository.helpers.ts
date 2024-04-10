import { IBloodDonation, IDonationCenter } from '../models/yarona-models';

export interface IDonationCenterStats {
  center_id: string;
  center_name: string;
  location: string;
  AB_POSITIVE: number;
  A_POSITIVE: number;
  B_POSITIVE: number;
  AB_NEGATIVE: number;
  A_NEGATIVE: number;
  B_NEGATIVE: number;
  O_POSITIVE: number;
  O_NEGATIVE: number;
}

export const calculateDonationCenterStats = (
  bloodDonations: IBloodDonation[],
  donationCenters: IDonationCenter[]
): IDonationCenterStats[] => {
  const centerStatsMap: Map<string, IDonationCenterStats> = new Map();

  // Initialize centerStatsMap with donation centers
  donationCenters.forEach((center) => {
    centerStatsMap.set(center._id, {
      center_id: center._id,
      center_name: center.center_name,
      location: center.location,
      AB_POSITIVE: 0,
      A_POSITIVE: 0,
      B_POSITIVE: 0,
      AB_NEGATIVE: 0,
      A_NEGATIVE: 0,
      B_NEGATIVE: 0,
      O_POSITIVE: 0,
      O_NEGATIVE: 0
    });
  });

  // Update blood group counts for each donation center
  bloodDonations.forEach((donation) => {
    const centerStats = centerStatsMap.get(donation.center_id);
    if (centerStats) {
      switch (donation.blood_group) {
        case 'AB+':
          centerStats.AB_POSITIVE++;
          break;
        case 'A+':
          centerStats.A_POSITIVE++;
          break;
        case 'B+':
          centerStats.B_POSITIVE++;
          break;
        case 'AB-':
          centerStats.AB_NEGATIVE++;
          break;
        case 'A-':
          centerStats.A_NEGATIVE++;
          break;
        case 'B-':
          centerStats.B_NEGATIVE++;
          break;
        case 'O+':
          centerStats.O_POSITIVE++;
          break;
        case 'O-':
          centerStats.O_NEGATIVE++;
          break;
        default:
          break;
      }
    }
  });

  // Convert Map values to array and return
  return Array.from(centerStatsMap.values());
};

export const extractIdsFromDonationCenters = (donationCenters: IDonationCenter[]): string[] => {
  return donationCenters.map((center) => center._id);
};
