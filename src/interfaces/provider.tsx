import { IPagingAndSortRequest } from "./common";

export interface IProviderResponse {
    provider_id: string;
    provider_code?: string;
    provider_name?: string;
    drg_store_id?: string;
    phone?: string;
    email?: string;
    amount?: number;
    amount_debt?: number;
    website?: string;
    tax_no?: string;
    city?: string;
    address?: string;
    status?: boolean;
    zipcode?: string;
    note?: string;
    created_date?: Date;
    updated_date?: Date;
}

export interface IProviderCreate {
    provider_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
    website?: string;
    tax_no?: string;
    // updated_user?: string;
    drg_store_id?: string;
}

export interface IProviderUpdate extends IProviderCreate {
    provider_id: string;
    status?: boolean;
}

export interface IProviderDelete {
    provider_id: string;
    // updated_user?: string;
}

export interface IProviderPageRequest extends IPagingAndSortRequest {
    store_id?: string;
    phone?: string;
    provider_name?: string;
    date_from?: string;
    date_to?: string;
    status?: string;
}