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


export interface IUnit {
  unit_id?: string;
  unit_cd?: string;
  unit_name?: string;
  account_id?: string;
  status?: boolean;
  created_date?: string;
  updated_user?: string;
  updated_date?: string;
}