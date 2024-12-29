import { IPageResponse, IResponse } from "../interfaces/common";
import { IDrugInvSummaryResponse } from "../interfaces/summaryInvoice";
import privateClient from "./clients/private.client";

const endpoint = {
  getList: '/summary/search',
  create: '/summary',
  update: `summary`,
  cancel: (id: any) => `/summary/cancel?import_id=${id}`
};

const invoiceSummaryApi = {
  getList: async (params: any): Promise<IPageResponse<IDrugInvSummaryResponse[]>> => {
    try {
      const response = await privateClient.post<IPageResponse<IDrugInvSummaryResponse[]>>(
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
  create: async (params: any): Promise<IResponse<IDrugInvSummaryResponse>> => {
    try {
      const response = await privateClient.post<IResponse<IDrugInvSummaryResponse>>(
        endpoint.update,
        // params depends BE to update params for suit cab be obj, ary, etc...
        params
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};


export default invoiceSummaryApi;