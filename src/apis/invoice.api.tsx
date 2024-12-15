import { IPageResponse, IResponse } from "../interfaces/common";
import { IInvoiceImportResponse } from "../interfaces/inventoryImport";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import privateClient from "./clients/private.client";

const endpoint = {
  getList: '/api/inventory/search',
  update: `provider`,
  cancel: (id: any) => `/api/inventory/cancel?import_id=${id}`
};

const invoiceApi = {
  getList: async (params: any): Promise<IPageResponse<IInvoiceImportResponse[]>> => {
    try {
      const response = await privateClient.post<IPageResponse<IInvoiceImportResponse[]>>(
        endpoint.getList,
        // params depends BE to update params for suit cab be obj, ary, etc...
        params
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  remove: async (id: any): Promise<IResponse<IInvoiceImportResponse>> => {
    try {
      const response = await privateClient.delete<IResponse<IInvoiceImportResponse>>(
        endpoint.cancel(id)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (params: any): Promise<IResponse<IInvoiceImportResponse>> => {
    try {
      const response = await privateClient.post<IResponse<IInvoiceImportResponse>>(
        endpoint.update,
        // params depends BE to update params for suit cab be obj, ary, etc...
        params
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (params: any): Promise<IResponse<IInvoiceImportResponse>> => {
    try {
      const response = await privateClient.put<IResponse<IInvoiceImportResponse>>(
        endpoint.update,
        params
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default invoiceApi;