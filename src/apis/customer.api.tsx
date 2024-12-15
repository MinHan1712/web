import { IPageResponse, IResponse } from "../interfaces/common";
import { ICustomerResponse } from "../interfaces/customer";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import privateClient from "./clients/private.client";

const endPoint = {
	getList: 'customer/search',
	update: `customer`,
};

const customerApi = {
	getList: async (params: any): Promise<IPageResponse<ICustomerResponse[]>> => {
		try {
			const response = await privateClient.post<IPageResponse<ICustomerResponse[]>>(
				endPoint.getList,
				// params depends BE to update params for suit cab be obj, ary, etc...
				params
			);
			// console.log(response);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	// remove: async ({ id }: { id: number }): Promise<IResponse[]>> => {
	// 	try {
	// 		const response = await privateClient.delete<IResponse<IResponseUser[]>>(
	// 			userEndpoint.removeUser({ id })
	// 		);
	// 		return response.data;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// },
	create: async (params: any): Promise<IResponse<ICustomerResponse>> => {
		try {
			const response = await privateClient.post<IResponse<ICustomerResponse>>(
				endPoint.update,
				params
			);
			console.log(response);
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
			console.log(response);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};


export default customerApi;