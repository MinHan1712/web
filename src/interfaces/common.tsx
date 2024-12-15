export interface IPagingAndSortRequest {
  page?: number;
  size?: number;
}

export interface IMeta {
  code: number;
  message: string;
}

export interface IResponse<T> {
  meta: IMeta[];
  data: T;
}

// export interface IMessageCodeType{
//   code?: number;
//   message?: string;
// }


export interface IPageResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  data: T;
}
