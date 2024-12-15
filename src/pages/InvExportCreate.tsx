import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Empty, Flex, Form, Input, Select, SelectProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceApi from "../apis/invoice.api";
import providerApi from "../apis/provider.api";
import '../assets/css/style.css';
import InvImportCreateTable from "../components/Invoice/InvImportCreateTable";
import ProviderCreate from "../components/provider/ProviderCreate";
import { formItemLayout, selectPageSize, vat } from "../constants/general.constant";
import { ICreateInvImport, IImportInventoryCreate } from "../interfaces/inventoryImport";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import routes from "../router";
import ProductCreate from "../components/product/ProductCreate";
import InvExportCreateTable from "../components/Invoice/InvExportCreateTable";

const InvExportCreate: React.FC = () => {
	const [form] = Form.useForm<IImportInventoryCreate>();
	const [optionsProvider, setOptionsProvider] = useState<SelectProps<string>['options']>([]);
	const [optionPaymentMethods, setOptionPaymentMethods] = useState<SelectProps<string>['options']>([]);
	const [optionsImportType, setOptionsImportType] = useState<SelectProps<string>['options']>([]);
	const [isDebt, setIsDebt] = useState(false);
	const [openProvider, setOpenProvider] = useState(false);
	const [openProduct, setOpenProduct] = useState(false);


	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();


	const [invImportCreateReq, setInvImportCreateReq] = useState<ICreateInvImport>({
		info: {
		},
		products: []
	});

	const getCreateInvImport = async () => {
		setLoading(true);
		try {
			const response = await invoiceApi.create(invImportCreateReq);
			console.log(response)
		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	const triggerFormEvent = (value: IImportInventoryCreate) => {
		console.log(value);
		setInvImportCreateReq({
			...invImportCreateReq,
			info: value
		});

		console.log(invImportCreateReq);

		// get list provider
	}

	let locale = {
		emptyText: (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
		)
	};

	const createInvImport = (formValue: IImportInventoryCreate) => {
		console.log(formValue);
	}

	const getListProvider = async () => {
		setLoading(true);
		try {
			let provider: IProviderPageRequest = {
				page: 0,
				size: 0
			}

			const response = await providerApi.getList(provider);
			console.log(response)

			setOptionsProvider(response.data.map((provider: IProviderResponse) => {
				return {
					value: provider.provider_id,
					label: provider.provider_name
				}
			}));


		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	// useEffect(() => {
	// 	setIsReload(false);
	// 	getListInvImport();
	// 	console.log('request', invImportReq);
	// }, [invImportReq, isReload])

	return (
		<>
			<Flex gap="middle" justify="space-between" align={'start'} style={{ width: '100%' }} >
				<Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '70%' }}>
					<Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
						<h5 style={{ width: '150px', display: 'flex', alignItems: 'center' }}>Thêm sản phẩm</h5>
						<Select
							className="d-flex w-100 form-select-search "
							style={{ minHeight: '30px' }}
							size="middle"
							optionLabelProp="label"
							loading={loading}
						>
						</Select>
					</Flex>
					<InvExportCreateTable />
				</Flex>

				<Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '30%' }}>
					<Form form={form} name="Customer_filter" className="common-form wrapper-form"
						style={{ width: '100%', background: '#fff', padding: '10px' }}
						onFinish={triggerFormEvent}>
						<Flex gap="middle" vertical justify="flex-start" align={'center'}
							style={{ width: '100%', padding: '5px' }}>

							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									labelAlign={"left"}
									name={'process_date'}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày thực tế</span>
									}
								>
									<DatePicker format={"DD/MM/YYYY"}
										value={invImportCreateReq.info.process_date ? dayjs(invImportCreateReq.info.process_date) : dayjs()}
										className="form-input d-flex" size="middle" placeholder='Ngày thực tế' />
								</Form.Item>
							</div>

							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									labelAlign={"left"}
									name={'import_type'}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Loại nhập</span>
									}
								>
									<Select
										className="d-flex"
										size="middle"
										id={'import_type'}
										placeholder="Loại nhập"
										value={invImportCreateReq.info.import_type}
										options={[{
											value: '',
											label: 'Tất cả'
										}, ...optionsImportType || []]} //TODO
									/>
								</Form.Item>
							</div>

							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									name='note'
									labelAlign={"left"}
									style={{ height: 'auto' }}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Ghi chú</span>
									}
								>
									<TextArea
										placeholder="Ghi chú"
										className='note'
										value={invImportCreateReq.info.note}
									/>
								</Form.Item>
							</div>

							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									name='amount'
									labelAlign={"left"}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Tổng giá trị</span>
									}
								>
									<p style={{ fontWeight: "550", fontSize: "14px", color: 'red', textAlign: 'left' }}>{(invImportCreateReq.info.amount || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
								</Form.Item>
							</div>

							<Flex gap="middle" justify="flex-end" align={'center'} style={{ width: '100%' }}>
								<Button
									className="button btn-delete d-flex flex-row justify-content-center align-content-center mb-2"
									type="primary"
								// onClick={onCancel}
								>
									<DeleteOutlined />
									<span>Hủy bỏ</span>
								</Button>
								<Button
									className="button btn-add d-flex flex-row justify-content-center align-content-center mb-2"
									type="primary"
									// disabled={isSettingButtonAdd}
									onClick={() => {
										form.submit();
									}}
								>
									<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
									<span>Nhập kho</span>
								</Button>
							</Flex>
						</Flex>
					</Form>
				</Flex>
			</Flex>

			<ProviderCreate
				open={openProvider}
				onCancel={() => {
					setOpenProvider(false);
					getListProvider();
				}}
			/>

			<ProductCreate
				open={openProduct}
				onCancel={() => {
					setOpenProduct(false);
					// getListProduct();
				}}
			/>
		</>
	);
};

export default InvExportCreate;