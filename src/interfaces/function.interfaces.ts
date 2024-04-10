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
