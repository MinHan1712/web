import { IPagingAndSortRequest } from "./common";

export interface IUserWithRoleResponse {
  id: string;
  user_id?: string;
  active?: boolean;
  login?: string;
  email?: string;
  phone?: string;
  drg_store_id?: string;
  user_name?: string;
  address?: string;
  status?: boolean;
  create_date?: string;
  update_user?: string;
  update_date?: string;
  role_id?: string;
  role_name?: string;
  password?: string;
  confirm_pasword?: string;
}



export interface IUserWithRolePageRequest extends IPagingAndSortRequest{
  drg_store_id?: string;
  user_name?: string;
  phone?: string;
  status?: boolean;
  email?: string;
  role_id?: string;
}

export interface IUserRequestUpdate {
  id?: string;
  active?: boolean;
  email?: string;
  login?: string;
  phone?: string;
  password?: string;
  user_name?: string;
  address?: string;
  status?: boolean;
  update_ser?: string;
  role_id?: string;
  role_name?: string;
  orig_role_id?: string;
  confirm_pasword?: string;
  // user_id?: string;
  drg_store_id?: string;
}