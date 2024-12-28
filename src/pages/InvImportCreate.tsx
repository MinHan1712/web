import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Empty, Flex, Form, Input, Modal, notification, Select, SelectProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceApi from "../apis/invoice.api";
import providerApi from "../apis/provider.api";
import '../assets/css/style.css';
import InvImportCreateTable from "../components/Invoice/InvImportCreateTable";
import ProviderCreate from "../components/provider/ProviderCreate";
import { formItemLayout, selectPageSize, vat } from "../constants/general.constant";
import { ICreateInvImport, IDrgInvProductResponse, IImportInventoryCreate } from "../interfaces/inventoryImport";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import routes from "../router";
import ProductCreate from "../components/product/ProductCreate";
import { getListImportTypeOption, getListPayMenthodsOption } from "../utils/local";
import { UserContextType } from "./InvExportCreate";
import { IDrugPageRequest, IDrugResponse } from "../interfaces/drug";
import drugApi from "../apis/drug.api";

const UserContext = createContext<UserContextType | undefined>(undefined);
export const useUserContextImport = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return context;
};
const InvImportCreate: React.FC = () => {
	const [form] = Form.useForm<IImportInventoryCreate>();
	const { confirm } = Modal;

	const [optionsProvider, setOptionsProvider] = useState<SelectProps<string>['options']>([]);
	const [optionPaymentMethods, setOptionPaymentMethods] = useState<SelectProps<string>['options']>([]);
	const [optionsImportType, setOptionsImportType] = useState<SelectProps<string>['options']>([]);

	const [key, setKey] = useState(0);
	const [isDebt, setIsDebt] = useState(false);
	const [openProvider, setOpenProvider] = useState(false);
	const [openProduct, setOpenProduct] = useState(false);


	const [loading, setLoading] = useState(false);
	const [loadingScreen, setLoadingScreen] = useState(false);

	const navigate = useNavigate();

	const [productReq, setProductReq] = useState<IDrugPageRequest>({
		page: 1,
		size: 20
	});

	const [productRes, setProductRes] = useState<IDrugResponse[]>([]);

	const [invImportCreateReq, setInvImportCreateReq] = useState<ICreateInvImport>({
		info: {
		},
		products: []
	});

	useEffect(() => {
		setOptionsImportType(getListImportTypeOption);
		setOptionPaymentMethods(getListPayMenthodsOption);

		getListProduct();
		getListProvider();
	}, []);

	const createInvImport = () => {
		setLoadingScreen(true);
		const response = invoiceApi.create(invImportCreateReq);
		console.log(response)
		setLoadingScreen(false);
	}
//TODO
	const triggerFormEvent = (value: IImportInventoryCreate) => {
		console.log(value, invImportCreateReq);
		value = {
			...value,
			amount: invImportCreateReq.info.amount,
			amount_debt: invImportCreateReq.info.amount_debt,
			amt_total: invImportCreateReq.info.amt_total,
			process_date: value.process_date ? dayjs(value.process_date, "YYYY-MM-DD").format("YYYY-MM-DD") : undefined,
			discount_amount: value.discount_amount || 0,
			discount_vat: value.discount_vat || 0,
			amount_paid: value.amount_paid && value.amount_paid > 0 ? value.amount_paid : value.amt_total,
			vat: value.vat || 0
		}

		console.log(value);
		setInvImportCreateReq({
			...invImportCreateReq,
			info: {
				amount: invImportCreateReq.info.amount,
				amount_debt: invImportCreateReq.info.amount_debt,
				amt_total: invImportCreateReq.info.amt_total,
				process_date: value.process_date,
				discount_amount: value.discount_amount || 0,
				discount_vat: value.discount_vat || 0,
				amount_paid: value.amount_paid && value.amount_paid > 0 ? value.amount_paid : value.amt_total,
				vat: value.vat || 0,
				import_type: value.import_type,
				note: value.note,
				provider_id: value.provider_id,
				pay_method: value.pay_method,
				classification: false
			}
		});

		confirmCreateInvExport();

		console.log(invImportCreateReq);
	}

	const handleCreateReceipt = () => {
		navigate({
			pathname: routes[2].path,
		});
	};

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

	const getListProduct = async () => {
		setLoading(true);
		try {
			const response = await drugApi.getList(productReq);
			console.log(response)

			// if (response.meta[0].code !== API_STATUS.SUCCESS) {
			// 	//error
			// 	return;
			// }

			setProductRes(prevState => [...prevState, ...response.data]);
		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	const addNewRowdetail = (value: IDrugResponse) => {
		console.log(value);
		if (value) {
			var units = value.drug_units && value.drug_units?.length > 0 && value.drug_units[0];
			var data = {
				inventory_detail_id: '',
				drug_id: value.drug_id,
				drug_name: value.drug_name,
				inventory_id: '',
				lot: '',
				dosage: '',
				quantity: 0,
				price: units && units.import_price || 0,
				unit_id: units && units?.unit_id || '',
				unit_parent_id: units && units?.unit_parent_id || '',
				exp_date: '',
				vat_percent: value.vat_percent || 0,
				discount_amount: 0,
				drug_units: value.drug_units,
				discount_unit: 0,
				total_amount: 0,
				cur_price: units && units?.price || 0
			};
			setKey(key + 1);
			setInvImportCreateReq({
				...invImportCreateReq,
				products: [...invImportCreateReq.products, data]
			});

		}
	}

	const onScrollSelectProduct = (event: any) => {
		var target = event.target
		if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
			setProductReq({
				...productReq,
				page: productReq.page || 1 + 1,
			})
			target.scrollTo(0, target.scrollHeight);
			getListProduct();
		}
	}

	const confirmDeleteCellToTable = (key: number, index: number) => {
		console.log(key, index, invImportCreateReq);
		invImportCreateReq.products.splice(index, index);
		if (invImportCreateReq.products.length == 0) setKey(0);
		console.log(invImportCreateReq);
		setInvImportCreateReq(invImportCreateReq);
	}

	const confirmCreateInvExport = () => {
		var errorListInvDetail = invImportCreateReq.products.filter(item => item.quantity == 0)
		if (errorListInvDetail && errorListInvDetail.length > 0) {
			notification["error"]({
				message: "Thông báo",
				description: 'Vui lòng nhập số lượng thuốc',
			});
			return;
		}

		confirm({
			title: 'Bạn có đồng ý nhập kho?',
			okText: "Đồng ý",
			cancelText: 'Hủy',
			async onOk() {
				try {
					createInvImport();
				} catch (e) {
					notification["error"]({
						message: "Thông báo",
						description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
					});
				}
			}, onCancel() { },
		});
	}

	return (
		<>
			<UserContext.Provider value={{ invImportCreateReq, setInvImportCreateReq }}>
				<Flex gap="middle" justify="space-between" align={'start'} style={{ width: '100%' }} >
					<Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '70%' }}>
						<Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
							<Select
								className="d-flex w-100 form-select-search "
								style={{ minHeight: '30px' }}
								size="middle"
								optionLabelProp="label"
								onPopupScroll={onScrollSelectProduct}
								loading={loading}
								onSelect={(e: string) => {
									addNewRowdetail(productRes.find(x => x.drug_id == e) || { drug_id: '' });
								}}
								notFoundContent={productRes ? <Empty description="Không có dữ liệu" /> : null}
							>
								{productRes?.map((value: IDrugResponse) => (
									<Select.Option key={value.drug_id} value={value.drug_id} label={value.drug_name || ''}>
										<div className="item-search-info-container">
											<div className="drug_info">
												<div className="info_top">
													<h4 className="item-name">
														<span>{value.drug_name || ''}</span>
													</h4>
													<h4 className="item-info-other">{value.drug_code || 0}</h4>
												</div>
												<div className="info_bottom">
													<p className="item-info-other" >{value.package_desc || ''}</p>
													<p className="item-info-other">{value.active_ingredient || ''}</p>
												</div>
											</div>
										</div>
									</Select.Option>
								))}
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
						<InvImportCreateTable confirmDeleteCellToTable={confirmDeleteCellToTable} />
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
											}, ...vat || []]}
											onChange={(e: any) => {
												invImportCreateReq.info.vat = parseInt(e) || 0;
												invImportCreateReq.info.amt_total = ((invImportCreateReq.info.amount || 0) - (invImportCreateReq.info.discount_amount || 0)) * (((invImportCreateReq.info.vat || 0) + 100) / 100);
												setInvImportCreateReq({ ...invImportCreateReq });
											}}
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

												var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;
												// var sum_current = (invImportCreateReq.info.amount || 0) + (invImportCreateReq.info.discount_amount || 0)

												if (value > (invImportCreateReq.info.amount || 0)) {
													notification["error"]({
														message: "Lỗi",
														description: 'Giảm giá không được lớn hơn tổng số tiền',
													});
													return;
												}

												// var discountAmtCurrent = (invImportCreateReq.info.discount_amount || 0);

												invImportCreateReq.info.discount_amount = value;
												invImportCreateReq.info.amt_total = ((invImportCreateReq.info.amount || 0) - (invImportCreateReq.info.discount_amount || 0)) * (1 + (invImportCreateReq.info.vat || 0) / 100);
												// invImportCreateReq.info.amount = (invImportCreateReq.info.amount || 0) + value - discountAmtCurrent;

												if (invImportCreateReq.info.amount_paid && invImportCreateReq.info.amount_paid > 0)
													invImportCreateReq.info.amount_debt = (invImportCreateReq.info.amt_total || 0) - (invImportCreateReq.info.amount_paid || 0);

												setInvImportCreateReq({ ...invImportCreateReq });
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
										<p style={{ fontWeight: "550", fontSize: "14px", color: 'red', textAlign: 'left' }}>{(invImportCreateReq.info.amt_total || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
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
												size="middle"
												placeholder={"Đã thanh toán"}
												name={'amount_paid'}
												id={'amount_paid'}
												value={invImportCreateReq.info.amount_paid}
												addonAfter="đ"
												onChange={(e: any) => {
													var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;
													invImportCreateReq.info.amount_paid = Math.min(invImportCreateReq.info.amount || 0, value);
													invImportCreateReq.info.amount_debt = (invImportCreateReq.info.amt_total || 0) - (invImportCreateReq.info.amount_paid || 0);

													setInvImportCreateReq({ ...invImportCreateReq });
												}}
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
			</UserContext.Provider >
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
					getListProduct();
				}}
			/>
		</>
	);
};

export default InvImportCreate;