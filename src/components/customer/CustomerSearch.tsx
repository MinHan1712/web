import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, Select } from "antd";
import { CityType, CustonerType, formItemLayout } from "../../constants/general.constant";
import { useEffect, useState } from "react";
import { ICustomerPageRequest } from "../../interfaces/customer";

interface mapCustomerFormSearchToProps {
  customerReq: ICustomerPageRequest,
  triggerFormEvent: (formValue: any) => void,
}

const CustomerSearch = (props: mapCustomerFormSearchToProps) => {
  const [form] = Form.useForm<ICustomerPageRequest>();


  useEffect(() => {
    form.setFieldsValue({ ...props.customerReq });
  }, [props.customerReq]);

  const eventSummitForm = (formValue: ICustomerPageRequest) => {
    props.triggerFormEvent(formValue);
  }

  const CustomerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

  }
  return (
    <>
      <div style={CustomerStyleContent}>
        <Form form={form} name="Customer_filter" className="common-form wrapper-form"
          style={{ width: '100%' }}
          onFinish={eventSummitForm}>
          <Flex gap="middle" justify="space-between" align={'center'}
            style={{ width: '100%', padding: '5px' }}>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'customer_name'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Khách hàng</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Mã/Tên/Số điện thoại"}
                  name={'customer_name'}
                  id={'customer_name'}
                  value={props.customerReq.customer_code}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'customer_type'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Loại KH</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  placeholder={"Loại KH"}
                  id={'customer_type'}
                  value={props.customerReq.customer_type}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...CustonerType || []]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'city'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tỉnh thành</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  placeholder={"Tỉnh thành"}
                  id={'city'}
                  value={props.customerReq.city}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...CityType || []]}
                />
              </Form.Item>
            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'address'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Địa chỉ</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Nhập địa chỉ"}
                  name={'address'}
                  id={'address'}
                  value={props.customerReq.address}
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
    </>
  )
};

export default CustomerSearch;