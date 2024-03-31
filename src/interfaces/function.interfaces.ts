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
