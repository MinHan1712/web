import { SelectProps } from "antd";
import commonApi from "../apis/common.api";
import { IUnit } from "../interfaces/common";
import { IProperty } from "../interfaces/property";
import { IRoleInfoListMenu } from "../interfaces/role";
import { ILoginResponse } from "../interfaces/login";
import { KEY_LOCAL_STORAGE } from "../constants/general.constant";


export const parseJSON = <T>(value: string | null): T | string | null => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (e) {
    return value;
  }
};


export const getLocalStorage = (key: string): any => {
  return parseJSON(localStorage.getItem(key));
};


export const setLocalStorage = (key: string, value: any): void => {
  localStorage.setItem(
    key,
    JSON.stringify(value ?? '')
  );
}


export const getExportType = (): IProperty[] => {
  return getLocalStorage('export_types')
}

export const getImportType = (): IProperty[] => {
  return getLocalStorage('import_types')
}

export const getPayMethods = (): IProperty[] => {
  return getLocalStorage('pay_menthods')
}

export const getInvSource = (): IProperty[] => {
  return getLocalStorage('inv_sources')
}

export const getUnits = (): IUnit[] => {
  return getLocalStorage('units')
}

export const getRoles = (): IRoleInfoListMenu[] => {
  return getLocalStorage('roles')
}

export const setAuth = async (value: ILoginResponse) => {
  console.log(value);
  setLocalStorage('store', value);
  setLocalStorage(KEY_LOCAL_STORAGE.AUTHEN, value.token);
}

export const setExportType = async () => {
  var value = getLocalStorage('export_types');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await commonApi.getProperties("EXPORT_TYPE")
      .then(response => {
        setLocalStorage('export_types', response.data)
      })
      .catch(() => {
      });
  }
}

export const setImportType = async () => {
  var value = getLocalStorage('import_types');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await commonApi.getProperties("IMPORT_TYPE")
      .then(response => {
        setLocalStorage('import_types', response.data)
      })
      .catch(() => {
      });
  }
}

export const setPaymentMethods = async () => {
  var value = getLocalStorage('pay_menthods');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await commonApi.getProperties("PAY_METHOD")
      .then(response => {
        setLocalStorage('pay_menthods', response.data)
      })
      .catch(() => {
      });
  }
}

export const setInvSource = async () => {
  var value = getLocalStorage('inv_sources');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await commonApi.getProperties("INVOICE_SOURCE")
      .then(response => {
        setLocalStorage('inv_sources', response.data)
      })
      .catch(() => {
      });
  }
}

export const setUnits = async () => {
  var value = getLocalStorage('units');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await commonApi.getUnits()
      .then(response => {
        setLocalStorage('units', response.data)
      })
      .catch(() => {
      });
  }
}

export const setRoles = async () => {
  var value = getLocalStorage('roles');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await commonApi.getRole()
      .then(response => {
        setLocalStorage('roles', response.data)
      })
      .catch(() => {
      });
  }
}

export const getListOption = <T>(key: string, keyValue: keyof T, keyLabel: keyof T): SelectProps<string>['options'] => {
  const list = getLocalStorage(key);

  return list && list?.map((item: T) => ({
    value: item[keyValue],
    label: item[keyLabel],
  })) || [];
};

export const getListExportTypeOption = () => {
  return getListOption<IProperty>('export_types', 'unit_cd', 'value');
};

export const getListImportTypeOption = () => {
  return getListOption<IProperty>('import_types', 'unit_cd', 'value');
};

export const getListPayMenthodsOption = () => {
  return getListOption<IProperty>('pay_menthods', 'unit_cd', 'value');
};

export const getListInvSourceOption = () => {
  return getListOption<IProperty>('inv_sources', 'unit_cd', 'value');
}

export const getListUnitOption = () => {
  return getListOption<IUnit>('units', 'unit_id', 'unit_name');
}

export const getListRoleOption = () => {
  return getListOption<IRoleInfoListMenu>('roles', 'role_id', 'role_code');
}