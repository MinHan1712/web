import { IPageResponse, IResponse } from "../interfaces/common";
import { IDrgInvProductResponse, IInvoiceImportResponse } from "../interfaces/inventoryImport";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import privateClient from "./clients/private.client";

const endpoint = {
  getList: '/inventory/import/search',
  getListInvProduct: '/inventory/products',
  update: `provider`,
  create: 'inventory',
  cancel: (id: any) => `/inventory/cancel?import_id=${id}`
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
  getListInvProduct: async (params: any): Promise<IPageResponse<IDrgInvProductResponse[]>> => {
    try {
      const response = await privateClient.post<IPageResponse<IDrgInvProductResponse[]>>(
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
        endpoint.create,
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