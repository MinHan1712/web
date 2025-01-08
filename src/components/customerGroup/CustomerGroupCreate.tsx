import {
  CloseCircleOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, notification, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import customerGroupApi from "../../apis/customerGroup.api";
import { formItemLayout } from "../../constants/general.constant";
import { ICustomerGroupCreate } from "../../interfaces/customerGroup";


interface ICustomerGroupInformationProps {
  open: boolean;
  onCancel: () => void;
}

const CustomerGroupCreate = (props: ICustomerGroupInformationProps) => {

  const [form] = Form.useForm<ICustomerGroupCreate>();
  const [loading, setLoading] = useState(false);

  const eventSummitForm = (formValue: ICustomerGroupCreate) => {
    setLoading(true);
    createCustomerGroup(formValue);
  }

  const createCustomerGroup = async (value: ICustomerGroupCreate) => {
    try {
      await customerGroupApi.create(value).then((response) => {
        switch (response.meta.code) {
          case 200:
            notification['success']({
              message: "Thông báo",
              description: 'Thêm nhóm khách hàng thành công',
            });
            form.resetFields();
            props.onCancel();
            break;
          default:
            notification['error']({
              message: "Lỗi",
              description: 'Thêm nhóm khách hàng không thành công',
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


  return (
    <Modal
      open={props.open}
      className="modal-customer-group"
      closeIcon={<CloseOutlined />}
      title="Thêm nhóm khách hàng"
      maskClosable={false}
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields();
        props.onCancel();
      }}
      width={"35%"}
      footer={[
        <Button
          key="back"
          className="button btn-cancel d-block"
          type="primary"
          onClick={() => {
            form.resetFields();
            props.onCancel();
          }}
        >
          <CloseCircleOutlined style={{ verticalAlign: "baseline" }} />
          <span>Đóng</span>
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={(event) => {
            event.preventDefault();
            form.submit();
          }}
          className="button btn-add d-block"
        >
          <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
          <span>Thêm mới</span>
        </Button>,
      ]}
    >
      <Form
        name="CustomerGroupCreate"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "100%", padding: '0 10px' }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={eventSummitForm}
      >
        <Flex gap="middle" vertical justify="flex-end" align={'center'} style={{ width: '100%' }}>
          <div className="wrapper-column" style={{ width: '100%' }}>
            {/* <Form.Item<ICustomerGroupCreate>
              {...formItemLayout}
              labelAlign={"left"}
              name={'customer_group_cd'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã nhóm khách hàng</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập mã nhóm khách hàng'}
                name={'customer_group_code'}
                id={'customer_group_code'}
              />
            </Form.Item> */}
          </div>
          <div className="wrapper-column" style={{ width: '100%' }}>
            <Form.Item<ICustomerGroupCreate>
              {...formItemLayout}
              name={'customer_group_name'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên nhóm khách hàng</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập tên nhóm khách hàng'}
                name={'customer_group_name'}
                id={'customer_group_name'}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '100%' }}>
            <Form.Item<ICustomerGroupCreate>
              {...formItemLayout}
              labelAlign={"left"}
              name={'note'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Mô tả</span>
              }
            >
              <TextArea
                rows={3}
                className="form-input d-flex"
                size="middle"
                name={'note'}
                id={'note'}
              />
            </Form.Item>
          </div>
        </Flex>
      </Form>

    </Modal>
  );
};

export default CustomerGroupCreate;