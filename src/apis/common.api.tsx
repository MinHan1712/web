import { IPageResponse, IResponse } from "../interfaces/common";
import { IProperty } from "../interfaces/property";
import privateClient from "./clients/private.client";

const endpoint = {
  getListProperties: (type: any) => `/inventory/type?type=${type}`,
  getListUnits: () => `/units/standard`
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
  }
};


export default commonApi;