import { IPageResponse, IResponse } from "../interfaces/common";
import { IDrugGroupResponse } from "../interfaces/drugGroup";
import privateClient from "./clients/private.client";

const endpoint = {
  url: 'product/group',
  delete: (id: any) => `product/group?drug_group_id=${id}`
};

const drgGroupApi = {
  get: async (): Promise<IResponse<IPageResponse<IDrugGroupResponse[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IDrugGroupResponse[]>>>(
        endpoint.url
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (params: any): Promise<IResponse<IDrugGroupResponse>> => {
    try {
      const response = await privateClient.delete<IResponse<IDrugGroupResponse>>(
        endpoint.delete(params)
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (params: any): Promise<IResponse<IDrugGroupResponse>> => {
    try {
      const response = await privateClient.post<IResponse<IDrugGroupResponse>>(
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
  update: async (params: any): Promise<IResponse<IDrugGroupResponse>> => {
    try {
      const response = await privateClient.put<IResponse<IDrugGroupResponse>>(
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


export default drgGroupApi;