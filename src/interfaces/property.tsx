export interface IProperty {
    property_id?: string;
    unit_cd?: string;
    created_date?: string;
    name?: string;
    note?: string;
    value?: string;
    type?: string;
    active_flg?: boolean;
    updated_user?: string;
    updated_date?: string;
}

export interface IDrugDescription {
    drug_description_id?: string;
    description_cd?: string;
    created_date?: string;
    note?: string;
    value?: string;
    active_flg?: boolean;
    updated_user?: string;
    updated_date?: string;
}