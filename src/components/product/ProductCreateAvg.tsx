
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Input, Select, Space } from "antd";
import '../../assets/css/style.css';
import { CityType, formItemLayout, vat } from "../../constants/general.constant";
import { IDrugRequest } from "../../interfaces/drug";

const ProductCreateAvg = (props: { btnEdit: boolean }) => {
  return (
    <>

      <Flex justify="space-between" align={'center'} style={{ width: '100%' }}>
        <Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '90%' }}>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'direction_for_use'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Cách sử dụng</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập cách sử dụng"}
                name={'direction_for_use'}
                id={'direction_for_use'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'overdosage'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Quá liều, cách sử lý</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập cách xử lý quá liều"}
                name={'overdosage'}
                id={'overdosage'}
                disabled={!props.btnEdit}

              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'indication'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Chỉ định</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={'Nhập chỉ định thuốc'}
                name={'indication'}
                id={'indication'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'dosage'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Đối tượng sử dụng</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập đối tượng sử dụng'}
                name={'dosage'}
                id={'dosage'}
                disabled={!props.btnEdit}

              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'adverse_reaction'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Tác dụng phụ</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập tác dụng phụ'}
                name={'adverse_reaction'}
                id={'adverse_reaction'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'contraindication'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Chống chỉ định</span>
              }
            >
              <Input
                className="form-input d-flex"
                size="middle"
                placeholder={'Nhập chống chỉ định'}
                name={'contraindication'}
                id={'contraindication'}
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
              name={'interation'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Tương tác thuốc</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập tương tác thuốc"}
                name={'interation'}
                id={'interation'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'storage_temperature'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhiệt độ bảo quản</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập nhiệt độ bảo quản"}
                name={'storage_temperature'}
                id={'storage_temperature'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'moisture'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Độ ẩm bảo quản</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập độ ẩm bảo quản"}
                name={'moisture'}
                id={'moisture'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'original_product'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Xuất xứ</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập xuất xứ"}
                name={'original_product'}
                id={'original_product'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'special_control'}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Thuốc kiểm soát đặc biệt</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Nhập thuốc kiểm soát đặc biệt"}
                name={'special_control'}
                id={'special_control'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
          <div className="wrapper-column" style={{ width: '90%' }}>
            <Form.Item
              {...formItemLayout}
              name={'precaution'}
              labelAlign={"left"}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Thận trọng</span>
              }
            >
              <Input
                className="form-input "
                size="middle"
                placeholder={"Thận trọng"}
                name={'precaution'}
                id={'precaution'}
                disabled={!props.btnEdit}
              />
            </Form.Item>
          </div>
        </Flex>
      </Flex>
    </>
  );
};

export default ProductCreateAvg;