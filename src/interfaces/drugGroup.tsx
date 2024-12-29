export interface IDrugGroupResponse {
    drug_group_id?: string;
    code?: string;
    name?: string;
    status?: boolean;
    drg_store_id?: string;
    created_date?: string;
    updated_user?: string;
    updated_date?: string;

}

export interface IDrugGroupCreateRequest {
    code?: string;
    name?: string;
    drg_store_id?: string;
    updated_user?: string;
}

export interface IDrugGroupUpdateRequest extends IDrugGroupCreateRequest {
    drug_group_id?: string;
}

