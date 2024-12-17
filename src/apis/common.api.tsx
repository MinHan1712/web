import { IPageResponse } from "../interfaces/common";
import { IProperty } from "../interfaces/property";
import privateClient from "./clients/private.client";

const endpoint = {
  getListProperties: '/api/inventory/type',
};

const commonApi = {
  getProperties: async (): Promise<IPageResponse<Map<string, IProperty[]>>> => {
    try {
      const response = await privateClient.post<IPageResponse<Map<string, IProperty[]>>>(
        endpoint.getListProperties,
      );
      console.log(response);
      localStorage.setItem("properties", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};


export default commonApi;