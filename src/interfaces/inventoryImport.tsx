import { IPagingAndSortRequest } from "./common";
import { IDrugUnitResponse } from "./drugUnit";
import { IDrugInventoryDetailResponse, IImportInventoryDetailCreate } from "./inventoryDetail";

export interface IInvoiceImportResponse {
    inventory_id: string;
    inventory_code?: string;
    drg_store_id?: string;
    summary_id?: string;
    process_date?: string;
    approve_date?: string;
    inventory_type?: string;
    inv_dd?: string;
    note?: string;
    provider_id?: string;
    provider_name?: string;
    pay_method?: string;
    amount?: number;
    amount_debt?: number;
    discount_amount?: number;
    vat?: number;
    status?: string;
    created_date?: string;
    updated_user?: string;
    updated_date?: string;
    classification?: boolean;
    customer_id?: string;
    customer_name?: string;
    customer_phone?: string;
    drg_inv_inventory_details?: IDrugInventoryDetailResponse[];
}


export interface IInventoryImportPageRequest extends IPagingAndSortRequest {
    drug_name?: string;
    inventory_code?: string;
    inventory_type?: string;
    classification?: boolean;
    lot?: string;
    provider_id?: string;
    status?: string;
    from_time?: string;
    to_time?: string;
    create_from_time?: string;
    create_to_time?: string;
    store_id?: string;
    customer_name?: string;
    create_date_to?: string;
    create_date_from?: string;
    pay_menthod?: string;
}

export interface IDrugInvProductPageRequest extends IPagingAndSortRequest {
    drug_name?: string;
    exp_date?: string;
    quantity?: string;
    classification?: boolean;
    status?: boolean
    drg_store_id?: string;
}

export interface IDrgInvProductResponse {
    id: string;
    inventory_id?: string;
    drug_id?: string;
    quantity?: string;
    base_quantity?: number;
    drug_unit_id?: string;
    unit_parent_id?: string;
    price?: number;
    lot?: string;
    vat_percent?: number;
    mfg_date?: string;
    exp_date?: string;
    start_date?: string;
    note?: string;
    dosage?: string;
    discount_amount?: number;
    discount_type?: string;
    discount_unit?: string;
    promotion_flg?: boolean;
    store_id?: string;
    status?: boolean;
    create_date?: string;
    update_user?: string;
    update_date?: string;
    drug_name?: string;
    drug_code?: string;
    unit_name?: string;
    total_price?: number;
    sum_quantity?: number;
    sum_base_quantity?: number;
    units?: IDrugUnitResponse[];
}

export interface IImportInventoryCreate {
    process_date?: string;
    import_type?: string;
    invoice_code?: string;
    note?: string;
    provider_id?: string;
    pay_method?: string;
    discount_amount?: number | 0;
    discount_vat?: number | 0;
    amount_paid?: number | 0;
    amount?: number | 0;
    amount_debt?: number | 0;
    vat?: number | 0;
    drg_store_id?: string;
    updated_user?: string;
    status?: string;
    classification?: boolean;
    provider_name?: string;
    amt_total?: number;
    // is_amount_debt?: boolean;
}

export interface ICreateInvImport {
    info: IImportInventoryCreate,
    products: IImportInventoryDetailCreate[];
}