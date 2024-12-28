import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Pagination, Select, SelectProps, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns/format";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceApi from "../apis/invoice.api";
import '../assets/css/style.css';
import InvExportSearch from "../components/Invoice/InvExportSearch";
import InvExportView from "../components/Invoice/InvExportView";
import { ImportStatus, selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IInventoryImportPageRequest, IInvoiceImportResponse } from "../interfaces/inventoryImport";
import { IProperty } from "../interfaces/property";
import routes from "../router";
import { getExportType, getListExportTypeOption } from "../utils/local";


const InvoiceExport: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ inventory_id: '0' });
	const [isReload, setIsReload] = useState(false);
	const [users, setUsers] = useState<SelectProps<string>['options']>([]); //TODO
	const [exportType, setExportType] = useState<SelectProps<string>['options']>([]);
	const [listTypeExports, setListTypeExports] = useState<IProperty[]>([]);
	const navigate = useNavigate();

	let stt: number = 1;
	const columnExportHistory: ColumnsType<IInvoiceImportResponse> = [
		{
			title: "STT",
			dataIndex: "inventory_id",
			align: "center" as AlignType,
			width: "50px",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{stt++}</span>
				</div>
			)
		},
		{
			title: "Mã phiếu",
			dataIndex: "inventory_code",
			align: "center" as AlignType,
			width: "12%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{text}</span>
				</div>
			)
		},
		{
			title: "Loại xuất",
			dataIndex: "inventory_type",
			align: "left" as AlignType,
			width: "17%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					{listTypeExports.find((x) => x.unit_cd == text)?.value}
				</div>
			)
		},
		{
			title: "Ngày xuất",
			dataIndex: "process_date",
			align: "center" as AlignType,
			width: "12%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{text ? format(new Date(text), "dd-MM-yyyy HH:mm:ss") : ''}</span>
				</div>
			)
		},
		{
			title: "Ngày tạo",
			dataIndex: "created_date",
			align: "center" as AlignType,
			width: "12%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span>{text ? format(new Date(text), "dd-MM-yyyy HH:mm:ss") : ''}</span>
				</div>
			)
		},
		{
			title: "Tổng tiền",
			dataIndex: "amount",
			align: "right" as AlignType,
			width: "20%",
			render: (text) => (
				<div className="style-text-limit-number-line2">
					<span style={{ color: "red" }}>{Math.abs(text || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
				</div>
			)
		},
		{
			title: "Người tạo",
			dataIndex: "updated_user",
			align: "center" as AlignType,
			width: "12%",
			render: (text) => {
				// var user = listUser.find(x => x.login == text)?.user_name; TODO
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
			width: "calc(15% - 50px)",
			render: (text) => {
				console.log(ImportStatus.find((x) => x.value == text));
				return (
					<Tag color={ImportStatus.find((x) => x.value == text)?.name} key={text}>
						{ImportStatus.find((x) => x.value == text)?.label}
					</Tag>
				);
			}
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
		classification: true
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

			setInvImportRes(response.data);
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

	const handleCreateReceipt = () => {
		navigate({
			pathname: routes[2].path,
		});
	};

	useEffect(() => {
		setIsReload(false);
		getListInvImport();

		setExportType(getListExportTypeOption);
		setListTypeExports(getExportType);

		console.log('request', invImportReq);
	}, [invImportReq, isReload])

	return (
		<>
			<Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
				<Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
					<h3 className="title">Lịch sử xuất kho</h3>
					<Button
						className="button btn-add"
						type="primary"
						onClick={() => handleCreateReceipt()}>
						<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
						<span>Thêm mới</span>
					</Button>
				</Flex>
				<InvExportSearch InvExportReq={invImportReq} triggerFormEvent={triggerFormEvent} users={users} exportType={exportType} />
			</Flex>
			<div className="table-wrapper">
				<Table
					locale={{
						emptyText: (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
						)
					}}
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
					columns={columnExportHistory}
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
						<h5> Tổng số {invImportRes.totalElements || 0} phiếu</h5>
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

			<InvExportView
				open={openViewDate}
				onCancel={() => {
					setOpenviewDate(false);
					getListInvImport();
				}}
				data={dataItem}

			/>

		</>
	);
};

export default InvoiceExport;