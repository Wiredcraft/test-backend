
export interface IAddressInfo {
  address: string,// '::',
  family: string,// 'IPv6',
  port: number,// 7000
}

export interface IResponseData {
  code: number,// respose code
  message: string,// respose message
  timestamp: string,// return date
}

export interface IResultData {
  code: number,// respose code
  message: string,// respose message
  data: any,// data
  timestamp: string,// return date
  total?: number,// total
  limit?: number,// limit
  skip?: number,// skip
}


export interface ICreateResult extends IResultData {
  data: any
}

export interface IFindResult extends IResultData {
  data: any[]
}

export interface IGetResult extends IResultData {
  data: any
}

export interface IUpdateResult extends IResultData {
  data: any
}

export interface IDeleteResult extends IResultData {
  data: any
}