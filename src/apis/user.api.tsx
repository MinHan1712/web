import { IPageResponse, IResponse } from "../interfaces/common";
import { IUserWithRoleResponse } from "../interfaces/userManager";
import privateClient from "./clients/private.client";

const endpoint = {
  getList: 'employee',
  update: `/user/update`,
  create: `/user/create`,
  delete: (id: any) => `/user/delete?login=${id}`
};

const userApi = {
  get: async (params: any): Promise<IPageResponse<IUserWithRoleResponse[]>> => {
    try {
      const response = await privateClient.post<IPageResponse<IUserWithRoleResponse[]>>(
        endpoint.getList,
        params
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (params: any): Promise<IResponse<IUserWithRoleResponse>> => {
    try {
      const response = await privateClient.post<IResponse<IUserWithRoleResponse>>(
        endpoint.create,
        // params depends BE to update params for suit cab be obj, ary, etc...
        params
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (params: any): Promise<IResponse<IUserWithRoleResponse>> => {
    try {
      const response = await privateClient.post<IResponse<IUserWithRoleResponse>>(
        endpoint.update,
        params
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (params: any): Promise<IResponse<IUserWithRoleResponse>> => {
    try {
      const response = await privateClient.delete<IResponse<IUserWithRoleResponse>>(
        endpoint.delete(params)
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default userApi;