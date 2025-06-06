import { SearchOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Flex, Form, Input, Select } from "antd";
import { CustonerType, formItemLayout, StatusType } from "../../constants/general.constant";
import { useEffect } from "react";
import { ICustomerPageRequest } from "../../interfaces/customer";
import { IDrugPageRequest } from "../../interfaces/drug";
import dayjs from 'dayjs';

interface mapDrgFormSearchToProps {
  productReq: IDrugPageRequest,
  triggerFormEvent: (formValue: any) => void,
}

const ProductSearch = (props: mapDrgFormSearchToProps) => {
  const [form] = Form.useForm<IDrugPageRequest>();


  useEffect(() => {
    form.setFieldsValue({ ...props.productReq });
  }, [props.productReq]);

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
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tìm kiếm</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Nhập mã thuốc, tên thuốc,..."}
                  name={'drug_name'}
                  id={'drug_name'}
                  value={props.productReq.drug_name}
                  prefix={<SearchOutlined />}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'drug_group'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Phân nhóm</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  placeholder={"Phân nhóm"}
                  id={'drug_group'}
                  value={props.productReq.drug_group}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...CustonerType || []]} //TODO
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'city'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Hãng sản xuất</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Nhập tên hãng sản xuất"}
                  name={'company_name'}
                  id={'company_name'}
                  value={props.productReq.company_name}
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </div>
          </Flex>
          <Flex gap="middle" justify="space-between" align={'center'}
            style={{ width: '100%', padding: '5px' }}>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'create_date'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày nhập</span>
                }
              >
                <DatePicker format={"DD/MM/YYYY"} name="create_date" className="form-input d-flex" size="middle"
                  placeholder="Chọn ngày" value={props.productReq.create_date && dayjs(props.productReq.create_date, "YYYY-MM-DD").format("YYYY-MM-DD") || ''} />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'drug_kind'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhóm thuốc</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  placeholder={"Phân nhóm"}
                  id={'drug_kind'}
                  value={props.productReq.drug_kind}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...CustonerType || []]} //TODO
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'status'}
                initialValue={['0', '1']}
              >
                <Checkbox.Group options={StatusType} name="status" />

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

export default ProductSearch;