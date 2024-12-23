import { SelectProps } from "antd";
import commonApi from "../apis/common.api";
import { IUnit } from "../interfaces/common";
import { IProperty } from "../interfaces/property";


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

export const setExportType = async () => {
  var value = getLocalStorage('export_types');
  if (value == null || value === undefined || (value && value.length < 0)) {
    const response = commonApi.getProperties("EXPORT_TYPE")
    setLocalStorage('export_types', (await response).data)
  }
}

export const setImportType = async () => {
  var value = getLocalStorage('import_types');
  if (value == null || value === undefined || (value && value.length < 0)) {
    const response = commonApi.getProperties("IMPORT_TYPE")
    setLocalStorage('import_types', (await response).data)
  }
}

export const setPaymentMethods = async () => {
  var value = getLocalStorage('pay_menthods');
  if (value == null || value === undefined || (value && value.length < 0)) {
    const response = commonApi.getProperties("PAY_METHOD")
    setLocalStorage('pay_menthods', (await response).data)
  }
}

export const setInvSource = async () => {
  var value = getLocalStorage('inv_sources');
  if (value == null || value === undefined || (value && value.length < 0)) {
    const response = commonApi.getProperties("INVOICE_SOURCE")
    setLocalStorage('inv_sources', (await response).data)
  }
}

export const setUnits = async () => {
  var value = getLocalStorage('units');
  if (value == null || value === undefined || (value && value.length < 0)) {
    const response = commonApi.getUnits()
    setLocalStorage('units', (await response).data)
  }
}

export const getListOption = <T>(key: string, keyValue: keyof T, keyLabel: keyof T): SelectProps<string>['options'] => {
  const list = getLocalStorage(key);

  return list && list?.map((item: T) => ({
    value: item[keyValue],
    label: item[keyLabel],
  }));
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

export const getListCommonSettingOption = () => {
  return getListOption<IUnit>('units', 'unit_id', 'unit_name');
}