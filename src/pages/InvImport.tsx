import Table, { ColumnsType } from "antd/es/table";
import providerApi from "../apis/provider.api";
import { API_STATUS, ImportStatus, selectPageSize, Type } from "../constants/general.constant";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { IPageResponse } from "../interfaces/common";
import { Button, Empty, Flex, Pagination, Select, SelectProps, Tag } from "antd";
import { format } from "date-fns/format";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import '../assets/css/style.css';
import { IDrugPageRequest, IDrugResponse } from "../interfaces/drug";
import drugApi from "../apis/drug.api";
import { IInventoryImportPageRequest, IInvoiceImportResponse } from "../interfaces/inventoryImport";
import InvImportSearch from "../components/Invoice/InvImportSearch";
import invoiceApi from "../apis/invoice.api";
import { useNavigate } from "react-router-dom";
import routes from "../router";
import InvImportView from "../components/Invoice/InvImportView";
import { IProperty } from "../interfaces/property";


const InvoiceImport: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ inventory_id: '0' });
	const [isReload, setIsReload] = useState(false);
	const [provides, setProvider] = useState<SelectProps<string>['options']>([]);
	const [importType, setImportType] = useState<SelectProps<string>['options']>([]);

	const [listImportType, setListImportType] = useState<IProperty[]>([]);

  const [listPayMenthods, setListPayMenthods] = useState<IProperty[]>([]);
	const navigate = useNavigate();

	// const properties = localStorage.getItem('properties');
	// console.log(properties);

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
					<span style={{ fontWeight: "600", color: "red" }}>{Number(text || '0').toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
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
					<span style={{ color: "red" }}>{Number(text || '0').toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
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
			const response = await invoiceApi.getList(invImportReq);
			console.log(response)

			// if (response.meta[0].code !== API_STATUS.SUCCESS) {
			// 	//error
			// 	return;
			// }

			setInvImportRes(response);
		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	const triggerFormEvent = (value: IInventoryImportPageRequest) => {
		setInvImportReq({
			...value,
			page: invImportReq.page,
			size: invImportReq.size,
			classification: invImportReq.classification
		});

		console.log(invImportReq);

		// get list provider
	}

	let locale = {
		emptyText: (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
		)
	};

	const handleCreateReceipt = () => {
		navigate({
			pathname: routes[2].path,
		});
	};

	useEffect(() => {
		setIsReload(false);
		getListInvImport();
		console.log('request', invImportReq);
	}, [invImportReq, isReload])

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
				<InvImportSearch InvImportReq={invImportReq} triggerFormEvent={triggerFormEvent} Provides={provides} ImportType={importType} />
			</Flex>
			<div className="table-wrapper">
				<Table
					rowKey={(record) => record.inventory_id}
					size="small"
					scroll={{ x: 1024 }}
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