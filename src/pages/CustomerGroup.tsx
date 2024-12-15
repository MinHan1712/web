import Table, { ColumnsType } from "antd/es/table";
import { API_STATUS, CustonerGroupType, selectPageSize } from "../constants/general.constant";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { IPageResponse } from "../interfaces/common";
import { Button, Empty, Flex, Pagination, Select, Tag } from "antd";
import { format } from "date-fns/format";
import { PlusCircleOutlined } from "@ant-design/icons";
import '../assets/css/style.css';
import { ICustomerGroupPageRequest, ICustomerGroupResponse } from "../interfaces/customerGroup";
import customerGroupApi from "../apis/customerGroup.api";
import CustomerGroupSearch from "../components/customerGroup/CustomerGroupSearch";
import CustomerGroupCreate from "../components/customerGroup/CustomerGroupCreate";
import CustomerGroupView from "../components/customerGroup/CustomerGroupView";

const columnsCustomerGroup: ColumnsType<ICustomerGroupResponse> = [
  {
    title: "Mã nhóm KH",
    dataIndex: "customer_group_cd",
    key: "customer_group_cd",
    width: "15%",
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Tên nhóm KH",
    dataIndex: "customer_group_name",
    key: "customer_group_name",
    width: "25%",
    align: "left" as AlignType,
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
        <span>{text == null ? "" : format(new Date(text), "dd-MM-yyyy HH:mm:ss")}</span>
      </div>
    ),
  },
  {
    title: "Người tạo",
    dataIndex: "updated_user",
    key: "updated_user",
    width: "20%",
    align: "left" as AlignType,
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Loại nhóm KH",
    dataIndex: "customer_group_type",
    key: "customer_group_type",
    width: "20%",
    align: "center" as AlignType,
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>
          <Tag style={{ fontWeight: "600" }} color="#012970">
            {CustonerGroupType.find((x) => x.value == text)?.label}
          </Tag>
        </span>
      </div>
    ),
  },
];

const CustomerGroup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [openViewDate, setOpenviewDate] = useState(false);
  const [dataItem, setDataItem] = useState({ customer_group_id: '0' });
  const [openFormCreate, setOpenFormCreate] = useState(false);
  const [isReload, setIsReload] = useState(false);

  const [customerGroupRes, setCustomerGroupRes] = useState<IPageResponse<ICustomerGroupResponse[]>>({
    page: 1,
    size: 20,
    totalElements: 0,
    data: []
  });

  const [customerGroupReq, setCustomerGroupReq] = useState<ICustomerGroupPageRequest>({
    page: 1,
    size: 20
  });

  const getListCustomerGroup = async () => {
    setLoading(true);
    try {
      const response = await customerGroupApi.getList(customerGroupReq);
      console.log(response)

      // if (response.meta[0].code !== API_STATUS.SUCCESS) {
      // 	//error
      // 	return;
      // }

      setCustomerGroupRes(response);
      console.log(customerGroupRes);
    } catch (err) {
      console.log(err);
    } finally { setLoading(false); }
  }

  const triggerFormEvent = (value: ICustomerGroupPageRequest) => {
    setCustomerGroupReq({
      ...value,
      page: customerGroupReq.page,
      size: customerGroupReq.size
    });

    // get list CustomerGroup
  }

  let locale = {
    emptyText: (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
    )
  };

  useEffect(() => {
    setIsReload(false);
    getListCustomerGroup();
    console.log('request', customerGroupReq);
  }, [customerGroupReq, isReload])

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Nhóm khách hàng</h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => setOpenFormCreate(true)}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <CustomerGroupSearch customerGroupReq={customerGroupReq} triggerFormEvent={triggerFormEvent} />
      </Flex>
      <div className="table-wrapper">
        <Table
          rowKey={(record) => record.customer_group_id}
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
          columns={columnsCustomerGroup}
          loading={loading}
          dataSource={customerGroupRes.data}
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
                setCustomerGroupReq({
                  ...customerGroupReq,
                  page: 1,
                  size: size
                });
                setPageSize(size);
              }} />
            <h5> Tổng số {customerGroupRes.totalElements || 0}  nhà cung cấp</h5>
          </Flex>


          <Pagination
            total={customerGroupRes.totalElements || 0}
            current={customerGroupRes.page}
            pageSize={customerGroupRes.size}
            showSizeChanger={false}
            onChange={(page) => {
              setCustomerGroupReq({
                ...customerGroupReq,
                page: page,
              });
            }} />
        </Flex>

      </div>

      <CustomerGroupView
        openViewDate={openViewDate}
        onCancel={() => {
          setOpenviewDate(false);
          getListCustomerGroup();
        }}
        data={dataItem}

      />

      <CustomerGroupCreate
        open={openFormCreate}
        onCancel={() => {
          setOpenFormCreate(false);
          getListCustomerGroup();
        }}
      />
    </>
  );
};

export default CustomerGroup;