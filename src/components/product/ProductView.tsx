import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import type { SelectProps, TabsProps } from "antd";
import { Button, Empty, Flex, Form, InputNumber, Modal, notification, Popconfirm, Select, Table, Tabs, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import drugApi from "../../apis/drug.api";
import '../../assets/css/style.css';
import { IDrugRequest, IDrugResponse } from "../../interfaces/drug";
import { IDrugGroupResponse } from "../../interfaces/drugGroup";
import { IDrugKindResponse } from "../../interfaces/drugKind";
import { IDrugUnitCreate } from "../../interfaces/drugUnit";
import ProductCreateAvg from "./ProductCreateAvg";
import ProductCreateInfo from "./ProductCreateInfo";


interface IModalProductViewProps {
  open: boolean;
  onCancel: () => void;
  data: IDrugResponse;
  optionKind: SelectProps<string>['options'];
  optionUnit: SelectProps<string>['options'];
  optionGroup: SelectProps<string>['options'];
  listKind: IDrugKindResponse[];
  listGroup: IDrugGroupResponse[];
  optionDrgDescription: SelectProps<string>['options'];
}

const ProductView = (props: IModalProductViewProps) => {
  const [form] = Form.useForm<IDrugRequest>();
  const { confirm } = Modal;

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [btnEdit, setBtnEdit] = useState(false);
  const [key, setKey] = useState(props.data.drug_units?.length || 1);
  const [action, setAction] = useState(false);

  const [drugUnitItem, setDrugUnitItem] = useState<IDrugUnitCreate[]>([]);

  useEffect(() => {
    form.setFieldsValue({ ...props.data });
    setDrugUnitItem(props.data.drug_units || []);
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
        return (
          <Select
            className="d-flex"
            style={{ marginBottom: "8px", textAlign: 'left' }}
            size="middle"
            value={record.unit_id}
            id="unit_id"
            options={props.optionUnit}
            disabled={record.key === 1 ? true : !btnEdit}
            onChange={(e: any) => {

              const updatedRecord = { ...record, unit_id: e };
              updatedRecord.unit_parent_id = drugUnitItem.length > 1 ? drugUnitItem[0]['unit_id'] : e;

              const updatedDrugUnitItem = [...drugUnitItem];
              updatedDrugUnitItem[index] = updatedRecord;

              setDrugUnitItem(updatedDrugUnitItem);
            }}
          />
        );
      },
    },
    {
      title: "Giá trị quy đổi",
      dataIndex: "unit_qty",
      key: "unit_qty",
      width: "25%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return (
          <Flex gap="middle" justify="flex-start" align={'center'}>
            <Tooltip placement="top" style={{ background: '#fff', color: '#000' }}>
              <QuestionCircleOutlined style={{ color: 'red', paddingRight: '5px' }} />
            </Tooltip>
            <InputNumber
              size="middle"
              controls={false}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              min={0}
              name="unit_qty"
              value={record.unit_qty}
              disabled={record.key === 1 ? true : !btnEdit}
              onChange={(e: any) => {

                const updatedRecord = { ...record, unit_qty: e };


                const updatedDrugUnitItem = [...drugUnitItem];
                updatedDrugUnitItem[index] = updatedRecord;


                setDrugUnitItem(updatedDrugUnitItem);
              }}
            />
          </Flex>
        );
      },
    },
    {
      title: "Giá nhập",
      dataIndex: "import_price",
      key: "import_price",
      width: "25%",
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
            disabled={!btnEdit}
            onChange={(e: any) => {

              const updatedRecord = { ...record, import_price: e };


              const updatedDrugUnitItem = [...drugUnitItem];
              updatedDrugUnitItem[index] = updatedRecord;


              setDrugUnitItem(updatedDrugUnitItem);
            }}
          />
        );
      },
    },
    {
      title: "Giá bán lẻ",
      dataIndex: "price",
      key: "price",
      width: "25%",
      align: "center" as AlignType,
      render: (_: any, record: IDrugUnitCreate, index: number) => {
        return (
          <InputNumber
            size="middle"
            min={0}
            value={record.price}
            controls={false}
            name="price"
            disabled={!btnEdit}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(e: any) => {

              const updatedRecord = { ...record, price: e };


              const updatedDrugUnitItem = [...drugUnitItem];
              updatedDrugUnitItem[index] = updatedRecord;


              setDrugUnitItem(updatedDrugUnitItem);
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
        return record.key !== 1 ? (
          <Popconfirm
            placement="topLeft"
            title={"Bạn có muốn xóa khách hàng này?"}
            disabled={!btnEdit}
            onConfirm={() => {

              const updatedDrugUnitItem = [...drugUnitItem];
              updatedDrugUnitItem.splice(index, 1);

              // Handle the case where the last item is deleted
              if (updatedDrugUnitItem.length === 0) {
                setKey(0);
              }


              setDrugUnitItem(updatedDrugUnitItem);
            }}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined disabled={!btnEdit} style={{ fontWeight: "600", color: "red" }} />
          </Popconfirm>
        ) : null;
      },
    },
  ];


  const eventSummitForm = (formValue: IDrugResponse) => {
    setLoadingUpdate(true);
    updateProduct(formValue, props.data.status || true, props.data.active_flg || true);
  }

  const updateProduct = async (value: IDrugRequest, status: boolean, activeFlg: boolean) => {
    try {
      value.drug_units = drugUnitItem;
      value.drug_id = props.data.drug_id;
      value.active_flg = activeFlg;
      value.status = status;
      console.log(value);
      return await drugApi.update(value).then((response) => {
        console.log(response)
        switch (response.meta.code) {
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
      notification['error']({
        message: "Lỗi",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    } finally { setLoadingUpdate(false); }
  }
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin cơ bản",
      children: <ProductCreateInfo optionGroup={props.optionGroup}
        optionKind={props.optionKind}
        listGroups={props.listGroup}
        listKind={props.listKind}
        btnEdit={btnEdit}
        optionDrgDescription={props.optionDrgDescription}
        action={false} />,
    },
    {
      key: "2",
      label: "Thông tin nâng cao",
      children: <ProductCreateAvg btnEdit={btnEdit} />,
    }
  ];

  const closeModal = () => {
    props.onCancel();
    setDrugUnitItem([]);
    setKey(0);
    setBtnEdit(false);
    form.resetFields();
  }

  const onConfirmDrug = (value: IDrugRequest, content: string = "", status: boolean, activeFlg: boolean) => {
    confirm({
      title: 'Thông báo?',
      icon: <QuestionCircleOutlined />,
      content: `${content}`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          setAction(false);
          updateProduct(value, status, activeFlg)
            .then(() => {
              resolve();
            })
            .catch(() => {
              notification['error']({
                message: "Lỗi",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
              });
              resolve();
            });
        });
      },
      onCancel() { },
    });
  }

  return (
    <>
      <Modal
        open={props.open}
        title="Chi tiết thuốc"
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
                  onConfirmDrug(props.data, "Toàn bộ dữ liệu của thuốc này sẽ bị xoá trong kho, Bạn có chắc chắn muốn xoá sản phẩm này?", false, true);
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
                    : "Bạn có chắc chắn muốn kinh doanh lại sản phẩm này?", true, !props.data.active_flg);

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
                    form.submit();
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
                rowKey={(record) => record.drug_unit_id}
                size="small"
                className="table table-hover provider-table"
                columns={columnsDrugUnit}
                dataSource={[...drugUnitItem]}
                pagination={false}
              />
              <Button
                key="submit"
                type="primary"
                disabled={!btnEdit}
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
