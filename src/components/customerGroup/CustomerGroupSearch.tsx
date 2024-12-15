import { SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Select } from "antd";
import { CustonerGroupType, formItemLayout } from "../../constants/general.constant";
import { useEffect } from "react";
import { ICustomerPageRequest } from "../../interfaces/customer";
import { ICustomerGroupPageRequest } from "../../interfaces/customerGroup";

interface mapCustomerGroupFormSearchToProps {
  customerGroupReq: ICustomerGroupPageRequest,
  triggerFormEvent: (formValue: any) => void,
}

const CustomerGroupSearch = (props: mapCustomerGroupFormSearchToProps) => {
  const [form] = Form.useForm<ICustomerGroupPageRequest>();


  useEffect(() => {
    form.setFieldsValue({ ...props.customerGroupReq });
  }, [props.customerGroupReq]);

  const eventSummitForm = (formValue: ICustomerGroupPageRequest) => {
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
                name={'customer_group_name'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên nhóm</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Nhập tên / mã nhóm khách hàng"}
                  name={'customer_group_name'}
                  id={'customer_group_name'}
                  value={props.customerGroupReq.customer_group_name}
                  prefix={<SearchOutlined />}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'customer_group_type'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Loại nhóm</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  placeholder={"Loại nhóm"}
                  id={'customer_group_type'}
                  value={props.customerGroupReq.customer_group_type}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...CustonerGroupType || []]}
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
  );
};

export default CustomerGroupSearch;