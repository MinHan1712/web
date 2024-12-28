import { IPageResponse, IResponse } from "../interfaces/common";
import { ILoginResponse } from "../interfaces/login";
import { IProperty } from "../interfaces/property";
import { IRoleInfoListMenu } from "../interfaces/role";
import privateClient from "./clients/private.client";

const endpoint = {
  getListProperties: (type: any) => `/inventory/type?type=${type}`,
  getListUnits: () => `/units/standard`,
  getListRole: () => `/role/menu`,
  login: () => 'login',
  register: () => 'store/create',
};

const commonApi = {
  getProperties: async (type: string): Promise<IResponse<IPageResponse<IProperty[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IProperty[]>>>(
        endpoint.getListProperties(type),
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUnits: async (): Promise<IResponse<IPageResponse<IProperty[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IProperty[]>>>(
        endpoint.getListUnits(),
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRole: async (): Promise<IResponse<IPageResponse<IRoleInfoListMenu[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IRoleInfoListMenu[]>>>(
        endpoint.getListRole(),
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (params: any): Promise<IResponse<ILoginResponse>> => {
    try {
      const response = await privateClient.get<IResponse<ILoginResponse>>(
        endpoint.login(),
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  registerStore: async (params: any): Promise<IResponse<ILoginResponse>> => {
    try {
      const response = await privateClient.get<IResponse<ILoginResponse>>(
        endpoint.register(),
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default commonApi;