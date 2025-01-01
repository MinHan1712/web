import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, notification, Pagination, Select, SelectProps, Tag } from "antd";
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
import { IDrugKindResponse } from "../interfaces/drugKind";
import { IDrugGroupResponse } from "../interfaces/drugGroup";
import { getDrgGroup, getDrgKind, getListDrgDescription, getListGroupOption, getListKindOption, getListUnitOption } from "../utils/local";

const Product: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
	const [openViewDate, setOpenviewDate] = useState(false);
	const [dataItem, setDataItem] = useState({ drug_id: '0' });
	const [openFormCreate, setOpenFormCreate] = useState(false);
	const [isReload, setIsReload] = useState(false);

	const [optionKind, setOptionKind] = useState<SelectProps<string>['options']>([]);
	const [optionGroup, setOptionGroup] = useState<SelectProps<string>['options']>([]);
	const [optionUnit, setOptionUnit] = useState<SelectProps<string>['options']>([]);
	const [listKind, setListKind] = useState<IDrugKindResponse[]>([]);
	const [listGroup, setListGroup] = useState<IDrugGroupResponse[]>([]);
	const [optionDrgDescription, setOptionDrgDescription] = useState<SelectProps<string>['options']>([]);


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
			await drugApi.getList(productReq).then((response) => {
				switch (response.meta.code) {
					case 200:
						setProductRes(response.data);
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

	const triggerFormEvent = (value: IDrugPageRequest) => {
		setProductReq({
			...value,
			page: productReq.page,
			size: productReq.size,
		});

		// get list provider
	}

	useEffect(() => {
		setIsReload(false);
		getListProduct();
		setListKind(getDrgKind());
		setListGroup(getDrgGroup());
		setOptionKind(getListKindOption());
		setOptionGroup(getListGroupOption());
		setOptionUnit(getListUnitOption());
		setOptionDrgDescription(getListDrgDescription());
	}, [productReq, isReload])

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
				let color = text === true ? "green" : "red";
				return (
					<Tag color={color} key={text} className="style-text-limit-number-line2 p-1">
						{text === true ? "Đang kinh doanh" : "Ngừng kinh doanh"}
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
		// {
		// 	title: "Người tạo",
		// 	dataIndex: "updated_user",
		// 	key: "updated_user",
		// 	width: "7%",
		// 	align: "center" as AlignType,
		// 	render: (text) => {
		// 		// var user = listUser.find(x => x.login == text)?.user_name;
		// 		return (
		// 			<div className="style-text-limit-number-line2">
		// 				<span>{text}</span>
		// 				<span>{users?.find(x => x.drug_kind_id === text)?.name}</span>
		// 			</div>
		// 		)
		// 	},
		// },
		// {
		// 	title: "Mã dược quốc gia",
		// 	dataIndex: "drg_ref_cd",
		// 	key: "drg_ref_cd",
		// 	width: "7%",
		// 	align: "center" as AlignType,
		// 	render: (text) => (
		// 		<div className="style-text-limit-number-line2">
		// 			<span>{text}</span>
		// 		</div>
		// 	),
		// },
		// {
		// 	title: "Nhóm thuốc",
		// 	dataIndex: "drug_kind",
		// 	key: "drug_kind",
		// 	width: "7%",
		// 	align: "center" as AlignType,
		// 	render: (text) => (
		// 		<div className="style-text-limit-number-line2">
		// 			{/* <span>{text}</span> */}
		// 			<span>{listKind?.find(x => x.drug_kind_id === text)?.name}</span>
		// 		</div>
		// 	),
		// },
		// {
		// 	title: "Quy cách đóng gói",
		// 	dataIndex: "package_desc",
		// 	key: "package_desc",
		// 	width: "10%",
		// 	align: "center" as AlignType,
		// 	render: (text) => (
		// 		<div className="style-text-limit-number-line2">
		// 			<span>{text}</span>
		// 		</div>
		// 	),
		// },
	];

	return (
		<>
			<Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
				<Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
					<h3 className="title">Danh mục sản phẩm</h3>
					<Button
						className="button btn-add"
						type="primary"
						onClick={() => setOpenFormCreate(true)}>
						<PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
						<span>Thêm mới</span>
					</Button>
				</Flex>
				<ProductSearch productReq={productReq} triggerFormEvent={triggerFormEvent} optionGroup={optionGroup}
					optionKind={optionKind} />
			</Flex>
			<div className="table-wrapper">
				<Table
					locale={{
						emptyText: (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
						)
					}}
					rowKey={(record) => record.drug_id}
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
						<h5> Tổng số {productRes.totalElements || 0}  sản phẩm</h5>
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
					// getListProduct();
					setIsReload(true);
				}}
				data={dataItem}
				optionGroup={optionGroup}
				optionKind={optionKind}
				listGroup={listGroup}
				listKind={listKind}
				optionUnit={optionUnit}
				optionDrgDescription={optionDrgDescription}

			/>

			<ProductCreate
				open={openFormCreate}
				onCancel={() => {
					setOpenFormCreate(false);
					setIsReload(true);
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

export default Product;