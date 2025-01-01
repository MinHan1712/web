import { DeleteOutlined, LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Empty, Flex, Form, Input, Modal, notification, Select, SelectProps, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import drugApi from "../apis/drug.api";
import invoiceApi from "../apis/invoice.api";
import providerApi from "../apis/provider.api";
import '../assets/css/style.css';
import InvImportCreateTable from "../components/Invoice/InvImportCreateTable";
import ProductCreate from "../components/product/ProductCreate";
import ProviderCreate from "../components/provider/ProviderCreate";
import { formItemLayout, vat } from "../constants/general.constant";
import { IDrugPageRequest, IDrugResponse } from "../interfaces/drug";
import { IDrugGroupResponse } from "../interfaces/drugGroup";
import { IDrugKindResponse } from "../interfaces/drugKind";
import { IImportInventoryDetailCreate } from "../interfaces/inventoryDetail";
import { ICreateInvImport, IImportInventoryCreate } from "../interfaces/inventoryImport";
import { IProviderResponse } from "../interfaces/provider";
import { getDrgGroup, getDrgKind, getListDrgDescription, getListGroupOption, getListImportTypeOption, getListKindOption, getListPayMenthodsOption, getListUnitOption } from "../utils/local";
import { InvContextType } from "./InvExportCreate";

const InvImportContext = createContext<InvContextType | undefined>(undefined);

export const UseInvImportContext = (): InvContextType => {
	const context = useContext(InvImportContext);

	if (context === undefined) {
		throw new Error('UseInvImportContext must be used within a UserContextProvider');
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

	const [optionKind, setOptionKind] = useState<SelectProps<string>['options']>([]);
	const [optionGroup, setOptionGroup] = useState<SelectProps<string>['options']>([]);
	const [optionUnit, setOptionUnit] = useState<SelectProps<string>['options']>([]);
	const [listKind, setListKind] = useState<IDrugKindResponse[]>([]);
	const [listGroup, setListGroup] = useState<IDrugGroupResponse[]>([]);
	const [optionDrgDescription, setOptionDrgDescription] = useState<SelectProps<string>['options']>([]);

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
			classification: false
		},
		products: [],
	});

	useEffect(() => {
		setOptionsImportType(getListImportTypeOption);
		setOptionPaymentMethods(getListPayMenthodsOption);

		getListProduct();
		getListProvider();

		setListKind(getDrgKind());
		setListGroup(getDrgGroup());
		setOptionKind(getListKindOption());
		setOptionGroup(getListGroupOption());
		setOptionUnit(getListUnitOption());
		setOptionDrgDescription(getListDrgDescription());
	}, []);

	const createInvImport = async () => {
		setLoadingScreen(true);
		try {
			await invoiceApi.create(invImportCreateReq).then((response) => {
				console.log(response)
				switch (response.meta.code) {
					case 200:
						notification['success']({
							message: "Thông báo",
							description: 'Thêm phiếu nhập kho thành công',
						});
						setInvImportCreateReq({
							info: {
							},
							products: []
						});

						navigate('/kho/nhapkho');
						break;
					default:
						notification['error']({
							message: "Lỗi",
							description: 'Thêm phiếu nhập kho không thành công',
						});
						break;
				}
			})
				.catch(() => {
					notification['error']({
						message: "Lỗi",
						description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
					});
				})

		} catch (err) {
			notification['error']({
				message: "Lỗi",
				description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
			});
			console.log(err);
		} finally { setLoadingScreen(false); }
	}


	const triggerFormEvent = (value: IImportInventoryCreate) => {
		confirmCreateInvExport();
	}

	const getListProvider = async () => {
		setLoading(true);
		try {
			const response = await providerApi.getList({
				page: 0,
				size: 0
			});
			console.log(response)
			if (response.meta.code === 200) {
				setOptionsProvider(response.data.data.map((provider: IProviderResponse) => {
					return {
						value: provider.provider_id,
						label: provider.provider_name
					}
				}));
			} else {
				setOptionsProvider([]);
			}
		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	const getListProduct = async () => {
		setLoading(true);
		try {
			await drugApi.getList(productReq).then((response) => {
				console.log(response)
				switch (response.meta.code) {
					case 200:
						setProductRes(prevState => [...prevState, ...response.data.data]);
						break;
					default:
						notification['error']({
							message: "Lỗi",
							description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
						});
						break;
				}
			})
				.catch(() => {
					notification['error']({
						message: "Lỗi",
						description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
					});
				})
		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	const addNewRowdetail = (value: IDrugResponse) => {
		if (value) {
			var units = value.drug_units && value.drug_units?.length > 0 && value.drug_units[0];
			var data = {
				key: key,
				inventory_detail_id: '',
				drug_id: value.drug_id,
				drug_name: value.drug_name,
				inventory_id: '',
				lot: '',
				quantity: 0,
				price: (units && units.import_price) || 0,
				unit_id: (units && units?.unit_id) || '',
				unit_parent_id: (units && units?.unit_parent_id) || '',
				exp_date: '',
				vat_percent: value.vat_percent || 0,
				discount_amount: 0,
				drug_units: value.drug_units,
				total_amount: 0,
				cur_price: (units && units?.price) || 0,
				type: 'i'
			};
			setKey(key + 1);


			setInvImportCreateReq(prevState => {
				return {
					...prevState,
					products: [...prevState.products, data] // Thêm sản phẩm vào danh sách hiện tại
				};
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

	const confirmDeleteCellToTable = (key: number, index: number, record: IImportInventoryDetailCreate) => {
		const updatedProducts = invImportCreateReq.products.filter(product => product.key !== key);
		var original = (invImportCreateReq.info.amount_original || 0) - (record.total_amount || 0);

		updateAmtInfo(original);

		setInvImportCreateReq((prevState) => ({
			...prevState,
			products: updatedProducts,
		}));
	};

	const confirmCreateInvExport = () => {
		var errorListInvDetail = invImportCreateReq.products.filter(item => item.quantity === 0)
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
				return new Promise<void>((resolve, reject) => {
					createInvImport()
						.then(() => {
							resolve();
						})
						.catch(() => {
							notification['error']({
								message: "Lỗi",
								description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
							});
							resolve();
						});
				});
			},
			onCancel() { },
		});

	}

	const confirmCancelForm = () => {
		confirm({
			title: 'Bạn muốn hủy phiếu nhập kho?',
			okText: "Đồng ý",
			cancelText: 'Hủy',
			async onOk() {
				navigate('/kho/nhapkho')
			},
			onCancel() { },
		});

	}

	const amountTotal = (amtOrigin?: number, discount?: number, vat?: number) => {
		return Math.max(Math.round(((amtOrigin || 0) - (discount || 0)) * (1 + (vat || 0) / 100)), 0);
	}

	const updateAmtInfo = (origin: number) => {
		var amount = amountTotal(origin, invImportCreateReq.info.discount_amount, invImportCreateReq.info.vat);
		invImportCreateReq.info.amount_original = origin;
		invImportCreateReq.info.amount = amount;

		invImportCreateReq.info.discount_amount = Math.min(amount, (invImportCreateReq.info.discount_amount || 0));
		invImportCreateReq.info.amount_paid = isDebt ? Math.min(amount, (invImportCreateReq.info.amount_paid || 0)) : amount;
		invImportCreateReq.info.amount_debt = isDebt ? amount - (invImportCreateReq.info.amount_paid || 0) : 0;

		setInvImportCreateReq({ ...invImportCreateReq });
	}


	return (
		<>
			{loadingScreen ? (
				<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
			) : (<>
				<InvImportContext.Provider value={{ invImportCreateReq, setInvImportCreateReq }}>
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
										addNewRowdetail(productRes.find(x => x.drug_id === e) || { drug_id: '' });
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
							<InvImportCreateTable confirmDeleteCellToTable={confirmDeleteCellToTable} updateAmtInfo={updateAmtInfo} />
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
													onChange={(e: any) => {
														invImportCreateReq.info.provider_id = e;
													}}
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
												onChange={(e: any) => {
													invImportCreateReq.info.pay_method = e;
												}}
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
												className="form-input d-flex" size="middle" placeholder='Ngày thực tế'
												onChange={(e: any) => {
													invImportCreateReq.info.process_date = e ? e.format("YYYY-MM-DD") : null;
												}} />
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
												onChange={(e: any) => {
													invImportCreateReq.info.import_type = e;
												}}
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
													updateAmtInfo(invImportCreateReq.info.amount_original || 0);
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
												value={(invImportCreateReq.info.discount_amount?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
													updateAmtInfo(invImportCreateReq.info.amount_original || 0);
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
											<p style={{ fontWeight: "550", fontSize: "14px", color: 'red', textAlign: 'left' }}>{(invImportCreateReq.info.amount?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</p>

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
													value={(invImportCreateReq.info.amount_paid?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
													addonAfter="đ"
													onChange={(e: any) => {
														var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;
														invImportCreateReq.info.amount_paid = Math.min(invImportCreateReq.info.amount || 0, value);
														invImportCreateReq.info.amount_debt = (invImportCreateReq.info.amount || 0) - (invImportCreateReq.info.amount_paid || 0);

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
												<p style={{ fontWeight: "550", fontSize: "14px", color: 'red', textAlign: 'left' }}>{(invImportCreateReq.info.amount_debt?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</p>
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
												onChange={(e: any) => {
													invImportCreateReq.info.note = e?.target?.value;
												}}
											/>
										</Form.Item>
									</div>
									<Flex gap="middle" justify="flex-end" align={'center'} style={{ width: '100%' }}>
										<Button
											className="button btn-delete d-flex flex-row justify-content-center align-content-center mb-2"
											type="primary"
											onClick={confirmCancelForm}
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
				</InvImportContext.Provider >
			</>)}
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
					setProductRes([]);
					getListProduct();
				}}
				optionGroup={optionGroup}
				optionKind={optionKind}
				listGroup={listGroup}
				listKind={listKind}
				optionUnit={optionUnit}
				optionDrgDescription={optionDrgDescription}
			/>
		</>
	);
};

export default InvImportCreate;