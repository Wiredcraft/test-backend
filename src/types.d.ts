
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

export interface ITotalResultData {
  total?: number,// total
  limit?: number,// limit
  skip?: number,// skip
  data: any,// data
}

export interface IResultData extends ITotalResultData {
  code: number,// respose code
  message: string,// respose message
  timestamp: string,
  data: any,// data
}

// pagenation args
// Combine 1: pageSize,pageIndex; Combine 2: limit,skip
export interface IPageNationArgs {
  pageSize?: number,// one page data size
  pageIndex?: number,// page index
  limit?: number,// one page data size
  skip?: number,// return data begion index
}

// format pagenation
export interface IPageNation {
  limit: number,
  skip: number
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