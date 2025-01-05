import { DeleteOutlined, LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Empty, Flex, Form, Input, Modal, notification, Select, SelectProps, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns/format";
import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../apis/customer.api";
import customerGroupApi from "../apis/customerGroup.api";
import invoiceApi from "../apis/invoice.api";
import '../assets/css/style.css';
import CustomerCreate from "../components/customer/CustomerCreate";
import InvCustomerCreateTable from "../components/Invoice/InvCustomerCreateTable";
import { formItemLayout, vat } from "../constants/general.constant";
import { ICustomerResponse } from "../interfaces/customer";
import { IImportInventoryDetailCreate } from "../interfaces/inventoryDetail";
import { ICreateInvImport, IDrgInvProductResponse, IDrugInvProductPageRequest, IImportInventoryCreate } from "../interfaces/inventoryImport";
import { getListExportTypeOption, getListPayMenthodsOption, getListUnitOption } from "../utils/local";

export interface InvContextType {
	invImportCreateReq: ICreateInvImport | {
		info: {
			amount: 0,
			amount_original: 0,
			amount_paid: 0
		},
		products: []
	};
	setInvImportCreateReq: React.Dispatch<React.SetStateAction<ICreateInvImport | {
		info: {
			amount: 0,
		},
		products: []
	}>>;
}

const InvCustomerExportContext = createContext<InvContextType | undefined>(undefined);

export const UseInvCustomerExportContext = (): InvContextType => {
	const context = useContext(InvCustomerExportContext);

	if (context === undefined) {
		throw new Error('UseInvCustomerExportContext must be used within a UserContextProvider');
	}

	return context;
};


const InvCustomerCreate: React.FC = () => {
	const [key, setKey] = useState(0);
	const { confirm } = Modal;


	const [loadingScreen, setLoadingScreen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [form] = Form.useForm<IImportInventoryCreate>();
	const [optionsCusGroup, setOptionsCusGroup] = useState<SelectProps<string>['options']>([]);
	const [optionsCustomer, setOptionsCustomer] = useState<SelectProps<string>['options']>([]);
	const [optionPaymentMethods, setOptionPaymentMethods] = useState<SelectProps<string>['options']>([]);
	const [openCustomer, setOpenCustomer] = useState(false);

	const [isDebt, setIsDebt] = useState(false);
	const [invProductReq, setInvProductReq] = useState<IDrugInvProductPageRequest>({
		page: 1,
		size: 20,
		classification: false
	});
	const [productRes, setProductRes] = useState<IDrgInvProductResponse[]>([]);

	const navigate = useNavigate();

	const [invImportCreateReq, setInvImportCreateReq] = useState<ICreateInvImport>({
		info: {
			amount: 0,
			amount_paid: 0,
			classification: true,
			import_type: 'ORD',
			is_bill: true
		},
		products: []
	});


	useEffect(() => {
		getListProduct();
		// setOptionsExportType(getListExportTypeOption);
		// setOptionUnit(getListUnitOption());
		setOptionPaymentMethods(getListPayMenthodsOption);
		getListCustomer();
		getListCustomerGroup();
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
							description: 'Thêm hóa đơn thành công',
						});
						setInvImportCreateReq({
							info: {
							},
							products: []
						});

						navigate('/hoadon');
						break;
					default:
						notification['error']({
							message: "Lỗi",
							description: 'Thêm hóa đơn không thành công',
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
		} finally { setLoadingScreen(false); }
	}

	const getListProduct = async () => {
		setLoading(true);
		try {
			await invoiceApi.getListInvProduct(invProductReq).then((response) => {
				console.log(response)

				if (response.meta.code === 200) {
					setProductRes(prevState => [...prevState, ...response.data.data]);
				}

			})
				.catch(() => {
					// notification['error']({
					// 	message: "Lỗi",
					// 	description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
					// });
				})

		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	const getListCustomer = async () => {
		setLoading(true);

		try {
			await customerApi.getList({ page: 0, size: 0 }).then((response) => {
				console.log(response)
				if (response.meta.code === 200) {
					setOptionsCustomer(response.data.data.map((provider: ICustomerResponse) => {
						return {
							value: provider.customer_id,
							label: provider.customer_name
						}
					}));
				}

			})
				.catch(() => {
					// notification['error']({
					// 	message: "Lỗi",
					// 	description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
					// });
				})

		} catch (err) {
			console.log(err);
		} finally { }
	}

	const getListCustomerGroup = async () => {
		setLoading(true);
		try {
			const response = await customerGroupApi.getList({ page: 0, size: 0 }).then((response) => {
				console.log(response)
				if (response.meta.code === 200) {
					setOptionsCusGroup(response.data && response.data.data.map((item) => ({
						value: item.customer_group_id,
						label: item.customer_group_name,
					})) || []);
				}
			})
				.catch(() => {
				})

		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }

	}


	const onScrollSelectProduct = (event: any) => {
		var target = event.target
		if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
			setInvProductReq({
				...invProductReq,
				page: invProductReq.page || 1 + 1,
			})
			getListProduct();
			target.scrollTo(0, target.scrollHeight)
		}
	}

	const triggerFormEvent = (value: IImportInventoryCreate) => {
		confirmCreateInvExport();
	}

	const addNewRowdetail = (value: IDrgInvProductResponse) => {
		console.log(value);
		if (value) {
			var checkItemDuplicate = invImportCreateReq.products.find(x => x.inventory_detail_id === value.id);

			if (checkItemDuplicate) {
				notification["error"]({
					message: "Thông báo",
					description: "Thuốc đã có trong bảng. Xin vui lòng kiểm tra lại!",
				});
				return;
			}

			var unit = value.units && value.units.find(x => x.unit_id == value.drug_unit_id);
			console.log(unit)
			var data = {
				key: key,
				inventory_detail_id: value.id,
				inv_id: value.inventory_id,
				drug_code: value.drug_code,
				drug_id: value.drug_id,
				drug_name: value.drug_name,
				inventory_id: '',
				lot: value.lot,
				quantity: 0,
				quantity_pre: value.sum_base_quantity || value.base_quantity,
				price: calcPrice(value.price, value.discount_amount, value.vat_percent),
				unit_id: value.drug_unit_id,
				unit_parent_id: value.unit_parent_id,
				exp_date: value.exp_date,
				vat_percent: 0,
				discount_amount: 0,
				drug_units: value.units,
				total_amount: 0,
				type: 'e'
			};
			setKey(key + 1);
			setInvImportCreateReq({
				...invImportCreateReq,
				products: [...invImportCreateReq.products, data]
			});

		}
	}

	const calcPrice = (price?: number, discount?: number, vat?: number) => {
		return Math.round(((price || 0) - (discount || 0)) * ((vat || 0) + 100) / 100);
	}

	const confirmDeleteCellToTable = (key: number, index: number, record: IImportInventoryDetailCreate) => {
		console.log(record, invImportCreateReq);
		const updatedProducts = invImportCreateReq.products.filter(product => product.key !== key);
		var amount = (invImportCreateReq.info.amount || 0) - (record.total_amount || 0);

		setInvImportCreateReq((prevState) => ({
			...prevState,
			info: {
				...prevState.info,
				amount: amount,
				import_type: 'ORD'
				// amt_total: amtTotal
			},
			products: updatedProducts,
		}));
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
			title: 'Bạn có đồng ý tạo hóa đơn?',
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

	const confirmCancelForm = () => {
		confirm({
			title: 'Bạn muốn hủy hóa đơn?',
			okText: "Đồng ý",
			cancelText: 'Hủy',
			async onOk() {
				navigate('/hoadon')
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
				<InvCustomerExportContext.Provider value={{ invImportCreateReq, setInvImportCreateReq }}>
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
									onPopupScroll={onScrollSelectProduct}
									onSelect={(e: string) => {
										addNewRowdetail(productRes.find(x => x.id == e) || { id: '0' });
									}}
									notFoundContent={productRes ? <Empty description="Không có dữ liệu" /> : null}
								>
									{productRes?.map((value: IDrgInvProductResponse) => (
										<Select.Option key={value.id} value={value.id} label={value.drug_name}>
											<div className="item-search-info-container">
												<div className="drug_info">
													<div className="info_top">
														<h4 className="item-name">
															<span>{value.drug_name || ''}</span>
														</h4>
														<h4 className="item-price">{calcPrice(value.price, value.discount_amount, value.vat_percent).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</h4>
													</div>
													<div className="info_bottom">
														<p className="item-code">{value.drug_code}</p>
														<p className="item-info-other">HSD:  <strong>{value.exp_date ? format(new Date(value.exp_date), 'dd-MM-yyyy') : ''}- </strong>Số lô:  <strong>{value.lot || ''}- </strong>Tồn:  <strong>{value.sum_base_quantity || 0}</strong> {value.unit_name}</p>
													</div>
												</div>
											</div>
										</Select.Option>
									))}
								</Select>
							</Flex>
							<InvCustomerCreateTable updateAmtInfo={updateAmtInfo}
								confirmDeleteCellToTable={confirmDeleteCellToTable} />
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
											name={'customer_id'}
											label={
												<span style={{ fontWeight: "550", fontSize: "14px" }}>Tên KH</span>
											}
										>
											<Flex>
												<Select
													showSearch
													allowClear={true}
													optionFilterProp="children"
													options={optionsCustomer}
													placeholder="Tìm khách hàng"
													id={'customer_id'}
													filterOption={(input, option) =>
														(option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
													}
													value={invImportCreateReq.info.customer_id}
													notFoundContent={optionsCustomer ? <Empty description="Không tìm thấy dữ liệu" /> : null}
													onChange={(e: any) => {
														invImportCreateReq.info.customer_id = e;
													}}
												/>
												<Button
													className="button btn-add d-flex flex-row justify-content-center align-content-center p-2"
													type="primary"
													onClick={() => setOpenCustomer(true)}
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
											onClick={() => {
												form.submit();
											}}
										>
											<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
											<span>Tạo hóa đơn</span>
										</Button>
									</Flex>
								</Flex>
							</Form>
						</Flex>
					</Flex>
				</InvCustomerExportContext.Provider>
			</>)
			}

			<CustomerCreate
				open={openCustomer}
				onCancel={() => {
					setOpenCustomer(false);
					getListCustomer();
				}}
				optionsCusGroup={optionsCusGroup}
			/>
		</>

	);
};



export default InvCustomerCreate;