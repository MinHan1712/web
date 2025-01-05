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
import { getImportType, getListImportTypeOption, getPayMethods } from "../utils/local";


const InvoiceImport: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ inventory_id: '0' });

	const [provides, setProvider] = useState<SelectProps<string>['options']>([]);
	const [importTypeOptions, setImportTypeOptions] = useState<SelectProps<string>['options']>([]);
	const [listImportType, setListImportType] = useState<IProperty[]>([]);
	const [listPayMenthods, setListPayMenthods] = useState<IProperty[]>([]);

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
					{/* {ListImportType.find((x) => x.unit_cd == text)?.value} */}
					{text}
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
					<span style={{ color: "red" }}>{Number(text || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
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
					<span>
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
			await invoiceApi.getList(invImportReq).then((response) => {
				console.log(response)
				switch (response.meta.code) {
					case 200:
						setInvImportRes(response.data);
						console.log(response);
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
			console.log(err);
		} finally { }
	}

	const triggerFormEvent = (value: IInventoryImportPageRequest) => {
		setInvImportReq({
			...value,
			page: invImportReq.page,
			size: invImportReq.size,
			classification: invImportReq.classification
		});

		console.log(invImportReq);
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
		console.log('request', invImportReq);
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
				<InvImportSearch InvImportReq={invImportReq} triggerFormEvent={triggerFormEvent} Provides={provides} ImportType={importTypeOptions} />
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