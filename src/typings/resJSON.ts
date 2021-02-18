export interface SuccessRes {
  errCode: number;
  data?: any
}

export interface ErrorRes {
  errCode: number;
  msg: string;
}