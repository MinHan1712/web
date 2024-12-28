import { IPageResponse, IResponse } from "../interfaces/common";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import privateClient from "./clients/private.client";

const providerEndpoint = {
	getList: 'provider/search',
	update: `provider`,
	delete: (id: any) => `/provider/delete?id=${id}`
};

const providerApi = {
	getList: async (params: any): Promise<IPageResponse<IProviderResponse[]>> => {
		try {
			const response = await privateClient.post<IPageResponse<IProviderResponse[]>>(
				providerEndpoint.getList,
				// params depends BE to update params for suit cab be obj, ary, etc...
				params
			);
			// console.log(response);
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
			console.log(response);
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
			console.log(response);
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
			console.log(response);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};


export default providerApi;