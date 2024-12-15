export interface IDrugUnitResponse {
    drug_unit_id: string;
    drug_id?: string;
    drug_name?: string;
    drug_code?: string;
    unit_id?: string;
    unit_name?: string;
    unit_parent_id?: string;
    unit_qty?: number;
    inv_qty_alarm?: number;
    import_price?: number;
    price?: number;
    vat_percent?: number;
    drg_store_id?: string;
    account_id?: string;
    status?: boolean;
    created_date?: string;
    updated_user?: string;
    updated_date?: string;
    key: number;
}

export interface IDrugUnitCreate {
    key: number,
    drug_unit_id: string;
    drug_id?: string;
    unit_id?: string;
    // unit_name?: string;
    unit_parent_id?: string;
    unit_qty?: number;
    //inv_qty_alarm?: number;//TODO
    import_price?: number;
    price?: number;
    updated_user?: string;
    drg_store_id?: string;
    vat_percent?: number;
    status?: boolean;
}