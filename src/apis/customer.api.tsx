import { IPageResponse, IResponse } from "../interfaces/common";
import { ICustomerResponse } from "../interfaces/customer";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import privateClient from "./clients/private.client";

const endPoint = {
	getList: 'customer/search',
	update: `customer`,
};

const customerApi = {
	getList: async (params: any): Promise<IResponse<IPageResponse<ICustomerResponse[]>>> => {
		try {
			const response = await privateClient.post<IResponse<IPageResponse<ICustomerResponse[]>>>(
				endPoint.getList,
				// params depends BE to update params for suit cab be obj, ary, etc...
				params
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	create: async (params: any): Promise<IResponse<ICustomerResponse>> => {
		try {
			const response = await privateClient.post<IResponse<ICustomerResponse>>(
				endPoint.update,
				params
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	update: async (params: any): Promise<IResponse<ICustomerResponse>> => {
		try {
			const response = await privateClient.put<IResponse<ICustomerResponse>>(
				endPoint.update,
				params
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};


export default customerApi;