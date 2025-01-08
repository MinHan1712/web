import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, notification, Pagination, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns/format";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import providerApi from "../apis/provider.api";
import '../assets/css/style.css';
import ProviderCreate from "../components/provider/ProviderCreate";
import ProviderSearch from "../components/provider/ProviderSearch";
import ProviderView from "../components/provider/ProviderView";
import { selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IProviderPageRequest, IProviderResponse } from "../interfaces/provider";

const columnsProvider: ColumnsType<IProviderResponse> = [
	{
		title: "Mã NCC",
		dataIndex: "provider_code",
		key: "provider_code",
		width: "10%",
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>
		),
	},
	{
		title: "Tên NCC",
		dataIndex: "provider_name",
		key: "provider_name",
		width: "17%",
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>
		),
	},
	{
		title: "Điện thoại",
		dataIndex: "phone",
		key: "phone",
		width: "10%",
		align: "center" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>
		),
	},
	{
		title: "Địa chỉ",
		dataIndex: "address",
		key: "address",
		width: "17%",
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>
		),
	},
	{
		title: "Website",
		dataIndex: "website",
		key: "website",
		width: "13%",
		align: "center" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>
		),
	},
	{
		title: "Ngày tạo",
		dataIndex: "created_date",
		key: "created_date",
		width: "13%",
		align: "center" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text === null ? "" : format(new Date(text), "dd-MM-yyyy HH:mm:ss")}</span>
			</div>
		),
	},
	{
		title: "Nợ nhà cung cấp",
		dataIndex: "amount_debt",
		key: "amount_debt",
		width: "10%",
		align: "right" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span style={{ fontWeight: "600", color: "red" }}>{(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
			</div>
		),
	},
	{
		title: "Tổng mua",
		dataIndex: "amount",
		key: "amount",
		width: "10%",
		align: "right" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span style={{ fontWeight: "600", color: "red" }}>{(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
			</div>
		),
	},
];

const Provider: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ provider_id: '0' });
	const [openFormCreate, setOpenFormCreate] = useState(false);
	const [isReload, setIsReload] = useState(false);

	const [providerRes, setProviderRes] = useState<IPageResponse<IProviderResponse[]>>({
		page: 1,
		size: 20,
		totalElements: 0,
		data: []
	});

	const [providerReq, setProviderReq] = useState<IProviderPageRequest>({
		page: 1,
		size: 20
	});

	const getListProvider = async () => {
		setLoading(true);
		try {
			await providerApi.getList(providerReq).then((response) => {
				switch (response.meta.code) {
					case 200:
						setProviderRes(response.data);
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

	const triggerFormEvent = (value: IProviderPageRequest) => {
		setProviderReq({
			...value,
			page: providerReq.page,
			size: providerReq.size
		});
		// get list provider
	}

	useEffect(() => {
		setIsReload(false);
		getListProvider();
	}, [providerReq, isReload])

	return (
		<>
			<Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
				<Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
					<h3 className="title">Nhà cung cấp</h3>
					<Button
						className="button btn-add d-flex flex-row justify-content-center align-content-center"
						type="primary"
						onClick={() => setOpenFormCreate(true)}>
						<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
						<span>Thêm mới</span>
					</Button>
				</Flex>
				<ProviderSearch providerReq={providerReq} triggerFormEvent={triggerFormEvent} />
			</Flex>
			<div className="table-wrapper">
				<Table
					locale={{
						emptyText: (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
						)
					}}
					rowKey={(record) => record.provider_id}
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
					columns={columnsProvider}
					loading={loading}
					dataSource={providerRes.data}
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
								setProviderReq({
									...providerReq,
									page: 1,
									size: size
								});
								setPageSize(size);
							}} />
						<h5> Tổng số {providerRes.totalElements || 0}  nhà cung cấp</h5>
					</Flex>


					<Pagination
						total={providerRes.totalElements || 0}
						current={providerRes.page}
						pageSize={providerRes.size}
						showSizeChanger={false}
						onChange={(page) => {
							setProviderReq({
								...providerReq,
								page: page,
							});
						}} />
				</Flex>

			</div>

			<ProviderView
				openViewDate={openViewDate}
				onCancel={() => {
					setOpenviewDate(false);
					getListProvider();
				}}
				data={dataItem}

			/>

			<ProviderCreate
				open={openFormCreate}
				onCancel={() => {
					setOpenFormCreate(false);
					getListProvider();
				}}
			/>
		</>
	);
};

export default Provider;