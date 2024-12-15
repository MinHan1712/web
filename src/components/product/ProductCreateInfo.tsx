
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Input, Select, Space } from "antd";
import '../../assets/css/style.css';
import { CityType, formItemLayout, vat } from "../../constants/general.constant";

const ProductCreateInfo = () => {
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
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập tên thuốc"}
                name={'drug_name'}
                id={'drug_name'}

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
                disabled={false}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }} className="d-flex justify-content-center align-content-center">
                      <Button className="button" type="text" icon={<PlusOutlined />}  >
                        Thêm
                      </Button>
                    </Space>
                  </>
                )}
              >
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
                disabled={false}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }} className="d-flex justify-content-center align-content-center">
                      <Button className="button" type="text" icon={<PlusOutlined />}  >
                        Thêm
                      </Button>
                    </Space>
                  </>
                )}
              >
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
              />
            </Form.Item>
          </div>
        </Flex>
      </Flex>
    </>
  );
};

export default ProductCreateInfo;