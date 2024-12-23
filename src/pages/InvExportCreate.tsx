import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Flex, Form, Input, Modal, notification, Select, SelectProps, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns/format";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceApi from "../apis/invoice.api";
import '../assets/css/style.css';
import InvExportCreateTable from "../components/Invoice/InvExportCreateTable";
import { formItemLayout } from "../constants/general.constant";
import { ICreateInvImport, IDrgInvProductResponse, IDrugInvProductPageRequest, IImportInventoryCreate } from "../interfaces/inventoryImport";


const InvExportCreate: React.FC = () => {
	const [key, setKey] = useState(0);
	const { confirm } = Modal;

	const [loadingScreen, setLoadingScreen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [form] = Form.useForm<IImportInventoryCreate>();
	const [optionsExportType, setOptionsExportType] = useState<SelectProps<string>['options']>([]);

	const [invProductReq, setInvProductReq] = useState<IDrugInvProductPageRequest>({
		page: 1,
		size: 20,
		classification: false
	});
	const [productRes, setProductRes] = useState<IDrgInvProductResponse[]>([
		{
			id: "1",
			inventory_id: "1",
			drug_id: "1",
			quantity: "100",
			base_quantity: 100,
			drug_unit_id: "1",
			unit_parent_id: "1",
			price: 10,
			lot: "1",
			vat_percent: 10,
			drug_name: 'bha',
			total_price: 0,
			sum_quantity: 0,
			sum_base_quantity: 0,
		}
	]);


	const navigate = useNavigate();

	const [invImportCreateReq, setInvImportCreateReq] = useState<ICreateInvImport>({
		info: {
		},
		products: []
	});

	useEffect(() => {
		getListProduct();
		// setOptionsExportType(getProperties());
	}, []);

	useEffect(() => {
		invImportCreateReq.info.amount = invImportCreateReq.products?.reduce((a, b) => a + (b.total_amount || 0), 0);
		setInvImportCreateReq(invImportCreateReq);
		form.setFieldsValue({
			amount:  invImportCreateReq.products?.reduce((a, b) => a + (b.total_amount || 0), 0)
		})
		console.log(invImportCreateReq);
	}, [invImportCreateReq]);

	const createInvExport = () => {
		setLoadingScreen(true);
		console.log(invImportCreateReq);
		const response = invoiceApi.create(invImportCreateReq);
		console.log(response)
		setLoadingScreen(false);
	}

	const getListProduct = async () => {
		setLoading(true);
		try {
			const response = await invoiceApi.getListInvProduct(invProductReq);
			console.log(response)

			// if (response.meta[0].code !== API_STATUS.SUCCESS) {
			// 	//error
			// 	return;
			// }
			if (response.data !== undefined && response.data != null && response.data.length > 0) {
				setProductRes(prevState => [...prevState, ...response.data]);
			}
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
		console.log(value);
		setInvImportCreateReq({
			...invImportCreateReq,
			info: value
		});

		confirmCreateInvExport();

		console.log(invImportCreateReq);
	}

	const addNewRowdetail = (value: IDrgInvProductResponse) => {
		console.log(value);
		if (value) {
			var checkItemDuplicate = invImportCreateReq.products.find(x => x.inventory_detail_id == value.id);

			if (checkItemDuplicate) {
				notification["error"]({
					message: "Thông báo",
					description: "Thuốc đã có trong bảng. Xin vui lòng kiểm tra lại!",
				});
				return;
			}

			var unit = value.units && value.units.find(x => x.unit_id == value.drug_unit_id);
			// console.log((value.total_price || 0) / (unit?.unit_qty || 1), unit?.unit_qty)
			var data = {
				key: key,
				inventory_detail_id: value.id,
				drug_code: value.drug_code,
				drug_id: value.drug_id,
				drug_name: value.drug_name,
				inventory_id: '',
				lot: value.lot,
				quantity: 0,
				quantity_pre: value.sum_base_quantity || value.base_quantity,
				price: (value.price || 0) / (unit?.unit_qty || 1),
				unit_id: value.unit_parent_id,
				unit_parent_id: value.unit_parent_id,
				exp_date: value.exp_date,
				vat_percent: value.vat_percent || 0,
				discount_amount: (value.discount_amount || 0) / (unit?.unit_qty || 1),
				drug_units: value.units,
				total_amount: 0,
				total_price: (value.total_price || 0) / (unit?.unit_qty || 1),
				unit_quantity: unit && unit.unit_qty || 1
			};
			setKey(key + 1);
			setInvImportCreateReq({
				...invImportCreateReq,
				products: [...invImportCreateReq.products, data]
			});

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
					createInvExport();
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
			<Spin tip="Loading..." spinning={loadingScreen}>
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
													<h4 className="item-price">{(value.total_price || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</h4>
												</div>
												<div className="info_bottom">
													<p className="item-code">{value.drug_code}</p>
													<p className="item-info-other">HSD:  <strong>{value.exp_date ? format(new Date(value.exp_date), 'dd-MM-yyyy') : ''}- </strong>Số lô:  <strong>{value.lot || ''}- </strong>Tồn:  <strong>{value.sum_base_quantity || 0}</strong> {value.units?.find(x => x.unit_id == value.unit_parent_id)?.unit_name || value.unit_name || ''}</p>
												</div>
											</div>
										</div>
									</Select.Option>
								))}
							</Select>
						</Flex>
						<InvExportCreateTable exportInvDetails={invImportCreateReq.products} setInvDetails={(value) => setInvImportCreateReq({ ...invImportCreateReq, products: value })}
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
											}, ...optionsExportType || []]} //TODO
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
										<Input></Input>
										{/* <p style={{ fontWeight: "550", fontSize: "14px", color: 'red', textAlign: 'left' }}>{(invImportCreateReq.info.amount || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p> */}
									</Form.Item>
								</div>

								<Flex gap="middle" justify="flex-end" align={'center'} style={{ width: '100%' }}>
									<Button
										className="button btn-delete d-flex flex-row justify-content-center align-content-center mb-2"
										type="primary"
										onClick={() => { navigate('/kho/xuatkho') }}
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
										<span>Nhập kho</span>
									</Button>
								</Flex>
							</Flex>
						</Form>
					</Flex>
				</Flex>
			</Spin>
		</>
	);
};

export default InvExportCreate;