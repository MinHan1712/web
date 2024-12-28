export interface IStoreResponse {
  store_id?: string;
  store_name?: string;
  code?: string;
  address?: string;
  district?: string;
  city?: string;
  phone?: string;
  email?: string;
  contact_url?: string;
  license_date?: string;
  tax_no?: string;
  status?: string;
  active_flg?: string;
  created_date?: string;
  updated_date?: string;
}

export interface IStoreCreate {
  store_id?: string;
  store_name?: string;
  address?: string;
  district?: string;
  city?: string;
  phone?: string;
  email?: string;
  contact_url?: string;
  license_date?: string;
  tax_no?: string;
  status?: string;
  active_flg?: string;
}