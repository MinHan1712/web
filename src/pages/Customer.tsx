
import {
  Button, Col,
  Flex,
  Form,
  Pagination,
  Popconfirm,
  Row,
  Select,
  SelectProps,
  Table,
  Tag
} from "antd";

import {
  DeleteOutlined,
  PlusCircleOutlined, SearchOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";

import '../assets/css/style.css';
import { CustonerType, selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { ICustomerPageRequest, ICustomerResponse } from "../interfaces/customer";
import customerApi from "../apis/customer.api";
import { ColumnsType } from "antd/es/table";
import { AlignType } from "rc-table/lib/interface";
import CustomerSearch from "../components/customer/CustomerSearch";
import CustomerCreate from "../components/customer/CustomerCreate";
import CustomerView from "../components/customer/CustomerView";

const columns: ColumnsType<ICustomerResponse> = [
  {
    title: "Mã Khách hàng",
    dataIndex: "customer_code",
    key: "customer_code",
    width: "10%",
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Tên khách hàng",
    dataIndex: "customer_name",
    key: "customer_name",
    width: "20%",
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Số điện thoại",
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
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: "15%",
    align: "left" as AlignType,
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Loại khách hàng",
    dataIndex: "customer_type",
    key: "customer_type",
    width: "10%",
    align: "center" as AlignType,
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>
          <Tag style={{ fontWeight: "600" }} color="#012970">
            {CustonerType.find((x) => x.value == text)?.label}
          </Tag>
        </span>
      </div>
    ),
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
    width: "15%",
    align: "left" as AlignType,
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span>{text}</span>
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
        <span style={{ fontWeight: "600", color: "red" }}>{Number(text || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
      </div>
    ),
  },
  {
    title: "Tổng mua",
    dataIndex: "amount",
    key: "amount",
    width: "10%",
    align: "right" as AlignType,
    sorter: (a, b) => (a.amount ? a.amount : 0) - (b.amount ? b.amount : 0),
    render: (text) => (
      <div className="style-text-limit-number-line2">
        <span style={{ fontWeight: "600", color: "red" }}>{Number(text || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
      </div>
    ),
  },
];


const Customer = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [openViewDate, setOpenviewDate] = useState(false);
  const [dataItem, setDataItem] = useState({ customer_id: '0' });
  const [openFormCreate, setOpenFormCreate] = useState(false);
  const [isReload, setIsReload] = useState(false);

  const [customerRes, setCustomerRes] = useState<IPageResponse<ICustomerResponse[]>>({
    page: 1,
    size: 20,
    totalElements: 0,
    data: []
  });

  const [customerReq, setCustomerReq] = useState<ICustomerPageRequest>({
    page: 1,
    size: 20
  });

  const getListCustomer = async () => {
    setLoading(true);
    try {
      const response = await customerApi.getList(customerReq);
      console.log(response)
      setCustomerRes(response.data);
    } catch (err) {
      console.log(err);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    setIsReload(false);
    getListCustomer();
    console.log('request', customerReq);
  }, [customerReq, isReload])

  const triggerFormEvent = (value: ICustomerPageRequest) => {
    setCustomerReq({
      ...value,
      page: customerReq.page,
      size: customerReq.size
    });
  }


  return (

    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Khách hàng</h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => setOpenFormCreate(true)}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <CustomerSearch customerReq={customerReq} triggerFormEvent={triggerFormEvent} />
      </Flex>
      <div className="table-wrapper">
        <Table
          rowKey={(record) => record.customer_id}
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
          columns={columns}
          loading={loading}
          dataSource={customerRes.data}
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
                setCustomerReq({
                  ...customerReq,
                  page: 1,
                  size: size
                });
                setPageSize(size);
              }} />
            <h5> Tổng số {customerRes.totalElements || 0}  nhà cung cấp</h5>
          </Flex>


          <Pagination
            total={customerRes.totalElements || 0}
            current={customerRes.page}
            pageSize={customerRes.size}
            showSizeChanger={false}
            onChange={(page) => {
              setCustomerReq({
                ...customerReq,
                page: page,
              });
            }} />
        </Flex>

      </div>

      <CustomerView
        openViewDate={openViewDate}
        onCancel={() => {
          setOpenviewDate(false);
          getListCustomer();
        }}
        data={dataItem}

      />
      <CustomerCreate
        open={openFormCreate}
        onCancel={() => {
          setOpenFormCreate(false);
          getListCustomer();
        }}
      />
    </>
  );
};

export default Customer;

