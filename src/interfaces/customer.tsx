import { IPagingAndSortRequest } from "./common";

export interface ICustomerResponse {
    customer_id: string;
    customer_code?: string;
    customer_name?: string;
    customer_type?: string;
    drg_store_id?: string;
    customer_group_id?: string;
    customer_group_name?: string;
    birthday?: string;
    sex?: string;
    phone?: string;
    email?: string;
    city?: string;
    address?: string;
    source?: string;
    amount?: number;
    amount_debt?: number;
    note?: string;
    updated_user?: string;
    created_date?: string;
    updated_date?: string;
    status?: boolean;
}

export interface ICustomerCreate{
    city?: string;
    customer_group_id?: string;
    customer_name?: string;
    customer_type?: string;
    address?: string;
    email?: string;
    birthday?: string;
    sex?: string;
    phone?: string;
    source?: string;
    note?: string;
    drg_store_id?: string;
    updated_user?: string;
}

export interface ICustomerUpdate extends ICustomerCreate {
    customer_id?: string;
    status?: boolean;
}


export interface ICustomerPageRequest extends IPagingAndSortRequest{
    phone?: string;
    customer_name?: string;
    customer_code? : string;
    customer_group_id?: string;
    customer_type?: string;
    city?: string;
    address?: string;
    drg_store_id?: string;
}