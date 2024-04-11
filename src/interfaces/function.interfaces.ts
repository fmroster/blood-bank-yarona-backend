interface BaseResponse {
  success: boolean;
  status: number; // 201 for put/post/patch, and 200 for get
  message: string;
}

export interface IStdResponse extends BaseResponse {
  data: [];
}
export interface IErrorResponse extends BaseResponse {
  data: [];
  errors: any[];
}

export interface IBloodRequestWithCenterInfo {
  _id: string;
  blood_group: string;
  center_id: string;
  active: boolean;
  center_name: string;
  location: string;
}

export interface IBloodDonorWithPoints {
  _id: string;
  user_id: string; // Changed type to ObjectId
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: Date;
  nationality: string;
  identification: string;
  validation_status: boolean;
  points: number;
}
