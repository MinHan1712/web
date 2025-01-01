import { IPageResponse, IResponse } from "../interfaces/common";
import { IProviderResponse } from "../interfaces/provider";
import privateClient from "./clients/private.client";

const providerEndpoint = {
	getList: 'provider/search',
	update: `provider`,
	delete: (id: any) => `/provider/delete?id=${id}`
};

const providerApi = {
	getList: async (params: any): Promise<IResponse<IPageResponse<IProviderResponse[]>>> => {
		try {
			const response = await privateClient.post<IResponse<IPageResponse<IProviderResponse[]>>>(
				providerEndpoint.getList,
				// params depends BE to update params for suit cab be obj, ary, etc...
				params
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	delete: async (params: any): Promise<IResponse<IProviderResponse>> => {
		try {
			const response = await privateClient.delete<IResponse<IProviderResponse>>(
				providerEndpoint.delete(params)
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	create: async (params: any): Promise<IResponse<IProviderResponse>> => {
		try {
			const response = await privateClient.post<IResponse<IProviderResponse>>(
				providerEndpoint.update,
				// params depends BE to update params for suit cab be obj, ary, etc...
				params
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	update: async (params: any): Promise<IResponse<IProviderResponse>> => {
		try {
			const response = await privateClient.put<IResponse<IProviderResponse>>(
				providerEndpoint.update,
				params
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};


export default providerApi;