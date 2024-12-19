import commonApi from "../apis/common.api";
import { IProperty } from "../interfaces/property";

// export const getExportType = async (): Promise<IProperty[]> => {
//   var exportType = localStorage.getItem('exportType') || [];

//   if (exportType && exportType.length < 1) {
//     const response = commonApi.getProperties("EXPORT_TYPE")
//     localStorage.setItem('export_type', JSON.stringify(response));
//     return (await response).data || [];
//   }

//   return exportType || [];
// }