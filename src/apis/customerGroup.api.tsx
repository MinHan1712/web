import { IPageResponse, IResponse } from "../interfaces/common";
import { ICustomerGroupPageRequest, ICustomerGroupResponse, ICustomerGroupUpdate } from "../interfaces/customerGroup";
import privateClient from "./clients/private.client";

const endPoint = {
	getList: (request: ICustomerGroupPageRequest) => `customer/group/search?page=${request.page}&&size=${request.size}&&customer_group_name=${request.customer_group_name ? request.customer_group_name : ''}&&customer_group_type=${request.customer_group_type ? request.customer_group_type : ''}`,
	update: `customer/group`,
	remove: (id: string) => `customer/group?customer_group_id=${id}`,
};

const customerGroupApi = {
	getList: async (params: ICustomerGroupPageRequest): Promise<IPageResponse<ICustomerGroupResponse[]>> => {
		// getList: async (params: ICustomerGroupPageRequest): Promise<IResponse<IPageResponse<ICustomerGroupResponse[]>>> => {
		try {
			const response = await privateClient.get<IPageResponse<ICustomerGroupResponse[]>>(
				endPoint.getList(params)
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	create: async (params: any): Promise<IResponse<ICustomerGroupResponse>> => {
		try {
			const response = await privateClient.post<IResponse<ICustomerGroupResponse>>(
				endPoint.update,
				params
			);
			console.log(response);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	update: async (params: any): Promise<IResponse<ICustomerGroupResponse>> => {
		try {
			const response = await privateClient.put<IResponse<ICustomerGroupResponse>>(
				endPoint.update,
				params
			);
			console.log(response);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	remove: async (id: string): Promise<IResponse<ICustomerGroupResponse[]>> => {
		try {
			const response = await privateClient.delete<IResponse<ICustomerGroupResponse[]>>(
				endPoint.remove(id)
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};


export default customerGroupApi;