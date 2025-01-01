import { IPageResponse, IResponse } from "../interfaces/common";
import { IDrugKindResponse } from "../interfaces/drugKind";
import privateClient from "./clients/private.client";

const endpoint = {
  url: 'product/kind',
  delete: (id: any) => `product/kind?drug_kind_id=${id}`
};

const drgKindApi = {
  getList: async (): Promise<IResponse<IPageResponse<IDrugKindResponse[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IDrugKindResponse[]>>>(
        endpoint.url,
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (params: any): Promise<IResponse<IDrugKindResponse>> => {
    try {
      const response = await privateClient.delete<IResponse<IDrugKindResponse>>(
        endpoint.delete(params)
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (params: any): Promise<IResponse<IDrugKindResponse>> => {
    try {
      const response = await privateClient.post<IResponse<IDrugKindResponse>>(
        endpoint.url,
        // params depends BE to update params for suit cab be obj, ary, etc...
        params
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (params: any): Promise<IResponse<IDrugKindResponse>> => {
    try {
      const response = await privateClient.put<IResponse<IDrugKindResponse>>(
        endpoint.url,
        params
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default drgKindApi;