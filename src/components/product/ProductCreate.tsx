import {
  CloseCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { Button, Empty, Flex, Form, InputNumber, Modal, notification, Popconfirm, Select, Table, Tabs, Tooltip } from "antd";
import { useState } from "react";
import '../../assets/css/style.css';
import { IDrugRequest } from "../../interfaces/drug";
import ProductCreateInfo from "./ProductCreateInfo";
import ProductCreateAvg from "./ProductCreateAvg";
import { ColumnsType } from "antd/es/table";
import { AlignType } from "rc-table/lib/interface";
import { IDrugUnitCreate } from "../../interfaces/drugUnit";
import drugApi from "../../apis/drug.api";

interface IModalProductViewProps {
  open: boolean;
  onCancel: () => void;
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
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit_id",
      width: "25%",
      align: "left" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return <Select
          className="d-flex"
          style={{ marginBottom: "8px", textAlign: 'left' }}
          size="middle"
          value={record.unit_id}
          id="unit_id"
          // options={optionUnit}
          onChange={(e: any) => {
            record.unit_id = e;
            record.unit_parent_id = drugUnitItem && drugUnitItem.length > 1 ? drugUnitItem[0]['unit_id'] : e;
            drugUnitItem[index] = record;
            setDrugUnitItem(drugUnitItem);
            console.log(drugUnitItem);
          }}
        />
      },
    },
    {
      title: "Giá trị quy đổi",
      dataIndex: "unit_qty",
      key: "unit_qty",
      width: "25%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return <Flex gap="middle" justify="flex-start" align={'center'}>
          <Tooltip placement="top" style={{ background: '#fff', color: '#000' }}
          // title={record.key == 0 ? "Đơn vị nhỏ nhất bán ra" : `Một ${record.unit_name} = ? ${unit.unit_name}`}
          >
            <QuestionCircleOutlined style={{ color: 'red', paddingRight: '5px' }} />
          </Tooltip>
          <InputNumber
            size="middle"
            controls={false}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
            min={0}
            name="unit_qty"
            value={record.unit_qty}
            onChange={(e: any) => {
              record.unit_qty = e;
              drugUnitItem[index] = record;
              setDrugUnitItem(drugUnitItem);
              console.log(drugUnitItem);
            }}
          />
        </Flex>;
      },
    },
    {
      title: "Giá nhập",
      dataIndex: "import_price",
      key: "import_price",
      width: "25%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return <>
          <InputNumber
            size="middle"
            value={record.import_price}
            controls={false}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            min={0}
            name="import_price"
            onChange={(e: any) => {
              record.import_price = e;
              drugUnitItem[index] = record;
              setDrugUnitItem(drugUnitItem);
              console.log(drugUnitItem);
            }}
          />
        </>;
      },
    },
    {
      title: "Giá bán lẻ",
      dataIndex: "price",
      key: "price",
      width: "25%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return <>
          <InputNumber
            size="middle"
            min={0}
            value={record.price}
            controls={false}
            name="price"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(e: any) => {
              record.price = e;
              drugUnitItem[index] = record;
              setDrugUnitItem(drugUnitItem);
              console.log(drugUnitItem);
            }}
          />
        </>;
      },
    },
    {
      title: "Xóa",
      dataIndex: "key",
      key: "key",
      width: "10%",
      align: "right" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return record.key != 0 ?
          <Popconfirm
            placement="topLeft"
            title={"Bạn có muốn xóa khách hàng này?"}
            description={""}
            onConfirm={() => {
              drugUnitItem.splice(index, 1);
              if (drugUnitItem.length == 0) setKey(0);
              setDrugUnitItem(drugUnitItem);
              console.log(drugUnitItem);
            }}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ fontWeight: "600", color: "red" }} />
          </Popconfirm> : ""
      },
    },
  ];


  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin cơ bản",
      children: <ProductCreateInfo />,
    },
    {
      key: "2",
      label: "Thông tin nâng cao",
      children: <ProductCreateAvg />,
    }
  ];

  const createDrugToApi = async (value: IDrugRequest) => {
    setLoading(true);
    value.drug_units = drugUnitItem;
    console.log(value);
    return await drugApi.create(value).then((response) => {
      console.log(response)
      switch (response.meta[0].code) {
        case 200:
          notification['success']({
            message: "Thông báo",
            description: 'Thêm thuốc thành công',
          });
          setDrugUnitItem([]);
          setKey(0);
          form.resetFields();
          props.onCancel();
          break;

        default:
          notification['error']({
            message: "Lỗi",
            description: 'Thêm thuốc không thành công',
          });
          break;
      }
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
              form.submit();
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
                dataSource={[...drugUnitItem]}
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
                    unit_qty: 0
                  }
                  drugUnitItem.push(item);
                  setDrugUnitItem(drugUnitItem);
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
