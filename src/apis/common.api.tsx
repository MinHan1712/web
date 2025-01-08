import { IPageResponse, IResponse } from "../interfaces/common";
import { ILoginResponse } from "../interfaces/login";
import { IDrugDescription, IProperty } from "../interfaces/property";
import { IGroups } from "../interfaces/role";
import privateClient from "./clients/private.client";

const endpoint = {
  getListProperties: (type: any) => `/inventory/type?type=${type}`,
  getListUnits: () => `/units/standard`,
  getListRole: () => `/user/role`,
  login: () => 'login',
  register: () => 'store/create',
  description: () => 'product/description',
};

const commonApi = {
  getProperties: async (type: string): Promise<IResponse<IPageResponse<IProperty[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IProperty[]>>>(
        endpoint.getListProperties(type),
      );
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
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getDrugDescription: async (): Promise<IResponse<IPageResponse<IDrugDescription[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IDrugDescription[]>>>(
        endpoint.description(),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRole: async (): Promise<IResponse<IPageResponse<IGroups[]>>> => {
    try {
      const response = await privateClient.get<IResponse<IPageResponse<IGroups[]>>>(
        endpoint.getListRole(),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (params: any): Promise<IResponse<ILoginResponse>> => {
    try {
      const response = await privateClient.post<IResponse<ILoginResponse>>(
        endpoint.login(),
        params
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  registerStore: async (params: any): Promise<IResponse<ILoginResponse>> => {
    try {
      const response = await privateClient.post<IResponse<ILoginResponse>>(
        endpoint.register(),
        params
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default commonApi;