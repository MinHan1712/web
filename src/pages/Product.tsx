import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Pagination, Select, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns/format";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import drugApi from "../apis/drug.api";
import '../assets/css/style.css';
import ProductCreate from "../components/product/ProductCreate";
import ProductSearch from "../components/product/ProductSearch";
import ProductView from "../components/product/ProductView";
import { selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IDrugPageRequest, IDrugResponse } from "../interfaces/drug";

const productColumns: ColumnsType<IDrugResponse> = [
	{
		title: "Mã sản phẩm",
		dataIndex: "drug_code",
		key: "drug_code",
		width: "10%",
		align: "left" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>

		),
	},
	{
		title: "Tên sản phẩm",
		dataIndex: "drug_name",
		key: "drug_name",
		width: "15%",
		align: "left" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>

		),
	},
	{
		title: "Số đăng ký",
		dataIndex: "license_cd",
		key: "license_cd",
		width: "7%",
		align: "left" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>

		),
	},
	{
		title: "Hoạt chất",
		dataIndex: "active_ingredient",
		key: "active_ingredient",
		width: "10%",
		align: "left" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>

		),
	},
	{
		title: "Nhà SX",
		dataIndex: "company_name",
		key: "company_name",
		width: "10%",
		align: "left" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>

		),
	},
	{
		title: "Trạng thái",
		dataIndex: "active_flg",
		key: "active_flg",
		width: "7%",
		align: "center" as AlignType,
		render: (text) => {
			let color = text == "1" ? "green" : "red";
			return (
				<Tag color={color} key={text} className="style-text-limit-number-line2 p-1">
					{text == "1" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
				</Tag>
			);
		},
	},
	{
		title: "Cập nhật",
		dataIndex: "created_date",
		key: "created_date",
		width: "10%",
		align: "center" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text ? format(new Date(text), "dd-MM-yyyy HH:mm:ss") : ''}</span>
			</div>
		),
	},
	{
		title: "Người tạo",
		dataIndex: "updated_user",
		key: "updated_user",
		width: "7%",
		align: "center" as AlignType,
		render: (text) => {
			// var user = listUser.find(x => x.login == text)?.user_name;
			return (
				<div className="style-text-limit-number-line2">
					<span>{text}</span>
				</div>
			)
		},
	},
	{
		title: "Mã dược quốc gia",
		dataIndex: "drg_ref_cd",
		key: "drg_ref_cd",
		width: "7%",
		align: "center" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>
		),
	},
	{
		title: "Nhóm thuốc",
		dataIndex: "drug_kind",
		key: "drug_kind",
		width: "7%",
		align: "center" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
				{/* <span>{optionDrugKind?.find(x => x.value == text)?.label}</span> */}
			</div>
		),
	},
	{
		title: "Quy cách đóng gói",
		dataIndex: "package_desc",
		key: "package_desc",
		width: "10%",
		align: "center" as AlignType,
		render: (text) => (
			<div className="style-text-limit-number-line2">
				<span>{text}</span>
			</div>
		),
	},
];

const Product: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ drug_id: '0' });
	const [openFormCreate, setOpenFormCreate] = useState(false);
	const [isReload, setIsReload] = useState(false);

	const [productRes, setProductRes] = useState<IPageResponse<IDrugResponse[]>>({
		page: 1,
		size: 20,
		totalElements: 0,
		data: []
	});

	const [productReq, setProductReq] = useState<IDrugPageRequest>({
		page: 1,
		size: 20
	});

	const getListProduct = async () => {
		setLoading(true);
		try {
			const response = await drugApi.getList(productReq);
			console.log(response)

			// if (response.meta[0].code !== API_STATUS.SUCCESS) {
			// 	//error
			// 	return;
			// }

			setProductRes(response);
		} catch (err) {
			console.log(err);
		} finally { setLoading(false); }
	}

	const triggerFormEvent = (value: IDrugPageRequest) => {
		setProductReq({
			...value,
			page: productReq.page,
			size: productReq.size,
		});

		// get list provider
	}

	let locale = {
		emptyText: (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
		)
	};

	useEffect(() => {
		setIsReload(false);
		getListProduct();
		console.log('request', productReq);
	}, [productReq, isReload])

	return (
		<>
			<Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
				<Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
					<h3 className="title">Nhà cung cấp</h3>
					<Button
						className="button btn-add"
						type="primary"
						onClick={() => setOpenFormCreate(true)}>
						<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
						<span>Thêm mới</span>
					</Button>
				</Flex>
				<ProductSearch productReq={productReq} triggerFormEvent={triggerFormEvent} />
			</Flex>
			<div className="table-wrapper">
				<Table
					rowKey={(record) => record.drug_id}
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
					columns={productColumns}
					loading={loading}
					dataSource={productRes.data}
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
								setProductReq({
									...productReq,
									page: 1,
									size: size
								});
								setPageSize(size);
							}} />
						<h5> Tổng số {productRes.totalElements || 0}  nhà cung cấp</h5>
					</Flex>


					<Pagination
						total={productRes.totalElements || 0}
						current={productRes.page}
						pageSize={productRes.size}
						showSizeChanger={false}
						onChange={(page) => {
							setProductReq({
								...productReq,
								page: page,
							});
						}} />
				</Flex>

			</div>

			<ProductView
				open={openViewDate}
				onCancel={() => {
					setOpenviewDate(false);
					getListProduct();
				}}
				data={dataItem}

			/>

			<ProductCreate
				open={openFormCreate}
				onCancel={() => {
					setOpenFormCreate(false);
					getListProduct();
				}}
			/>
		</>
	);
};

export default Product;