import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Empty, Flex, Form, Input, Select, SelectProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
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
import { getListImportTypeOption, getListPayMenthodsOption } from "../utils/local";

const InvImportCreate: React.FC = () => {
	const [form] = Form.useForm<IImportInventoryCreate>();

	const [optionsProvider, setOptionsProvider] = useState<SelectProps<string>['options']>([]);
	const [optionPaymentMethods, setOptionPaymentMethods] = useState<SelectProps<string>['options']>([]);
	const [optionsImportType, setOptionsImportType] = useState<SelectProps<string>['options']>([]);

	const [isDebt, setIsDebt] = useState(false);
	const [openProvider, setOpenProvider] = useState(false);
	const [openProduct, setOpenProduct] = useState(false);


	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ inventory_id: '0' });
	const [isReload, setIsReload] = useState(false);
	const [provides, setProvider] = useState<SelectProps<string>['options']>([]);
	const navigate = useNavigate();


	const [invImportCreateReq, setInvImportCreateReq] = useState<ICreateInvImport>({
		info: {
		},
		products: []
	});

	useEffect(() => {
		setOptionsImportType(getListImportTypeOption);
		setOptionPaymentMethods(getListPayMenthodsOption);

		getListProvider();
	}, []);

	const getCreateInvImport = async () => {
		setLoading(true);
		try {
			const response = await invoiceApi.create(invImportCreateReq);
			console.log(response)

			// if (response.meta[0].code !== API_STATUS.SUCCESS) {
			// 	//error
			// 	return;
			// }

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

	const handleCreateReceipt = () => {
		navigate({
			pathname: routes[2].path,
		});
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

			setOptionsProvider(response.data.data.map((provider: IProviderResponse) => {
				return {
					value: provider.provider_id,
					label: provider.provider_name
				}
			}));


		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	// const getListProduct = async () => {
	// 	setLoading(true);
	// 	try {
	// 		const response = await invoiceApi.getListInvProduct(invProductReq);
	// 		console.log(response)

	// 		// if (response.meta[0].code !== API_STATUS.SUCCESS) {
	// 		// 	//error
	// 		// 	return;
	// 		// }
	// 		if (response.data !== undefined && response.data != null && response.data.length > 0) {
	// 			setProductRes(prevState => [...prevState, ...response.data]);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	} finally { setLoading(false); }
	// }

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
						<Select
							className="d-flex w-100 form-select-search "
							style={{ minHeight: '30px' }}
							size="middle"
							optionLabelProp="label"
							loading={loading}
						>
						</Select>
						<Button
							className="button btn-add d-flex flex-row justify-content-center align-content-center"
							type="primary"
							onClick={() => setOpenProduct(true)}
						>
							<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
							<span>Thuốc mới</span>
						</Button>
					</Flex>
					<InvImportCreateTable />
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
									name={'provider_id'}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Tên NCC</span>
									}
								>
									<Flex>
										<Select
											showSearch
											allowClear={true}
											optionFilterProp="children"
											options={optionsProvider}
											placeholder="Tìm nhà cung cấp"
											id={'provider_id'}
											filterOption={(input, option) =>
												(option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
											}
											value={invImportCreateReq.info.provider_id}
											notFoundContent={optionsProvider ? <Empty description="Không tìm thấy dữ liệu" /> : null}
										/>
										<Button
											className="button btn-add d-flex flex-row justify-content-center align-content-center p-2"
											type="primary"
											onClick={() => setOpenProvider(true)}
										>
											<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
										</Button>
									</Flex>

								</Form.Item>

							</div>
							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									labelAlign={"left"}
									name={'pay_method'}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Thanh toán</span>
									}
								>
									<Select
										className="d-flex"
										size="middle"
										id={'pay_method'}
										placeholder="Thanh toán"
										value={invImportCreateReq.info.pay_method}
										options={[{
											value: '',
											label: 'Tất cả'
										}, ...optionPaymentMethods || []]}
									/>
								</Form.Item>
							</div>
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
										}, ...optionsImportType || []]}
									/>
								</Form.Item>
							</div>
							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									labelAlign={"left"}
									name={'vat'}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>VAT</span>
									}
								>
									<Select
										className="d-flex"
										size="middle"
										id={'vat'}
										placeholder="vat"
										value={invImportCreateReq.info.vat}
										options={[{
											value: '',
											label: 'Tất cả'
										}, ...vat || []]} //TODO
									/>
								</Form.Item>
							</div>
							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									labelAlign={"left"}
									name={'discount_amount'}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Giảm giá</span>
									}
								>
									<Input
										size="middle"
										min={0}
										name='discount_amount'
										style={{ marginBottom: "8px" }}
										value={invImportCreateReq.info.discount_amount}
										addonAfter="đ"
										onChange={(e: any) => {
											// var value = parseFloat(e?.target?.value.replace(/,/g, ''));
											// var sum_current = (importInvCreateInfo.amount || 0) + (importInvCreateInfo.discount_amount || 0)
											// value = value ? value : 0;
											// if (value > sum_current) {
											// 	showMessage("error", 'Giảm giá không được lớn hơn tổng số tiền', 'Lỗi');
											// 	return;
											// }

											// handelChangeDiscountAmount('discount_amount', value);
										}}
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
							<div style={{ width: '100%' }}>
								<Form.Item
									{...formItemLayout}
									name='is_amount_debt'
									labelAlign={"left"}
									label={
										<span style={{ fontWeight: "550", fontSize: "14px" }}>Ghi nợ</span>
									}
								>
									<Checkbox disabled={invImportCreateReq.info.amount === 0} onChange={(e) => setIsDebt(e.target.checked)}></Checkbox>
								</Form.Item>
							</div>
							{isDebt ? <>
								<div style={{ width: '100%' }}>
									<Form.Item
										{...formItemLayout}
										labelAlign={"left"}
										name={'amount_paid'}
										label={
											<span style={{ fontWeight: "550", fontSize: "14px" }}>Đã thanh toán</span>
										}
									>
										<Input
											className="form-input d-flex"
											size="middle"
											placeholder={"Đã thanh toán"}
											name={'amount_paid'}
											id={'amount_paid'}
											value={invImportCreateReq.info.amount_paid}
										/>
									</Form.Item>

								</div>
								<div style={{ width: '100%' }}>
									<Form.Item
										{...formItemLayout}
										name='amount_debt'
										labelAlign={"left"}
										label={
											<span style={{ fontWeight: "550", fontSize: "14px" }}>Còn lại</span>
										}
									>
										<p style={{ fontWeight: "550", fontSize: "14px", color: 'red', textAlign: 'left' }}>{(invImportCreateReq.info.amount_debt || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
									</Form.Item>
								</div>
							</> : ""
							}
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

export default InvImportCreate;