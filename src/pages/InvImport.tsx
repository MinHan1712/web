import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, notification, Pagination, Select, SelectProps, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns/format";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceApi from "../apis/invoice.api";
import providerApi from "../apis/provider.api";
import '../assets/css/style.css';
import InvImportSearch from "../components/Invoice/InvImportSearch";
import InvImportView from "../components/Invoice/InvImportView";
import { ImportStatus, selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IInventoryImportPageRequest, IInvoiceImportResponse } from "../interfaces/inventoryImport";
import { IProperty } from "../interfaces/property";
import { IProviderResponse } from "../interfaces/provider";
import { getImportType, getInvSource, getListImportTypeOption, getPayMethods } from "../utils/local";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { sign } from "crypto";

const InvoiceImport: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ inventory_id: '0' });

	const [provides, setProvider] = useState<SelectProps<string>['options']>([]);
	const [importTypeOptions, setImportTypeOptions] = useState<SelectProps<string>['options']>([]);
	const [listImportType, setListImportType] = useState<IProperty[]>([]);
	const [listPayMenthods, setListPayMenthods] = useState<IProperty[]>([]);
	const [isExcel, setIsExcel] = useState(false);

	const navigate = useNavigate();

	let stt: number = 1;
	const columnInvoiceHistoryImport: ColumnsType<IInvoiceImportResponse> = [
		{
			title: "STT",
			dataIndex: "inventory_id",
			align: "center" as AlignType,
			width: "30px",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{stt++}</span>
				</div>
			)
		},
		{
			title: "Mã phiếu",
			dataIndex: "inventory_code",
			align: "left" as AlignType,
			width: "12%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{text}</span>
				</div>
			)
		},
		{
			title: "Loại nhập",
			dataIndex: "inventory_type",
			align: "center" as AlignType,
			width: "12%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					{listImportType.find((x) => x.unit_cd == text)?.value}
				</div>
			)
		},
		{
			title: "Nhà cung cấp",
			dataIndex: "provider_name",
			align: "left" as AlignType,
			width: "12%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{text}</span>
				</div>
			)
		},
		{
			title: "Ngày thực tế",
			dataIndex: "process_date",
			align: "center" as AlignType,
			width: "9%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{text ? format(new Date(text), "dd-MM-yyyy") : ''}</span>
				</div>
			)
		},
		{
			title: "Ngày tạo",
			dataIndex: "created_date",
			align: "center" as AlignType,
			width: "9%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{text ? format(new Date(text), "dd-MM-yyyy HH:mm:ss") : ''}</span>
				</div>
			)
		},
		{
			title: "Còn nợ",
			dataIndex: "amount_debt",
			align: "right" as AlignType,
			width: "11%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span style={{ fontWeight: "600", color: "red" }}>{Number(text || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
				</div>
			)
		},
		{
			title: "Tổng mua",
			dataIndex: "amount",
			align: "right" as AlignType,
			width: "11%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span style={{ fontWeight: "600", color: "red" }}>{Number(text || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
				</div>
			)
		},
		{
			title: "Người tạo",
			dataIndex: "updated_user",
			align: "center" as AlignType,
			width: "9%",
			render: (text) => {
				// var user = ListUser.find(x => x.login == text)?.user_name;
				return (<div className="style-text-limit-number-line2">
					<span style={{ fontWeight: "400" }}>{text}</span>
				</div>
				)
			}
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			align: "center" as AlignType,
			width: "calc(15% - 30px)",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span style={{ fontWeight: "600", padding: '3px' }}>
						<Tag color={ImportStatus.find((x) => x.value == text)?.name} key={text}>
							{ImportStatus.find((x) => x.value == text)?.label}
						</Tag>
					</span>
				</div>
			),
		}
	];

	const [invImportRes, setInvImportRes] = useState<IPageResponse<IInvoiceImportResponse[]>>({
		page: 1,
		size: 20,
		totalElements: 0,
		data: []
	});

	const [invImportReq, setInvImportReq] = useState<IInventoryImportPageRequest>({
		page: 1,
		size: 20,
		classification: false
	});


	const getListInvImport = async () => {
		setLoading(true);
		try {
			var request = {
				...invImportReq,
				page: isExcel ? 0 : invImportReq.page,
				size: isExcel ? 0 : invImportReq.size
			}

			await invoiceApi.getList(request).then((response) => {
				switch (response.meta.code) {
					case 200:
						if (isExcel) {
							exportToExcel(response.data);
							setIsExcel(false);
						} else {
							setInvImportRes(response.data);
						}

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
			notification['error']({
				message: "Lỗi",
				description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
			});
		} finally { setLoading(false); }
	}

	const getListProvider = async () => {
		try {
			await providerApi.getList({
				page: 0,
				size: 0
			}).then((response) => {
				if (response.meta.code === 200) {
					setProvider(response.data.data.map((provider: IProviderResponse) => {
						return {
							value: provider.provider_id,
							label: provider.provider_name
						}
					}));
				} else {
					setProvider([]);
				}
			})
		} catch (err) {

		} finally { }
	}

	const exportAndCallApi = async () => {
		setIsExcel(true);
		getListInvImport();
	}

	const exportToExcel = (result: IPageResponse<IInvoiceImportResponse[]>) => {
		if (result) {
			const importData = result.data?.map((item) => {
				// Kiểm tra nếu có chi tiết hàng tồn kho
				if (item.drg_inv_inventory_details) {
					// Sử dụng `map` để tạo ra các bản ghi cho từng chi tiết trong `drg_inv_inventory_details`
					return item.drg_inv_inventory_details.map((drg) => ({
						"Mã phiếu": item.inventory_code,
						"Loại nhập": listImportType.find((x) => x.unit_cd === item.inventory_type)?.value,
						"Nhà cung cấp": item.provider_name,
						"Ngày nhập thực tế": item.process_date,
						"Mã sản phẩm": drg.drug_code,
						"Tên sản phẩm": drg.drug_name,
						"Số lô": drg.lot,
						"Hạn sử dụng": drg.exp_date,
						"Số lượng": drg.quantity,
						"Đơn vị": drg.unit_name,
						"Đơn giá": drg.price,
						"VAT": drg.vat_percent,
						"Tổng tiền": drg.total_amount,
						"Trạng thái": ImportStatus.find((x) => x.value === item.status?.toString())?.label
					}));
				}
				return [];
			}).flat();

			console.log(result.data);

			const ws = XLSX.utils.json_to_sheet(importData);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Import Data");
			const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
			const file = new Blob([excelBuffer], { type: "application/octet-stream" });
			saveAs(file, `Lich-su-nhap-kho${new Date().toISOString().split('T')[0]}.xlsx`);
		} else {
			notification['info']({
				message: "Thông báo",
				description: 'Không có dữ liệu để xuất file',
			});
		}
	};

	const triggerFormEvent = (value: IInventoryImportPageRequest) => {
		setInvImportReq({
			...value,
			page: invImportReq.page,
			size: invImportReq.size,
			classification: invImportReq.classification
		});
	}

	const handleCreateReceipt = () => {
		navigate('/kho/taophieunhapkho');
	};

	useEffect(() => {
		setImportTypeOptions(getListImportTypeOption);
		setListImportType(getImportType);
		setListPayMenthods(getPayMethods);
		getListProvider();
	}, []);

	useEffect(() => {
		getListInvImport();
	}, [invImportReq])

	return (
		<>
			<Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
				<Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
					<h3 className="title">Lịch sử nhập kho</h3>
					<Button
						className="button btn-add"
						type="primary"
						onClick={() => handleCreateReceipt()}>
						<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
						<span>Thêm mới</span>
					</Button>
				</Flex>
				<InvImportSearch InvImportReq={invImportReq} triggerFormEvent={triggerFormEvent} Provides={provides} ImportType={importTypeOptions} exportToExcel={exportAndCallApi} />
			</Flex>
			<div className="table-wrapper">
				<Table
					rowKey={(record) => record.inventory_id}
					size="small"
					scroll={{ x: 240 }}
					bordered={false}
					components={{
						header: {
							cell: (props: any) => {
								return (
									<th
										{...props}
										style={{ ...props.style, backgroundColor: '#012970', color: '#ffffff' }}
									/>
								);
							},
						},
					}}
					columns={columnInvoiceHistoryImport}
					loading={loading}
					dataSource={invImportRes.data}
					pagination={false}
					onRow={(record) => {
						return {
							onClick: () => {
								setDataItem(record);
								setOpenviewDate(true);
							},
						};
					}}
				/>
				<Flex gap="middle" justify="space-between" align={'center'} style={{ paddingTop: '10px' }}>
					<Flex gap="middle" justify="flex-start" align={'center'}>
						<h5>Hiển thị</h5>
						<Select
							style={{ width: 70 }}
							options={selectPageSize}
							className='me-2 ms-2'
							value={pageSize || selectPageSize[0].value}
							onChange={(size: number) => {
								setInvImportReq({
									...invImportReq,
									page: 1,
									size: size
								});
								setPageSize(size);
							}} />
						<h5> Tổng số {invImportRes.totalElements || 0}  phiếu</h5>
					</Flex>


					<Pagination
						total={invImportRes.totalElements || 0}
						current={invImportRes.page}
						pageSize={invImportRes.size}
						showSizeChanger={false}
						onChange={(page) => {
							setInvImportReq({
								...invImportReq,
								page: page,
							});
						}} />
				</Flex>

			</div>

			<InvImportView
				open={openViewDate}
				onCancel={() => {
					setOpenviewDate(false);
					getListInvImport();
				}}
				data={dataItem}
				payMenthods={listPayMenthods}
				importTypes={listImportType}

			/>

		</>
	);
};

export default InvoiceImport;