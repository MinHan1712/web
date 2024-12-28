import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { Button, Empty, Flex, Form, InputNumber, Modal, notification, Popconfirm, Select, Table, Tabs, Tooltip } from "antd";
import { useEffect, useState } from "react";
import '../../assets/css/style.css';
import { IDrugRequest, IDrugResponse } from "../../interfaces/drug";
import ProductCreateInfo from "./ProductCreateInfo";
import ProductCreateAvg from "./ProductCreateAvg";
import { ColumnsType } from "antd/es/table";
import { AlignType } from "rc-table/lib/interface";
import { IDrugUnitCreate, IDrugUnitResponse } from "../../interfaces/drugUnit";
import drugApi from "../../apis/drug.api";


interface IModalProductViewProps {
  open: boolean;
  onCancel: () => void;
  data: IDrugResponse;
}

const ProductView = (props: IModalProductViewProps) => {
  const [form] = Form.useForm<IDrugRequest>();
  const { confirm } = Modal;

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [btnEdit, setBtnEdit] = useState(false);
  const [key, setKey] = useState(0);
  const [action, setAction] = useState(false);

  const [drugUnitItem, setDrugUnitItem] = useState<IDrugUnitCreate[]>([]);

  useEffect(() => {
    form.setFieldsValue({ ...props.data });
    console.log(props.data);
  }, [props.data]);

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

  const eventSummitForm = (formValue: IDrugResponse) => {
    setLoadingUpdate(true);
    updateProduct(formValue);
  }

  const updateProduct = async (value: IDrugRequest) => {
    try {
      value.drug_units = drugUnitItem;
      console.log(value);
      return await drugApi.update(value).then((response) => {
        console.log(response)
        switch (response.meta[0].code) {
          case 200:
            notification['success']({
              message: "Thông báo",
              description: action ? 'Cập nhật thông tin thuốc thành công!' : 'Xóa thuốc thành công!',
            });

            setDrugUnitItem([]);
            setKey(0);
            form.resetFields();
            props.onCancel();
            break;

          default:
            notification['error']({
              message: "Lỗi",
              description: action ? 'Cập nhật thông tin thuốc không thành công!' : 'Xóa thuốc không thành công!',
            });
            break;
        }
      })
        .catch(() => {
          notification['error']({
            message: "Lỗi",
            description: action ? 'Cập nhật thông tin thuốc không thành công!' : 'Xóa thuốc không thành công!',
          });
        })
        .finally(() => {
          setLoadingUpdate(false);
        })
    } catch (err) {
      console.log(err);
    } finally { setLoadingUpdate(false); }
  }
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

  const closeModal = () => {
    props.onCancel();
    setDrugUnitItem([]);
    setKey(0);
    form.resetFields();
  }

  const onConfirmDrug = (value: IDrugRequest, content: string = "") => {
    confirm({
      title: 'Thông báo?',
      icon: <QuestionCircleOutlined />,
      content: `${content}`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      async onOk() {

        return new Promise((resolve, reject) => {
          setAction(false);
          updateProduct(value);
        }).catch(() => {
          notification["error"]({
            message: "Thông báo",
            description: "Có một lỗi nào đó xảy ra, vui lòng thử lại",
          });
        })
      },
      onCancel() { },
    });
  };

  return (
    <>
      <Modal
        open={props.open}
        title="Tạo thuốc mới"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={closeModal}
        width={"80%"}
        footer={[
          <Flex justify="space-between" align={'center'} style={{ width: '100%' }}>
            <Flex justify="flex-start" align={'center'} >
              <Button
                className="button btn-delete d-flex flex-row justify-content-center align-content-center"
                type="primary"
                onClick={() => {
                  // valueDrug.status = false;
                  onConfirmDrug(props.data, "Toàn bộ dữ liệu của thuốc này sẽ bị xoá trong kho, Bạn có chắc chắn muốn xoá sản phẩm này?");
                }}
              >
                <DeleteOutlined />
                <span>Xóa</span>
              </Button>
              <Button
                key="submit"
                type="primary"

                onClick={() => {
                  // valueDrug.active_flg = !valueDrug.active_flg;
                  onConfirmDrug(props.data, props.data.active_flg ?
                    "Bạn có chắc chắn muốn ngừng kinh doanh sản phẩm này?"
                    : "Bạn có chắc chắn muốn kinh doanh lại sản phẩm này?");

                }}
                className={`button ${props.data.active_flg ? 'btn-delete' : 'btn-add'} d-block`}
              >
                <span>{props.data.active_flg ? 'Ngừng kinh doanh' : 'Kinh doanh lại'}</span>
              </Button >
            </Flex>
            <Flex justify="flex-end" align={'center'}>
              <Button
                className="button btn-cancel d-flex flex-row justify-content-center align-content-center"
                type="primary"
                onClick={closeModal}
              >
                <span>Hủy bỏ</span>
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={loadingUpdate}
                onClick={() => {
                  setBtnEdit(!btnEdit);
                  if (btnEdit) {
                    setAction(true);
                    setLoadingUpdate(true);
                  }
                }}
                className="button btn-add d-flex flex-row justify-content-center align-content-center"
              >
                {btnEdit ? <SyncOutlined /> : <EditOutlined />}
                <span>{btnEdit ? "Cập nhập" : "Sửa"}</span>
              </Button >
            </Flex>
          </Flex>
        ]}
      >
        <Form
          name="ProductView"
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
export default ProductView;
