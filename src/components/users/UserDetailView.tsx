import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, notification, Select, SelectProps } from "antd";
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
        login: value.login,
        phone: value.phone,
        password: value.password,
        user_name: value.user_name,
        address: value.address,
        status: value.status,
        role_id: value.role_id,
        role_name: value.role_name,
        orig_role_id: props.data.role_id,
        drg_store_id: value.id,
      };
      console.log("update", update);

      await userApi.update(update).then((response) => {
        console.log(response)
        switch (response.meta[0].code) {
          case 200:
            notification['success']({
              message: "Thông báo",
              description: 'Cập nhập nhân viên thành công',
            });
            handleCloseModalView();
            props.onCancel();
            break;
          case 513:
            notification['error']({
              message: "Lỗi",
              description: 'Số điện thoại đã tồn tại, vui lòng nhập SĐT khác',
            });
            break;
          case 517:
            notification['error']({
              message: "Lỗi",
              description: 'Email đã tồn tại, vui lòng nhập email khác',
            });
            break;
          default:
            notification['error']({
              message: "Lỗi",
              description: 'Cập nhập nhân viên không thành công',
            });
            break;
        }
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

  const handleCloseModalView = () => {
    form.resetFields();
    setConfirmLoadingUpdate(false);
    setBtnEdit(false);
  };

  return (
    <>
      <Modal
        open={props.openViewDate}
        title="Tạo danh mục mới"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          handleCloseModalView();
          props.onCancel();

        }}
        width={"70%"}
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
          <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
            <div className="wrapper-column" style={{ width: '40%' }}>
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
                  disabled={!btnEdit}
                />
              </Form.Item>

            </div>
            <div className="wrapper-column" style={{ width: '40%' }}>
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
                  disabled={!btnEdit}
                />
              </Form.Item>
            </div>
            <div className="wrapper-column" style={{ width: '40%' }}>
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
            <div className="wrapper-column" style={{ width: '40%' }}>
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
            <div className="wrapper-column" style={{ width: '40%' }}>
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
          <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
            <div className="wrapper-column" style={{ width: '40%' }}>
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
            <div className="wrapper-column" style={{ width: '40%' }}>
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
                  id={'role_id'}
                  value={props.data.role_id}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...props.optionRole || []]}
                />
              </Form.Item>
            </div>
            <div className="wrapper-column" style={{ width: '40%' }}>
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
                  value={props.data.status}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...activeStatus || []]}
                />
              </Form.Item>
            </div>
            <div className="wrapper-column" style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                name={'drg_store_id'}
                labelAlign={"left"}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Cửa hàng</span>
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
          </Button>
        </Flex>
      </Modal >
    </>
  );
};

export default UserDetailView;
