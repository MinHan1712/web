import { SelectProps } from "antd";
import commonApi from "../apis/common.api";
import { IUnit } from "../interfaces/common";
import { IDrugDescription, IProperty } from "../interfaces/property";
import { IGroups } from "../interfaces/role";
import { ILoginResponse } from "../interfaces/login";
import { KEY_LOCAL_STORAGE } from "../constants/general.constant";
import { IDrugKindResponse } from "../interfaces/drugKind";
import { IDrugGroupResponse } from "../interfaces/drugGroup";
import drgKindApi from "../apis/drugKind.api";
import drgGroupApi from "../apis/drugGroup.api";


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

export const getDrugDescription = (): IDrugDescription[] => {
  return getLocalStorage('drg_description')
}

export const getRoles = (): IGroups[] => {
  return getLocalStorage('roles')
}

export const getDrgKind = (): IDrugKindResponse[] => {
  return getLocalStorage('drg_kinds')
}

export const getDrgGroup = (): IDrugGroupResponse[] => {
  return getLocalStorage('drg_groups')
}

export const getStore = (): ILoginResponse => {
  return getLocalStorage('store')
}

export const setAuth = async (value: ILoginResponse) => {
  console.log(value);
  setLocalStorage('store', value);
  setLocalStorage(KEY_LOCAL_STORAGE.AUTHEN, value.token?.replace(/"/g, ''));
}

export const removeStore = () => {
  localStorage.removeItem('store');
  localStorage.removeItem(KEY_LOCAL_STORAGE.AUTHEN);
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

export const setDrugDescription = async () => {
  var value = getLocalStorage('drg_description');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await commonApi.getDrugDescription()
      .then(response => {
        setLocalStorage('drg_description', response.data)
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

export const setDrgKind = async () => {
  var value = getLocalStorage('drg_kinds');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await drgKindApi.getList()
      .then(response => {
        setLocalStorage('drg_kinds', response.data)
      })
      .catch(() => {
      });
  }
}

export const reloadDrgKind = async () => {
  await drgKindApi.getList()
    .then(response => {
      setLocalStorage('drg_kinds', response.data)
    })
    .catch(() => {
    });
}

export const reloadDrgGrop = async () => {
  await drgGroupApi.get()
    .then(response => {
      setLocalStorage('drg_groups', response.data)
    })
    .catch(() => {
    });
}

export const setDrgGroup = async () => {
  var value = getLocalStorage('drg_groups');
  if (value == null || value === undefined || (value && value.length < 0)) {
    await drgGroupApi.get()
      .then(response => {
        setLocalStorage('drg_groups', response.data)
      })
      .catch(() => {
      });
  }
}

export const getListOption = <T>(key: string, keyValue: keyof T, keyLabel: keyof T, keyName: keyof T): SelectProps<string>['options'] => {
  const list = getLocalStorage(key);

  return (list && list?.map((item: T) => ({
    value: item[keyValue],
    label: item[keyLabel],
    name: item[keyName]
  }))) || [];
};



export const getListExportTypeOption = () => {
  return getListOption<IProperty>('export_types', 'unit_cd', 'value', 'updated_user');
};

export const getListImportTypeOption = () => {
  return getListOption<IProperty>('import_types', 'unit_cd', 'value', 'updated_user');
};

export const getListPayMenthodsOption = () => {
  return getListOption<IProperty>('pay_menthods', 'unit_cd', 'value', 'updated_user');
};

export const getListInvSourceOption = () => {
  return getListOption<IProperty>('inv_sources', 'unit_cd', 'value', 'updated_user');
}

export const getListUnitOption = () => {
  return getListOption<IUnit>('units', 'unit_id', 'unit_name', 'updated_user');;
}

export const getListDrgDescription = () => {
  return getListOption<IDrugDescription>('drg_description', 'drug_description_id', 'value', 'updated_user');;
}

export const getListRoleOption = () => {
  return getListOption<IGroups>('roles', 'role_id', 'role_name', 'role_id');
}

export const getListKindOption = () => {
  return getListOption<IDrugKindResponse>('drg_kinds', 'drug_kind_id', 'name', 'drg_store_id');
}

export const getListGroupOption = () => {
  return getListOption<IDrugGroupResponse>('drg_groups', 'drug_group_id', 'name', 'drg_store_id');
}