import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, Select, SelectProps } from "antd";
import { formItemLayout, ImportStatus } from "../../constants/general.constant";
import { useEffect } from "react";
import { ICustomerPageRequest } from "../../interfaces/customer";
import dayjs from 'dayjs';
import { IInventoryImportPageRequest } from "../../interfaces/inventoryImport";

interface mapDrgFormSearchToProps {
  InvImportReq: IInventoryImportPageRequest,
  triggerFormEvent: (formValue: any) => void,
  user: SelectProps<string>['options'],
  payMentod: SelectProps<string>['options'],
}

const InvCustomerSearch = (props: mapDrgFormSearchToProps) => {
  const [form] = Form.useForm<IInventoryImportPageRequest>();


  useEffect(() => {
    form.setFieldsValue({ ...props.InvImportReq });
  }, [props.InvImportReq]);

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
          <Flex gap="middle" justify="space-between">
            <Flex gap="middle" vertical justify="flex-start" align={'center'}
              style={{ width: '30%', padding: '5px' }}>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'inventory_code'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã hóa đơn</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={"Nhập mã hóa đơn"}
                    name={'inventory_code'}
                    id={'inventory_code'}
                    value={props.InvImportReq.inventory_code}
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>

              </div>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'drug_name'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên SP</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={"Tên SP"}
                    name={'drug_name'}
                    id={'drug_name'}
                    value={props.InvImportReq.inventory_code}
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>

              </div>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'lot'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Số lô</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={"Nhập số lô"}
                    name={'lot'}
                    id={'lot'}
                    value={props.InvImportReq.lot}
                    prefix={<SearchOutlined />}
                  />

                </Form.Item>

              </div>

            </Flex>
            <Flex gap="middle" vertical justify="flex-start" align={'center'}
              style={{ width: '30%', padding: '5px' }}>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'customer_name'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên KH</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={"Nhập tên/sdt KH"}
                    name={'customer_name'}
                    id={'customer_name'}
                    value={props.InvImportReq.inventory_code}
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>

              </div>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'to_time'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Từ ngày</span>
                  }
                >
                  <DatePicker format={"DD/MM/YYYY"} name="Từ ngày" className="form-input d-flex" size="middle"
                    placeholder="Từ ngày" value={props.InvImportReq.to_time && dayjs(props.InvImportReq.to_time, "YYYY-MM-DD").format("YYYY-MM-DD") || ''} />
                </Form.Item>

              </div>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'from_time'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Đến ngày</span>
                  }
                >
                  <DatePicker format={"DD/MM/YYYY"} name="Từ ngày" className="form-input d-flex" size="middle"
                    placeholder="Đến ngày" value={props.InvImportReq.from_time && dayjs(props.InvImportReq.from_time, "YYYY-MM-DD").format("YYYY-MM-DD") || ''} />
                </Form.Item>

              </div>
            </Flex>

            <Flex gap="middle" vertical justify="flex-start" align={'center'}
              style={{ width: '30%', padding: '5px' }}>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'pay_menthod'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Thanh toán</span>
                  }
                >
                  <Select
                    className="d-flex"
                    size="middle"
                    id={'pay_menthod'}
                    placeholder="Thanh toán"
                    value={props.InvImportReq.pay_menthod}
                    options={[{
                      value: '',
                      label: 'Tất cả'
                    }, ...props.payMentod || []]}
                  />
                </Form.Item>

              </div>
              <div style={{ width: '100%' }}>
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
                    value={props.InvImportReq.status}
                    options={[{
                      value: '',
                      label: 'Tất cả'
                    }, ...ImportStatus || []]}
                  />
                </Form.Item>

              </div>
              <div style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'updated_user'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Người thực hiện</span>
                  }
                >
                  <Select
                    className="d-flex"
                    size="middle"
                    id={'updated_user'}
                    placeholder="Người thực hiện"
                    value={props.InvImportReq.updated_user}
                    options={[{
                      value: '',
                      label: 'Tất cả'
                    }, ...props.user || []]}
                  />
                </Form.Item>

              </div>
              <div style={{ width: '100%' }}>
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
            </Flex>
          </Flex>
        </Form>
      </div >
    </>
  );
};

export default InvCustomerSearch;