import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, Select, SelectProps } from "antd";
import { formItemLayout, ImportStatus } from "../../constants/general.constant";
import { useEffect } from "react";
import { ICustomerPageRequest } from "../../interfaces/customer";
import dayjs from 'dayjs';
import { IInventoryImportPageRequest } from "../../interfaces/inventoryImport";

interface Props {
  invSummaryReq: IInventoryImportPageRequest,
  triggerFormEvent: (formValue: any) => void,
  users: SelectProps<string>['options'],
}

const InvSummarySearch = (props: Props) => {
  const [form] = Form.useForm<IInventoryImportPageRequest>();


  useEffect(() => {
    form.setFieldsValue({ ...props.invSummaryReq });
  }, [props.invSummaryReq]);

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
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Người kiểm</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  id={'customer_name'}
                  placeholder="Người kiểm"
                  value={props.invSummaryReq.customer_name}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...props.users || []]}
                />
              </Form.Item>

            </div>

            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'to_time'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Từ ngày</span>
                }
              >
                <DatePicker format={"DD/MM/YYYY"} name="Từ ngày" className="form-input d-flex" size="middle"
                  placeholder="Từ ngày" value={props.invSummaryReq.to_time && dayjs(props.invSummaryReq.to_time, "YYYY-MM-DD").format("YYYY-MM-DD") || ''} />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'from_time'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Đến ngày</span>
                }
              >
                <DatePicker format={"DD/MM/YYYY"} name="Từ ngày" className="form-input d-flex" size="middle"
                  placeholder="Đến ngày" value={props.invSummaryReq.from_time && dayjs(props.invSummaryReq.from_time, "YYYY-MM-DD").format("YYYY-MM-DD") || ''} />
              </Form.Item>

            </div>

          </Flex>
          <Flex gap="middle" justify="space-between" align={'center'}
            style={{ width: '100%', padding: '5px' }}>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'drug_name'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên/Mã SP</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Tên/Mã SP"}
                  name={'drug_name'}
                  id={'drug_name'}
                  value={props.invSummaryReq.drug_name}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}></div>
            <div style={{ width: '30%' }}>
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
        </Form>
      </div >
    </>
  );
};

export default InvSummarySearch;