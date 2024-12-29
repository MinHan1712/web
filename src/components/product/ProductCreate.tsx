import {
  CloseCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import type { SelectProps, TabsProps } from "antd";
import { Button, Empty, Flex, Form, InputNumber, Modal, notification, Popconfirm, Select, Table, Tabs, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { AlignType } from "rc-table/lib/interface";
import { useState } from "react";
import drugApi from "../../apis/drug.api";
import '../../assets/css/style.css';
import { IDrugRequest } from "../../interfaces/drug";
import { IDrugGroupResponse } from "../../interfaces/drugGroup";
import { IDrugKindResponse } from "../../interfaces/drugKind";
import { IDrugUnitCreate } from "../../interfaces/drugUnit";
import ProductCreateAvg from "./ProductCreateAvg";
import ProductCreateInfo from "./ProductCreateInfo";
import showMessage from "../notification";

interface IModalProductViewProps {
  open: boolean;
  onCancel: () => void;
  optionKind: SelectProps<string>['options'];
  optionGroup: SelectProps<string>['options'];
  optionUnit: SelectProps<string>['options'];
  listKind: IDrugKindResponse[];
  listGroup: IDrugGroupResponse[];
}

const ProductCreate = (props: IModalProductViewProps) => {
  const [form] = Form.useForm<IDrugRequest>();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  const [drugUnitItem, setDrugUnitItem] = useState<IDrugUnitCreate[]>([]);

  const eventSummitForm = (formValue: IDrugRequest) => {
    setLoading(true);
    createDrugToApi(formValue);
  }

  const columnsDrugUnit: ColumnsType<IDrugUnitCreate> = [
    {
      title: "Loại đơn vị",
      dataIndex: "key",
      key: "key",
      width: "15%",
      align: "left" as AlignType,
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text === 0 ? "Đơn vị cơ bản" : `Đơn vị quy đổi`}</span>
        </div>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit_id",
      width: "18%",
      align: "left" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return (
          <Select
            className="d-flex"
            style={{ marginBottom: "8px", textAlign: 'left' }}
            size="middle"
            value={record.unit_id}
            id="unit_id"
            options={props.optionUnit}
            // disabled={record.key == 0 ? true : false}
            onChange={(e: any) => {
              // Tạo bản sao mới của record và cập nhật unit_id, unit_parent_id
              const updatedDrugUnitItem = [...drugUnitItem];
              updatedDrugUnitItem[index] = {
                ...record,
                unit_id: e,
                unit_parent_id: drugUnitItem && drugUnitItem.length > 1 ? drugUnitItem[0]['unit_id'] : e,
              };
              setDrugUnitItem(updatedDrugUnitItem);
              console.log(updatedDrugUnitItem);
            }}
          />
        );
      },
    },
    {
      title: "Giá trị quy đổi",
      dataIndex: "unit_qty",
      key: "unit_qty",
      width: "18%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return (
          <Flex gap="middle" justify="flex-start" align={'center'}>
            {
              record.key == 0 ? <>
                <Tooltip placement="top" style={{ background: '#fff', color: '#000', width: '10px' }} title="Đơn vị nhỏ nhất bán ra">
                  <QuestionCircleOutlined style={{ color: 'red' }} />
                </Tooltip>
              </> : <><div style={{ background: '#fff', color: '#000', width: '11px' }}></div></>
            }
            <InputNumber
              size="middle"
              controls={false}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              min={0}
              name="unit_qty"
              value={record.unit_qty}
              disabled={record.key == 0 ? true : false}
              onChange={(e: any) => {
                // Tạo bản sao mới của record và cập nhật unit_qty
                const updatedDrugUnitItem = [...drugUnitItem];
                updatedDrugUnitItem[index] = {
                  ...record,
                  unit_qty: e,
                };
                setDrugUnitItem(updatedDrugUnitItem);
                console.log(updatedDrugUnitItem);
              }}
            />
          </Flex >
        );
      },
    },
    {
      title: "Giá nhập",
      dataIndex: "import_price",
      key: "import_price",
      width: "18%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return (
          <InputNumber
            size="middle"
            value={record.import_price}
            controls={false}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            min={0}
            name="import_price"
            onChange={(e: any) => {
              // Tạo bản sao mới của record và cập nhật import_price
              const updatedDrugUnitItem = [...drugUnitItem];
              updatedDrugUnitItem[index] = {
                ...record,
                import_price: e,
              };
              setDrugUnitItem(updatedDrugUnitItem);
              console.log(updatedDrugUnitItem);
            }}
          />
        );
      },
    },
    {
      title: "Giá bán lẻ",
      dataIndex: "price",
      key: "price",
      width: "18%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return (
          <InputNumber
            size="middle"
            min={0}
            value={record.price}
            controls={false}
            name="price"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(e: any) => {
              // Tạo bản sao mới của record và cập nhật price
              const updatedDrugUnitItem = [...drugUnitItem];
              updatedDrugUnitItem[index] = {
                ...record,
                price: e,
              };
              setDrugUnitItem(updatedDrugUnitItem);
              console.log(updatedDrugUnitItem);
            }}
          />
        );
      },
    },
    {
      title: "Xóa",
      dataIndex: "key",
      key: "key",
      width: "10%",
      align: "right" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return record.key != 0 ? (
          <Popconfirm
            placement="topLeft"
            title={"Bạn có muốn xóa khách hàng này?"}
            description={""}
            onConfirm={() => {
              // Tạo bản sao mới của drugUnitItem và lọc bỏ phần tử cần xóa
              const updatedProducts = drugUnitItem.filter(product => product.key !== record.key);
              if (updatedProducts.length === 0) setKey(0);
              setDrugUnitItem(updatedProducts);
            }}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ fontWeight: "600", color: "red" }} />
          </Popconfirm>
        ) : (
          ""
        );
      },
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin cơ bản",
      children: <ProductCreateInfo optionGroup={props.optionGroup}
        optionKind={props.optionKind}
        listGroups={props.listGroup}
        listKind={props.listKind}
        btnEdit={true} />,
    },
    {
      key: "2",
      label: "Thông tin nâng cao",
      children: <ProductCreateAvg  btnEdit={true}/>,
    }
  ];

  const onClickAddDrug = () => {
    if (drugUnitItem.length < 1) {
      showMessage('error', 'Thiếu đơn vị bán hàng', 'Lỗi đơn vị');
      return;
    }


    var arrUnitQuantity = drugUnitItem.map(x => x.unit_qty);
    const isUnitQuantityDuplicated = arrUnitQuantity.some((item, index) => arrUnitQuantity.indexOf(item) !== index);

    if (isUnitQuantityDuplicated) {
      showMessage('error', 'Giá trị quy đổi không được trùng nhau', 'Lỗi đơn vị');
      return;
    }

    form.submit();
  };

  const createDrugToApi = async (value: IDrugRequest) => {
    setLoading(true);
    value.drug_units = drugUnitItem;
    console.log(value);
    return await drugApi.create(value).then((response) => {
      console.log(response)
      // switch (response.meta[0].code) {
      //   case 200:
      notification['success']({
        message: "Thông báo",
        description: 'Thêm thuốc thành công',
      });
      setDrugUnitItem([]);
      setKey(0);
      form.resetFields();
      props.onCancel();
      // break;

      // default:
      //   notification['error']({
      //     message: "Lỗi",
      //     description: 'Thêm thuốc không thành công',
      //   });
      //   break;
      // }
    })
      .catch(() => {
        notification['error']({
          message: "Lỗi",
          description: 'Thêm thuốc không thành công',
        });
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <>
      <Modal
        open={props.open}
        title="Tạo thuốc mới"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          props.onCancel();
          setDrugUnitItem([]);
          setKey(0);
          form.resetFields();
        }}
        width={"80%"}
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
              onClickAddDrug();
            }}
            className="button btn-add d-block"
          >
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>,
        ]}
      >
        <Form
          name="ProductCreate"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%", padding: '0 10px' }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={eventSummitForm}
        >
          <Tabs
            type="card"
            items={items}
            className="h-100"
          />
          <div className="table-wrapper">
            <div className="table-container">
              <Table locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
                )
              }}
                rowKey={(record) => record.key}
                size="small"
                className="table table-hover provider-table"
                columns={columnsDrugUnit}
                dataSource={drugUnitItem}
                pagination={false}
              />
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  var item = {
                    key: key,
                    drug_unit_id: '',
                    status: true,
                    price: 0,
                    import_price: 0,
                    unit_qty: 1
                  }
                  var drg = [...drugUnitItem, item];
                  setDrugUnitItem([...drugUnitItem, item]);
                  console.log(drg, drugUnitItem);
                  setKey(key + 1);
                }}
                className="button btn-add d-block"
                style={{ margin: "10px 0" }}
              >
                <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
                <span>Thêm đơn vị</span>
              </Button>
            </div>
          </div>
        </Form>
      </Modal >
    </>
  );
};

export default ProductCreate;
