import { IPageResponse, IResponse } from "../interfaces/common";
import { IStoreResponse } from "../interfaces/store";
import { IUserWithRoleResponse } from "../interfaces/userManager";
import privateClient from "./clients/private.client";

const endpoint = {
  getList: 'store/all',
  update: `/store/update`,
};

const storeApi = {
  get: async (): Promise<IResponse<IStoreResponse>> => {
    try {
      const response = await privateClient.get<IResponse<IStoreResponse>>(
        endpoint.getList
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (params: any): Promise<IResponse<IStoreResponse>> => {
    try {
      const response = await privateClient.put<IResponse<IStoreResponse>>(
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


export default storeApi;