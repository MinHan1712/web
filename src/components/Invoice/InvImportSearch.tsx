import { DownloadOutlined, FileExcelFilled, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, Select, SelectProps } from "antd";
import { formItemLayout, ImportStatus } from "../../constants/general.constant";
import { useEffect } from "react";
import { ICustomerPageRequest } from "../../interfaces/customer";
import dayjs from 'dayjs';
import { IInventoryImportPageRequest } from "../../interfaces/inventoryImport";

interface mapDrgFormSearchToProps {
  InvImportReq: IInventoryImportPageRequest,
  triggerFormEvent: (formValue: any) => void,
  Provides: SelectProps<string>['options'],
  ImportType: SelectProps<string>['options'],
  exportToExcel: () => void
}

const InvImportSearch = (props: mapDrgFormSearchToProps) => {
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
          <Flex gap="middle" justify="space-between" align={'center'}
            style={{ width: '100%', padding: '5px' }}>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'inventory_code'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã phiếu nhập</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Nhập mã phiếu nhập"}
                  name={'inventory_code'}
                  id={'inventory_code'}
                  value={props.InvImportReq.inventory_code}
                  prefix={<SearchOutlined />}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'provider_id'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên NCC</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  id={'provider_id'}
                  placeholder="Tên NCC"
                  value={props.InvImportReq.provider_id}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...props.Provides || []]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'drug_name'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên / Mã SP</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Tên / Mã SP"}
                  name={'drug_name'}
                  id={'drug_name'}
                  value={props.InvImportReq.drug_name}
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
                name={'inventory_type'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Loại nhập</span>
                }
              >
                <Select
                  className="d-flex"
                  size="middle"
                  id={'inventory_type'}
                  placeholder= "Loại nhập"
                  value={props.InvImportReq.inventory_type}
                  options={[{
                    value: '',
                    label: 'Tất cả'
                  }, ...props.ImportType || []]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '30%' }}>
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
            <div style={{ width: '30%' }}>
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
          <Flex gap="middle" justify="space-between" align={'center'}
            style={{ width: '100%', padding: '5px' }}>
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
                  placeholder="Từ ngày" value={props.InvImportReq.to_time && dayjs(props.InvImportReq.to_time, "YYYY-MM-DD").format("YYYY-MM-DD") || ''} />
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
                  placeholder="Đến ngày" value={props.InvImportReq.from_time && dayjs(props.InvImportReq.from_time, "YYYY-MM-DD").format("YYYY-MM-DD") || ''} />
              </Form.Item>

            </div>
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
                <Button 
                  className="button button-blue"
                  type="primary" onClick={() => {
                      props.exportToExcel();
                  }}>
                  <DownloadOutlined style={{ verticalAlign: "baseline" }} />
                  <span>Xuất excel</span>
                </Button>
              </Flex>
            </div>
          </Flex>
        </Form>
      </div>
    </>
  );
};

export default InvImportSearch;