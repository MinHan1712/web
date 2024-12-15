import { IPagingAndSortRequest } from "./common";

export interface ICustomerGroupResponse {
    customer_group_id: string;
    customer_group_cd?: string;
    customer_group_name?: string;
    customer_group_type?: string;
    condition_type?: string;
    conditions?: string;
    note?: string;
    drg_store_id?: string;
    status?: string;
    created_date?: string;
    updated_user?: string;
    updated_date?: string;
}

export interface ICustomerGroupCreate {
    customer_group_name?: string;
    customer_group_cd?: string;
    customer_group_type?: string;
    // conditions?: string;
    // condition_type?: string;
    note?: string;
    updated_user?: string;
    drg_store_id?: string;
}


export interface ICustomerGroupUpdate extends ICustomerGroupCreate {
    customer_group_id?: string;
    status?: string;
}

export interface ICustomerGroupPageRequest extends IPagingAndSortRequest {
    customer_group_name?: string;
    customer_group_type?: string;
}