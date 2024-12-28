export interface ILoginRequest {
    login: string;
    password: string;
    macAddress?: string;
    localIp?: string;
    rememberMe?: boolean;
}

export interface ILoginResponse {
    allUserRoleConfig?: UserRoleInfo[];
    loginId?: string;
    storeId?: string;
    storeName?: string;
    accountId?: string;
    expiresIn?: string;
    userName?: string;
    roleCd?: string;
    token?: string;
    returnMsg?: string;
    returnCode?: string;
}

export interface UserRoleInfo {
    user_id?: string;
    function_id?: string;
    function_code?: string;
    role_code?: string;
    perm_read?: boolean;
    perm_write?: boolean;
    perm_delete?: boolean;
}

export interface IRegisterStore {
    store_id?: string;
    store_name?: string;
    address?: string;
    district?: string;
    city?: string;
    phone?: string;
    email?: string;
    password?: string;
    contact_url?: string;
    license_date?: string;
    tax_no?: string;
    status?: string;
}