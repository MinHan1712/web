import { IDrugUnitResponse } from "./drugUnit";

export interface IDrugInventoryDetailResponse {
    id: string;
    inventory_id?: string;
    drug_id?: string;
    quantity?: number;
    base_quantity?: number;
    drug_unit_id?: string;
    unit_parent_id?: string;
    price?: number;
    lot?: string;
    vat_percent?: number;
    exp_date?: string;
    note?: string;
    dosage?: string;
    discount_amount?: number;
    drg_store_id?: string;
    status?: boolean;
    create_date?: string;
    update_user?: string;
    update_date?: string;
    drug_name?: string;
    drug_code?: string;
    unit_name?: string;
    total_amount?: number;
    inv_id?: string;
}


export interface IImportInventoryDetailCreate {
    key?: number;
    inventory_detail_id?: string;
    drug_id?: string;
    drug_code?: string;
    drug_name?: string;
    inventory_id?: string;
    lot?: string;
    quantity?: number;
    quantity_pre?: number;
    price?: number;
    unit_id?: string;
    unit_parent_id?: string;
    exp_date?: string;
    vat_percent?: number;
    discount_amount?: number;
    store_id?: string;
    update_user?: string;
    total_amount?: number;
    drug_units?: IDrugUnitResponse[];
    total_price?: number;
    unit_quantity?: number;
    cur_price?: number;
}
