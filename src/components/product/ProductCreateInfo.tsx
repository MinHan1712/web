
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Input, Select, SelectProps, Space } from "antd";
import '../../assets/css/style.css';
import { CityType, formItemLayout, vat } from "../../constants/general.constant";
import DrugKind from "./drugKind";
import { useState } from "react";
import { IDrugKindResponse } from "../../interfaces/drugKind";
import { IDrugGroupResponse } from "../../interfaces/drugGroup";
import DrugGroup from "./drugGroup";

interface Props {
  optionKind: SelectProps<string>['options'];
  optionGroup: SelectProps<string>['options'];
  listKind: IDrugKindResponse[];
  listGroups: IDrugGroupResponse[];
  btnEdit: boolean;
}
const ProductCreateInfo = (props: Props) => {
  const [openDrgKind, setOpenDrgKind] = useState(false);
  const [openDrgGroup, setOpenDrgGroup] = useState(false);
  const [isSettingButton, setIsSettingButton] = useState(false);
  const [drgKindItem, setDrgKindItem] = useState<IDrugKindResponse>();
  const [drgGroupItem, setDrgGroupItem] = useState<IDrugGroupResponse>();

  return (
    <>

      <Flex justify="space-between" align={'center'} style={{ width: '100%' }}>
        <Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '90%' }}>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'drug_code'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã sản phẩm</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Mã sản phẩm (Nhà thuốc tự định nghĩa)"}
                name={'drug_code'}
                id={'drug_code'}
                disabled={true}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'drug_name'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên sản phẩm</span>
              }
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập thông tin',
                  whitespace: true
                }
              ]}
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập tên thuốc"}
                name={'drug_name'}
                id={'drug_name'}
                disabled={!props.btnEdit}

              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'concentration'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Hàm lượng</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={'Nhập hàm lượng thuốc'}
                name={'concentration'}
                id={'concentration'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'active_ingredient'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Hoạt chất</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập hoạt chất thuốc'}
                name={'active_ingredient'}
                id={'active_ingredient'}
                disabled={!props.btnEdit}

              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'package_desc'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Quy cách đóng gói</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập quy cách đóng gói'}
                name={'package_desc'}
                id={'package_desc'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'license_cd'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Số đăng kí</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập số đăng kí'}
                name={'license_cd'}
                id={'license_cd'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
        </Flex>
        <Flex gap="middle" vertical justify="flex-end" align={'center'} style={{ width: '90%' }}>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'drug_kind'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Ngành hàng</span>
              }
            >
              <Select
                className="d-flex"
                style={{ marginBottom: "8px" }}
                size="middle"
                optionLabelProp="label"
                disabled={!props.btnEdit}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }} className="d-flex justify-content-center align-content-center">
                      <Button className="button" type="text" icon={<PlusOutlined />}
                        onClick={() => {
                          setOpenDrgKind(true);
                          setDrgKindItem({
                            code: '',
                            name: ''
                          })
                          setIsSettingButton(true);
                        }} >
                        Thêm
                      </Button>
                    </Space>
                  </>
                )}
              >
                {
                  props.optionKind?.map((item) => (
                    <Select.Option key={item.value} value={item.value} label={item.label}>
                      <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '90%' }}>
                        <p className="style-text-limit-number-line1">{item.label}</p>
                        <button type="button" className="button ant-btn ant-btn-background-ghost"
                          style={{ borderWidth: "1px" }} onClick={() => {
                            console.log(item.value);
                            console.log(props.listKind.find(option => option.drug_kind_id == item.value));
                            setDrgKindItem(props.listKind.find(drgkind => drgkind.drug_kind_id == item.value));
                            setOpenDrgKind(true);
                            setIsSettingButton(false);
                          }}>
                          {item.name === 1 ? "" : <EditOutlined style={{ color: "rgb(0, 132, 255)" }} />}
                        </button>

                      </Flex>
                    </Select.Option>
                  ))}

              </Select>
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
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
                style={{ marginBottom: "8px" }}
                size="middle"
                optionLabelProp="label"
                disabled={!props.btnEdit}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }} className="d-flex justify-content-center align-content-center">
                      <Button className="button" type="text" icon={<PlusOutlined />}
                        onClick={() => {
                          setOpenDrgGroup(true);
                          setDrgGroupItem({
                            code: '',
                            name: ''
                          })
                          setIsSettingButton(true);
                        }} >
                        Thêm
                      </Button>
                    </Space>
                  </>
                )}
              >
                {
                  props.optionGroup?.map((item) => (
                    <Select.Option key={item.value} value={item.value} label={item.label}>
                      <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '90%' }}>
                        <p className="style-text-limit-number-line1">{item.label}</p>

                        <button type="button" className="button ant-btn ant-btn-background-ghost"
                          style={{ borderWidth: "1px" }} onClick={() => {
                            console.log(props.listGroups.find(option => option.drug_group_id == item.value));
                            setDrgGroupItem(props.listGroups.find(option => option.drug_group_id == item.value));
                            setOpenDrgGroup(true);
                            setIsSettingButton(false);
                          }}>
                          {item.name === 1 ? "" : <EditOutlined style={{ color: "rgb(0, 132, 255)" }} />}
                        </button>

                      </Flex>
                    </Select.Option>
                  ))}

              </Select>
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'description'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Bào chế</span>
              }
            >
              <Select
                className="d-flex"
                style={{ marginBottom: "8px" }}
                size="middle"
                options={CityType}
                disabled={!props.btnEdit}

              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'drg_ref_cd'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã dược quốc gia</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập mã dược quốc gia"}
                name={'drg_ref_cd'}
                id={'drg_ref_cd'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'company_name'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Hãng sản xuất</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập hãng sản xuất"}
                name={'company_name'}
                id={'company_name'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'vat_percent'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Thuế VAT %</span>
              }
            >
              <Select
                className="d-flex"
                style={{ marginBottom: "8px" }}
                size="middle"
                options={vat}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
        </Flex>
      </Flex>

      <DrugKind
        open={openDrgKind}
        onCancel={() => {
          setOpenDrgKind(false);
        }}
        data={drgKindItem}
        isSettingButton={isSettingButton}
      />
      <DrugGroup
        open={openDrgGroup}
        onCancel={() => {
          setOpenDrgGroup(false);
        }}
        data={drgGroupItem}
        isSettingButton={isSettingButton}
      />
    </>
  );
};

export default ProductCreateInfo;