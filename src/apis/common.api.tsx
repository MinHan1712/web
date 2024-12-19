import { IPageResponse } from "../interfaces/common";
import { IProperty } from "../interfaces/property";
import privateClient from "./clients/private.client";

const endpoint = {
  getListProperties: (type: any) => `/api/inventory/type?type=${type}`,
};

const commonApi = {
  getProperties: async (type: string): Promise<IPageResponse<IProperty[]>> => {
    try {
      const response = await privateClient.get<IPageResponse<IProperty[]>>(
        endpoint.getListProperties(type),
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};


export default commonApi;