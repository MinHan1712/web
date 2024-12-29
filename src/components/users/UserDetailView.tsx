import {
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, notification, Popconfirm, Select, SelectProps } from "antd";
import { useEffect, useState } from "react";
import userApi from "../../apis/user.api";
import { activeStatus, formItemLayout } from "../../constants/general.constant";
import { IUserRequestUpdate, IUserWithRoleResponse } from "../../interfaces/userManager";

interface IModalProviderViewProps {
  openViewDate: boolean;
  onCancel: () => void;
  data: IUserWithRoleResponse;
  optionRole: SelectProps<string>['options'];
}

const UserDetailView = (props: IModalProviderViewProps) => {

  const [form] = Form.useForm<IUserWithRoleResponse>();
  const [isSummitForm, setIsSummitForm] = useState(false);
  const [btnEdit, setBtnEdit] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ ...props.data });
  }, [props.data]);




  useEffect(() => {
    if (isSummitForm) form.submit();
  }, [isSummitForm]);

  const updateUser = async (value: IUserWithRoleResponse) => {
    try {
      let update: IUserRequestUpdate = {
        id: value.id,
        active: value.active,
        email: value.email,
        login: props.data.login,
        phone: value.phone,
        password: value.password,
        user_name: value.user_name,
        address: value.address,
        status: value.status,
        role_id: value.role_id,
        role_name: value.role_name,
      };
      console.log("update", update);

      await userApi.update(update).then((response) => {
        console.log(response)
        // switch (response.meta[0].code) {
        //   case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Cập nhập nhân viên thành công',
        });
        handleCloseModalView();
        props.onCancel();
        //     break;
        //   case 513:
        //     notification['error']({
        //       message: "Lỗi",
        //       description: 'Số điện thoại đã tồn tại, vui lòng nhập SĐT khác',
        //     });
        //     break;
        //   case 517:
        //     notification['error']({
        //       message: "Lỗi",
        //       description: 'Email đã tồn tại, vui lòng nhập email khác',
        //     });
        //     break;
        //   default:
        //     notification['error']({
        //       message: "Lỗi",
        //       description: 'Cập nhập nhân viên không thành công',
        //     });
        //     break;
        // }
      })
        .catch((error) => {
          notification['error']({
            message: "Lỗi",
            description: 'Cập nhập nhân viên không thành công',
          });
        })
        .finally(() => {
          setConfirmLoadingUpdate(false);
        })

    } catch (err) {
      console.log(err);
    } finally { setConfirmLoadingUpdate(false); }
  }

  const deleteUser = async () => {
    return userApi.delete(props.data.login)
      .then((response) => {
        // switch (response.meta[0].code) {
        //     case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Xóa nhân viên thành công',
        });
        handleCloseModalView();
        props.onCancel();
        // break;
        //     default:
        //         notification['error']({
        //             message: "Lỗi",
        //             description: 'Xóa nhân viên không thành công',
        //         });
        //         break;
        // }
      })
      .catch(() => {
        notification['error']({
          message: "Lỗi",
          description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
        });
      }).finally(() => {
      })
  }


  const handleCloseModalView = () => {
    form.resetFields();
    setConfirmLoadingUpdate(false);
    setConfirmLoadingDelete(false);
    setBtnEdit(false);
  };

  return (
    <>
      <Modal
        open={props.openViewDate}
        title="Chi tiết nhân viên"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          handleCloseModalView();
          props.onCancel();

        }}
        width={"55%"}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          name="providerInformation"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%", padding: '0 10px' }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={updateUser}
        >
          <Flex gap="middle" justify="space-between" style={{ width: '100%' }}>
            <Flex gap="middle" vertical justify="flex-start" align="self-start" style={{ width: '40%' }}>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'user_name'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên nhân viên</span>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder="Nhập tên nhân viên"
                    prefix={<UserOutlined />}
                    name='user_name'
                    status={!props.data.user_name ? 'error' : ''}
                    id={'user_name'}
                    value={props.data.user_name}
                    disabled={true}
                  />
                </Form.Item>

              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name={'phone'}
                  labelAlign={"left"}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder="Nhập số điện thoại nhân viên"
                    name={'phone'}
                    id={'phone'}
                    prefix={<PhoneOutlined />}
                    value={props.data.phone}
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name={'password'}
                  labelAlign={"left"}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mật khẩu</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder="Nhập mật khẩu"
                    name={'password'}
                    id={'password'}
                    value={props.data.password}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name={'confirm_pasword'}
                  labelAlign={"left"}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhập lại mật khẩu</span>
                  }
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder="Nhập lại mật khẩu"
                    name={'confirm_pasword'}
                    id={'confirm_pasword'}
                    value={props.data.confirm_pasword}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name={'address'}
                  labelAlign={"left"}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Địa chỉ</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder="Địa chỉ"
                    name={'address'}
                    id={'address'}
                    value={props.data.address}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
            </Flex>

            <Flex gap="middle" vertical justify="flex-start" align="self-start" style={{ width: '40%' }}>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name={'email'}
                  labelAlign={"left"}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Email</span>
                  }
                  rules={[
                    {
                      type: 'email',
                      message: 'Định dạng email không đúng!',
                    }
                  ]}
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder="Nhập email nhân viên"
                    name={'email'}
                    id={'email'}
                    prefix={<MailOutlined />}
                    value={props.data.email}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
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
                    value={props.data.role_id}
                    options={[...props.optionRole || []]}
                  />

                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'status'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Trạng thái  <p>{props.data.status}</p></span>
                  }
                >
                  <Select
                    className="d-flex"
                    size="middle"
                    placeholder={"Trạng thái"}
                    id={'status'}
                    value={props.data.status}
                    disabled={!btnEdit}
                    options={[...activeStatus || []]}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name={'drg_store_id'}
                  labelAlign={"left"}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã cửa hàng</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder="Cửa hàng"
                    name={'drg_store_id'}
                    id={'drg_store_id'}
                    value={props.data.drg_store_id}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
            </Flex>
          </Flex>
        </Form>
        <Flex gap="middle" justify="flex-end" align={'center'} style={{ borderTop: '1px solid #e2e3e5', paddingTop: '10px' }}>
          <Button
            className="button btn-cancel"
            type="primary"
            onClick={() => {
              handleCloseModalView();
              props.onCancel();
            }}
          >
            <span>Hủy</span>
          </Button>
          {props.data.role_id?.toString() === "1" ? <></> : <>
            <Popconfirm
              title="Title"
              description="Bạn có chắc chắn muốn xoá nhà cung cấp?"
              onConfirm={deleteUser}
              okText='Đồng ý'
              cancelText='Hủy'
              okButtonProps={{ loading: confirmLoadingDelete }}
            >
              <Button
                className="button btn-delete"
                type="primary"
              >
                <DeleteOutlined style={{ paddingRight: '5px' }} />
                <span>Xóa</span>
              </Button>
            </Popconfirm>
            <Button
              className="button btn-add"
              type="primary"
              loading={confirmLoadingUpdate}
              onClick={() => {
                setBtnEdit(!btnEdit);
                if (btnEdit) {
                  setConfirmLoadingUpdate(true);
                  setIsSummitForm(!isSummitForm);
                }
              }}
            >
              {btnEdit ? <EditOutlined /> : <EditOutlined />}
              <span>{btnEdit ? "Lưu" : "Sửa"}</span>
            </Button></>
          }
        </Flex>
      </Modal >
    </>
  );
};

export default UserDetailView;
