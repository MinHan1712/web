import { IPageResponse, IResponse } from "../interfaces/common";
import { IDrgInvProductResponse, IInvoiceImportResponse } from "../interfaces/inventoryImport";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import privateClient from "./clients/private.client";

const endpoint = {
  getList: '/inventory/import/search',
  getListInvProduct: '/inventory/products',
  update: `provider`,
  create: 'inventory',
  cancel: (id: any, type: string) => `/inventory/cancel?import_id=${id}&&type=${type}`
};

const invoiceApi = {
  getList: async (params: any): Promise<IResponse<IPageResponse<IInvoiceImportResponse[]>>> => {
    try {
      const response = await privateClient.post<IResponse<IPageResponse<IInvoiceImportResponse[]>>>(
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
  getListInvProduct: async (params: any): Promise<IResponse<IPageResponse<IDrgInvProductResponse[]>>> => {
    try {
      const response = await privateClient.post<IResponse<IPageResponse<IDrgInvProductResponse[]>>>(
        endpoint.getListInvProduct,
        // params depends BE to update params for suit cab be obj, ary, etc...
        params
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  cancel: async (id: any, type: string): Promise<IResponse<IInvoiceImportResponse>> => {
    try {
      const response = await privateClient.get<IResponse<IInvoiceImportResponse>>(
        endpoint.cancel(id, type)
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (params: any): Promise<IResponse<IInvoiceImportResponse>> => {
    try {
      const response = await privateClient.post<IResponse<IInvoiceImportResponse>>(
        endpoint.create,
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