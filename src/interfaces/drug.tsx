import { IPagingAndSortRequest } from "./common";
import { IDrugUnitCreate, IDrugUnitResponse } from "./drugUnit";

// get list drug by inventory
export interface IDrugInvResponse {
    stt?: string,
    drug_id: string;
    drug_code?: string;
    drug_name?: string;
    total_amount?: number;
    total_quantity?: number;
    unit_name?: string;
    provider_id?: string;
}

export interface IDrugInvPageRequest extends IPagingAndSortRequest {
    drug_name?: string;
    provider_id?: string;
}

// get list drug 
export interface IDrugResponse {
    drug_id: string;
    drug_code?: string;
    drg_ref_cd?: string;
    drug_name?: string;
    license_cd?: string;
    vat_percent?: number;
    company_name?: string
    active_ingredient?: string
    original_product?: string
    package_desc?: string
    // image_number?: string
    // image_url?: string
    drug_group?: string
    drug_classified?: string
    drug_kind?: string
    indication?: string
    description?: string
    dosage?: string
    adverse_reaction?: string
    contraindication?: string
    interation?: string
    precaution?: string
    overdosage?: string
    direction_for_use?: string
    start_date?: string
    end_date?: string
    concentration?: string
    status?: boolean;
    active_flg?: boolean;
    note?: string
    storage_temperature?: string
    moisture?: string
    special_control?: string
    drg_store_id?: string
    created_date?: string
    updated_user?: string
    updated_date?: string
    index?: number;
    drug_units?: IDrugUnitResponse[];
}

export interface IDrugPageRequest extends IPagingAndSortRequest {
    drug_name?: string;
    drug_group?: string;
    company_name?: string;
    drug_kind?: string;
    status?: boolean;
    create_date?: string;
    store_id?: string;
    provider_id?: string;
    active_flg?: boolean;
}

// create
export interface IDrugRequest {
    drug_id: string;
    drug_code?: string;
    drg_store_id?: string;
    drg_ref_cd?: string;
    drug_name?: string;
    license_cd?: string;
    vat_percent?: number;
    company_name?: string;
    active_ingredient?: string;
    original_product?: string;
    package_desc?: string;
    image_number?: string;
    image_url?: string;
    drug_group?: string;
    drug_classified?: string;
    drug_kind?: string;
    indication?: string;
    description?: string;
    dosage?: string;
    adverse_reaction?: string;
    contraindication?: string;
    interation?: string;
    precaution?: string;
    overdosage?: string;
    direction_for_use?: string;
    start_date?: string;
    end_date?: string;
    concentration?: string;
    status?: boolean;
    active_flg?: boolean;
    note?: string;
    storage_temperature?: string;
    moisture?: string;
    special_control?: string;
    created_date?: string
    updated_user?: string
    updated_date?: string
    index?: number;
    drug_units?: IDrugUnitCreate[];
}
