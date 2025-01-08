import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, notification, Pagination, Select, SelectProps, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceApi from "../apis/invoice.api";
import userApi from "../apis/user.api";
import '../assets/css/style.css';
import InvCustomerSearch from "../components/Invoice/InvCustomerSearch";
import { ImportStatus, selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IInventoryImportPageRequest, IInvoiceImportResponse } from "../interfaces/inventoryImport";
import { IProperty } from "../interfaces/property";
import { IUserWithRoleResponse } from "../interfaces/userManager";
import { getListPayMenthodsOption, getPayMethods } from "../utils/local";
import InvCustomerView from "../components/Invoice/InvCustomerView";


const InvCustomer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [openViewDate, setOpenviewDate] = useState(false);
  const [dataItem, setDataItem] = useState({ inventory_id: '0' });

  const [payMenthodsOption, setMenthodsOption] = useState<SelectProps<string>['options']>([]);
  const [listPayMenthods, setListPayMenthods] = useState<IProperty[]>([]);
  const [usersOptions, setUsersOptions] = useState<SelectProps<string>['options']>([]);
  const [users, setUsersList] = useState<IUserWithRoleResponse[]>([]);
  const navigate = useNavigate();

  // const properties = localStorage.getItem('properties');
  // (properties);

  let stt: number = 1;
  const columnsBill: ColumnsType<IInvoiceImportResponse> = [
    {
      title: "Mã hóa đơn",
      dataIndex: "inventory_code",
      align: "left",
      width: "10%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      )
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
      align: "left",
      width: "14%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      )
    },
    {
      title: "Số điện thoại",
      dataIndex: "customer_phone",
      align: "center",
      width: "10%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Thanh toán',
      dataIndex: "pay_method",
      align: "center",
      width: "10%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{listPayMenthods.find(x => x.value == text)?.value || ''}</span>
        </div>
      )
    },
    {
      title: 'Tổng giảm',
      dataIndex: "discount_amount",
      align: "right",
      width: "11%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ color: "red", fontWeight: '600' }}>{(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
        </div>
      )
    },

    {
      title: 'Thành tiền',
      dataIndex: "amount",
      align: "right",
      width: "11%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ color: "red", fontWeight: '600' }}>{(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
        </div>
      )
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_date",
      align: "center",
      width: "12%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text ? format(new Date(text), "dd-MM-yyyy HH:mm:ss") : ''}</span>
        </div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: "10%",
      render: (text) => {
        return (
          <Tag style={{fontWeight: '600'}} color={ImportStatus.find((x) => x.value == text)?.name} key={text}>
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
    classification: true,
    inventory_type: "ORD",
  });

  const getListInvImport = async () => {
    setLoading(true);
    try {
      await invoiceApi.getList(invImportReq).then((response) => {
        if (response.meta.code === 200) {
          //error
          setInvImportRes(response.data);
          return;
        } else {
          notification['error']({
            message: "Lỗi",
            description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
          });
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

  const getListUserManger = async () => {
    await userApi.get({ page: 0, size: 0 })
      .then((response) => {
        if (response.meta.code === 200) {
          setUsersList(response.data.data);
          setUsersOptions(response.data.data.map((user: IUserWithRoleResponse) => {
            return {
              value: user.login,
              label: user.user_name
            }
          }));
        }
      }).catch(() => {

      })
  }

  const triggerFormEvent = (value: IInventoryImportPageRequest) => {
    setInvImportReq({
      ...value,
      page: invImportReq.page,
      size: invImportReq.size,
      classification: invImportReq.classification,
      inventory_type: invImportReq.inventory_type
    });
    // create a new instance
  }

  const handleCreateReceipt = () => {
    navigate('/taohoadon');
  };

  useEffect(() => {
    setMenthodsOption(getListPayMenthodsOption);
    getListUserManger();
    setListPayMenthods(getPayMethods)
  }, []);

  useEffect(() => {
    getListInvImport();
  }, [invImportReq])

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Tra cứu hóa đơn</h3>
          <Button
            className="button btn-add"
            type="primary"
            onClick={() => handleCreateReceipt()}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <InvCustomerSearch InvImportReq={invImportReq} triggerFormEvent={triggerFormEvent} user={usersOptions} payMentod={payMenthodsOption} />
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
          columns={columnsBill}
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

      <InvCustomerView
        open={openViewDate}
        onCancel={() => {
          setOpenviewDate(false);
          getListInvImport();
        }}
        data={dataItem}
        payMenthods={listPayMenthods}
        users={users}
      />

    </>
  );
};

export default InvCustomer;