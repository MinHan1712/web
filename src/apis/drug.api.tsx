import { IPageResponse, IResponse } from "../interfaces/common";
import { IDrugInvPageRequest, IDrugResponse } from "../interfaces/drug";
import privateClient from "./clients/private.client";

const endPoint = {
	getList: 'product/list',
	getInv: (request: IDrugInvPageRequest) => `product//list/inv?page=${request.page}&size=${request.size}&drug_name=${request.drug_name || ''}&provider_id=${request.provider_id || ''}`,
	create: 'product/create',
	update: `product/info`,
	description: 'product/description',
};

const drugApi = {
	getList: async (params: any): Promise<IResponse<IPageResponse<IDrugResponse[]>>> => {
		try {
			const response = await privateClient.post<IResponse<IPageResponse<IDrugResponse[]>>>(
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
	getListInv: async (params: any): Promise<IResponse<IPageResponse<IDrugResponse[]>>> => {
		try {
			const response = await privateClient.get<IResponse<IPageResponse<IDrugResponse[]>>>(
				endPoint.getInv(params),
			);
			// console.log(response);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	create: async (params: any): Promise<IResponse<IDrugResponse>> => {
		try {
			const response = await privateClient.post<IResponse<IDrugResponse>>(
				endPoint.create,
				params
			);
			console.log(response);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	update: async (params: any): Promise<IResponse<IDrugResponse>> => {
		try {
			const response = await privateClient.put<IResponse<IDrugResponse>>(
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


export default drugApi;