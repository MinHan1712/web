import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Form, Input, notification, Pagination, Select, SelectProps, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import userApi from "../apis/user.api";
import UserCreate from "../components/users/UserCreate";
import UserDetailView from "../components/users/UserDetailView";
import { activeStatus, formItemLayout, selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IUserWithRolePageRequest, IUserWithRoleResponse } from "../interfaces/userManager";
import { getListRoleOption } from "../utils/local";

interface Props {
  triggerFormEvent: (formValue: any) => void,
  userRequest: IUserWithRolePageRequest;
  optionRole: SelectProps<string>['options'];
}

const UserManagerSearch = (props: Props) => {
  const [form] = Form.useForm<IUserWithRolePageRequest>();

  const eventSummitForm = (formValue: IUserWithRolePageRequest) => {
    props.triggerFormEvent(formValue);
  }

  const providerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

  }

  return (
    <div style={providerStyleContent}>
      <Form
        form={form}
        name="advanced_search"
        className="common-form wrapper-form flex-column"
        style={{ width: '100%' }}
        onFinish={eventSummitForm}
      >
        <Flex gap="middle" justify="space-between" align={'center'}
          style={{ width: '100%', padding: '5px' }}>
          <div style={{ width: '40%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'user_name'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhân viên</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={"Tên nhân viên"}
                name={'user_name'}
                id={'user_name'}
                value={props.userRequest.user_name}
              />
            </Form.Item>
          </div>
          <div style={{ width: '40%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'phone'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={"Số điện thoại"}
                name={'phone'}
                id={'phone'}
                value={props.userRequest.phone}
              />
            </Form.Item>
          </div>
          <div style={{ width: '40%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'email'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Email</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={"Email"}
                name={'email'}
                id={'email'}
                value={props.userRequest.phone}
              />
            </Form.Item>
          </div>
          <div style={{ width: '40%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'status'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Trạng thái</span>
              }
            >
              <Select
                className="d-flex"
                size="middle"
                placeholder={"Trạng thái"}
                id={'status'}
                value={props.userRequest.status}
                options={[{
                  value: '',
                  label: 'Tất cả'
                }, ...activeStatus || []]}
              />
            </Form.Item>

          </div>
          <div style={{ width: '40%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'role_id'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Chức vụ</span>
              }
            >
              <Select
                className="d-flex"
                size="middle"
                placeholder={"Chức vụ"}
                id={'role_id'}
                value={props.userRequest.role_id}
                options={[{
                  value: '',
                  label: 'Tất cả'
                }, ...props.optionRole || []]}
              />
            </Form.Item>

          </div>
        </Flex>
      </Form>
      <Flex gap="middle" justify="flex-end" align={'center'} style={{ width: '100%', paddingBottom: '10px' }}>
        <Button
          className="button btn-add"
          type="primary" onClick={() => {
            form.submit();
          }}>
          <SearchOutlined style={{ verticalAlign: "baseline" }} />
          <span>Tìm kiếm</span>
        </Button>
      </Flex>
    </div>
  );
};

const UserManager = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));

  const [openViewDate, setOpenviewDate] = useState(false);
  const [openFormCreate, setOpenFormCreate] = useState(false);
  const [dataItem, setDataItem] = useState({ id: '0' });
  const [isReload, setIsReload] = useState(false);
  const [optionRole, setOptionRole] = useState<SelectProps<string>['options']>();

  const [userRoleRes, setUserRoleRes] = useState<IPageResponse<IUserWithRoleResponse[]>>({
    page: 1,
    size: 20,
    totalElements: 0,
    data: []
  });

  const [userRoleReq, setUserRoleReq] = useState<IUserWithRolePageRequest>({
    page: 1,
    size: 20
  });

  const getListUserManger = async () => {
    setLoading(true);
    await userApi.get(userRoleReq)
      .then((response) => {
        if (response.meta.code === 200) {
          setUserRoleRes(response.data);
        } else {
          notification['error']({
            message: "Thông báo",
            description: 'Có một lỗi nào đó xảy ra, vui lòng tải lại trang',
          });
        }
      }).catch((error) => {
        notification['error']({
          message: "Thông báo",
          description: 'Có một lỗi nào đó xảy ra, vui lòng tải lại trang',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }
  var count = 1;
  const columnsUserManger: ColumnsType<IUserWithRoleResponse> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: 'center',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{count++}</span>
        </div>
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      key: "user_name",
      width: "15%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "provider_name",
      key: "provider_name",
      width: "15%",
      align: "left",
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
      align: "center",
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
      width: "20%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "role_name",
      key: "role_name",
      width: "12%",
      align: "center",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "8%",
      align: "center",
      render: (text) => {
        let color = text === "1" ? "green" : "red";
        return (
          <div className="style-text-limit-number-line2">
            <Tag color={color} key={text} className="style-text-limit-number-line2" style={{ textAlign: 'center', padding: '2px' }}>
              {text === true ? "Đang hoạt động" : 'Không hoạt động'}
            </Tag>
          </div>
        );

      },
    }
  ];

  const triggerFormEvent = (value: IUserWithRolePageRequest) => {
    setUserRoleReq({
      ...value,
      page: userRoleReq.page,
      size: userRoleReq.size
    });
  }

  useEffect(() => {
    setIsReload(false);
    getListUserManger();
    console.log('request', userRoleReq);
  }, [userRoleReq, isReload])

  useEffect(() => {
    setOptionRole(getListRoleOption());
  }, [])

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Quản lý nhân viên</h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => setOpenFormCreate(true)}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <UserManagerSearch userRequest={userRoleReq} triggerFormEvent={triggerFormEvent} optionRole={optionRole} />
      </Flex>

      <div className="table-wrapper">
        <Table
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
            )
          }}
          rowKey={(record) => record.id}
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
          columns={columnsUserManger}
          loading={loading}
          dataSource={userRoleRes.data}
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
                setUserRoleReq({
                  ...userRoleReq,
                  page: 1,
                  size: size
                });
                setPageSize(size);
              }} />
            <h5> Tổng số {userRoleRes.totalElements || 0} nhân viên</h5>
          </Flex>


          <Pagination
            total={userRoleRes.totalElements || 0}
            current={userRoleRes.page}
            pageSize={userRoleRes.size}
            showSizeChanger={false}
            onChange={(page) => {
              setUserRoleReq({
                ...userRoleReq,
                page: page,
              });
            }} />
        </Flex>

      </div >

      <UserDetailView
        openViewDate={openViewDate}
        onCancel={() => {
          setOpenviewDate(false);
          getListUserManger();
        }}
        data={dataItem}
        optionRole={optionRole}

      />

      <UserCreate
        open={openFormCreate}
        onCancel={() => {
          setOpenFormCreate(false);
          getListUserManger();
        }}
        optionRole={optionRole}
      />
    </>
  )
};

export default UserManager;