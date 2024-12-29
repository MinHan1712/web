export interface IDrugKindResponse {
    drug_kind_id?: string;
    code?: string;
    name?: string;
    status?: boolean;
    drg_store_id?: string;
    created_date?: string;
    updated_user?: string;
    updated_date?: string;

}

export interface IDrugKindCreateRequest {
    code?: string;
    name?: string;
    drg_store_id?: string;
    updated_user?: string;
}

export interface IDrugKindUpdateRequest extends IDrugKindCreateRequest {
    drug_kind_id?: string;
    status?: boolean;
}
