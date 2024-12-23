import commonApi from "../apis/common.api";
import { IProperty } from "../interfaces/property";

export const parseJSON = <T>(value: string | null): T | string | null => {
	try {
		return value ? JSON.parse(value) : null;
	} catch (e) {
		return value;
	}
};

export const getLocalStorage = (key: string): any  => {

	return parseJSON(localStorage.getItem(key));
};

export const setLocalStorage = (key: string, value: any): void => {
     localStorage.setItem(
          key,
          JSON.stringify(value ?? '')
     );
}

export const getExportType = (): IProperty[] => {
  return getLocalStorage('export_type')

//   if (exportType && exportType.length < 1) {
//     const response = commonApi.getProperties("EXPORT_TYPE")
//     localStorage.setItem('export_type', JSON.stringify(response));
//     return response.data || [];
//   }

//   return exportType || [];
}