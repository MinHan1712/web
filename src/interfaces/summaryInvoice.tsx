import { IPagingAndSortRequest } from "./common";

export interface IDrugInvSummaryRequest {
  drg_inv_summary_id?: string;
  drg_store_id?: string;
  check_date?: string;
  check_user?: string;
  note?: string;
  summary_type?: string;
  updated_user?: string;
  products: IDrgInvSummaryDetailCreate[];
}


export interface IDrgInvSummaryDetailCreate {
  key?: number;
  // inventory_id?: string;
  summary_dd_id: string;
  cur_qty?: number;
  pre_qty?: number;
  drug_id?: string;
  drug_name?: string;
  drug_code?: string;
  inv_detail_id?: string;
  drg_store_id?: string;
  drug_unit_id?: string;
  drug_unit_name?: string;
  updated_user?: string;
  check_date?: string;
  lot?: string;
  price?: number;
  exp_date?: string;
  inv_detail?: string;
  vat?:number; 
  discount_amount?: number;
}

export interface IDrugInvSummaryPageRequest extends IPagingAndSortRequest {
  check_date?: string;
  from_date?: string;
  to_date?: string;
  drug_name?: string;
  drg_store_id?: string;
}

export interface IDrugInvSummaryResponse {
  summary_id: string;
  drg_store_id?: string;
  check_date?: string;
  check_user?: string;
  total_product?: string;
  status?: string;
  note?: string;
  created_date?: string;
  updated_user?: string;
  updated_date?: string;
  drg_inv_summary_details?: DrugInvSummaryDetailResponse[];
}


export interface DrugInvSummaryDetailResponse {
  summary_dd_id: string;
  drg_summary_id?: string;
  inv_detail_id?: string;
  drug_id?: string;
  drg_drug_cd?: string;
  drg_drug_name?: string;
  drg_store_id?: string;
  lot?: string;
  drug_unit_id?: string;
  unit_name?: string;
  check_date?: string;
  note?: string;
  cur_qty?: number;
  pre_qty?: number;
  import_qty?: number;
  export_qty?: number;
  adj_qty?: number;
  inv_qty?: string;
  status?: string;
  created_date?: string;
  updated_user?: string;
  updated_date?: string;
}
