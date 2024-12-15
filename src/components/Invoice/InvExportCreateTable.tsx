import { DeleteOutlined } from "@ant-design/icons";
import { Empty, Input, Popconfirm, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { IImportInventoryDetailCreate } from "../../interfaces/inventoryDetail";

interface Props {
  // importInvDetails: IImportInventoryDetailCreate[];
}

const InvExportCreateTable = (props: Props) => {
  let count = 1;

  const columnsExportDetail: ColumnsType<IImportInventoryDetailCreate> = [
    {
      title: "Mã sản phẩn",
      dataIndex: "drug_code",
      key: "drug_code",
      width: "10%",
      align: 'left',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "drug_name",
      key: "drug_name",
      width: "calc(19% - 70px)",
      align: 'left',
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{record.drug_name}</span>
          </h5>
        )
      },
    },
    {
      title: "HSD",
      dataIndex: "exp_date",
      key: "exp_date",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{record.exp_date ? format(new Date(record.exp_date), "dd-MM-yyyy") : ""}</span>
          </h5>
        )
      },
    },
    {
      title: "Số lô",
      dataIndex: "lot",
      key: "lot",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{record.lot}</span>
          </h5>
        )
      },
    },
    {
      title: "Tồn",
      dataIndex: "quantity_pre",
      key: "quantity_pre",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{Math.abs(record.quantity_pre || 0)}</span>
          </h5>
        )
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        var quantity = Math.abs(record.quantity || 0);
        return (
          <Input
            size="middle"
            min={0}
            value={quantity}
            status={quantity || 0 > 0 ? "" : "error"}
            name="discount_amount"
            onChange={(e: any) => {

              // var value = parseFloat(e?.target?.value.replace(/,/g, ''));
              // let newData = [...importInvDetails];
              // value = value ? value : 0;


              // if (value > (newData[index]['quantity_pre'] || 0)) {
              //     showMessage("error", "Số lượng tồn kho không đủ", "Cảnh báo");
              //     return;
              // }
              // newData[index]['quantity'] = value > (newData[index]['quantity_pre'] || 0) ? (newData[index]['quantity_pre'] || 0) : -value;
              // newData[index]['total_amount'] = Math.abs(newData[index]['quantity'] || 0) * (newData[index]['total_price'] || 0);
              // setImportInvDetails(newData);
            }}
          />
        )
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit_id",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        var unitOptions = record.drug_units?.map((item) => ({
          value: item.unit_id || '',
          label: item.unit_name || '',

        }))
        return (
          <Select
            size="middle"
            defaultValue={record.unit_id || ''}
            style={{ textAlign: 'left' }}
            value={record.unit_id}
            onChange={(e: any) => {
              // let newData = [...importInvDetails];
              // var units = record.drug_units?.find(x => x.unit_id == e) || { unit_parent_id: e, unit_qty: 1, import_price: 0, price: 0 };

              // newData[index]['unit_id'] = e;
              // newData[index]['unit_parent_id'] = units?.unit_parent_id;

              // newData[index]['quantity_pre'] = (newData[index]['quantity_pre'] || 0) * (newData[index]['unit_quantity'] || 1) / (units?.unit_qty || 1);
              // newData[index]['total_price'] = (newData[index]['total_price'] || 0) * (units?.unit_qty || 1) / (newData[index]['unit_quantity'] || 1);
              // newData[index]['unit_quantity'] = units?.unit_qty;
              // newData[index]['price'] = (newData[index]['price'] || 0) * (units?.unit_qty || 1) / (newData[index]['unit_quantity'] || 1);
              // newData[index]['total_amount'] = 0;
              // newData[index]['quantity'] = 0

              // // newData[index]['price'] = units?.import_price;
              // // newData[index]['cur_price'] = units && units.price || 0;
              // // newData[index]['total_amount'] = (newData[index]['quantity'] || 0) * (newData[index]['price'] || 0) * ((newData[index]['vat_percent'] || 0) + 100) / 100 - (newData[index]['discount_amount'] || 0);
              // setImportInvDetails(newData);
            }}
            options={unitOptions}
          />
        )
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "total_price",
      key: "total_price",
      width: "10%",
      align: "right",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{Math.abs(record.total_price || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
          </h5>
        )
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      width: "10%",
      align: "right",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{Math.abs(record.total_amount || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
          </h5>
        )
      },
    },
    {
      title: "",
      dataIndex: "key",
      key: "key",
      width: "50px",
      align: "right",
      render: (_: any, record: IImportInventoryDetailCreate) => {
        return (
          <Popconfirm
            placement="topLeft"
            title={"Bạn có muốn xóa khách hàng này?"}
            description={""}
            // onConfirm={() => confirmDeleteCellToTable(record.key || 0)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ fontWeight: "600", color: "red" }} />
          </Popconfirm>
        )
      },
    },
  ];

  // useEffect(() => {
  //   form.setFieldsValue({ ...props.InvImportReq });
  // }, [props.InvImportReq]);

  // const eventSummitForm = (formValue: ICustomerPageRequest) => {
  //   props.triggerFormEvent(formValue);
  // }

  return (
    <>
      <div className="table-wrapper" style={{ width: '100%' }}>
        <div className="table-container">
          <Table locale={{
            emptyText: (
              <Empty description="Chưa chọn sản phẩm nào" />
            )
          }}
            rowKey={(record) => record.key || ''}
            size="small"
            style={{
              marginTop: '5px', height: '611px', overflowY: 'scroll'
            }}
            scroll={{ x: 900 }}
            className="table table-hover provider-table"
            columns={columnsExportDetail}
            // dataSource={[...importInvDetails]}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default InvExportCreateTable;