import { DeleteOutlined } from "@ant-design/icons";
import { Empty, Input, Popconfirm, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { IImportInventoryDetailCreate } from "../../interfaces/inventoryDetail";

interface Props {
  exportInvDetails: IImportInventoryDetailCreate[];
  setInvDetails: (value: IImportInventoryDetailCreate[]) => void;
  confirmDeleteCellToTable: (key: number, index: number) => void;
}

const InvExportCreateTable = (props: Props) => {
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
            name="quantity"
            onChange={(e: any) => {
              var value = parseInt(e?.target?.value.replace(/,/g, '')) || 0;
              var drugUnit = getDrugUnitById(record.unit_id, record);

              record.quantity = (record.quantity_pre || 0) < value ? record.quantity_pre : value;
              record.total_amount = (record.quantity || 0) * ((drugUnit === null ? record.price : drugUnit.price * drugUnit.unit_qty) || 0);
              props.exportInvDetails[index] = record;

              props.setInvDetails(props.exportInvDetails);
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
              var drugUnit = getDrugUnitById(record.unit_id, record);
              if (drugUnit === null) {
                drugUnit = { unit_parent_id: e, unit_qty: 1, import_price: 0, price: 0 }
              }

              record.unit_id = e;
              record.unit_parent_id = drugUnit.unit_parent_id;
              record.quantity_pre = drugUnit.quantity_pre;
              record.unit_quantity = drugUnit.unit_qty;
              record.price = drugUnit.price * drugUnit.unit_qty;
              record.total_price = drugUnit.price * drugUnit.unit_qty;
              record.total_amount = 0;
              record.quantity = 0;

              props.exportInvDetails[index] = record;
            }}
            options={unitOptions}
          />
        )
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: "10%",
      align: "right",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{Math.abs(record.price || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
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
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Popconfirm
            placement="topLeft"
            title={"Bạn có muốn xóa khách hàng này?"}
            description={""}
            onConfirm={() => props.confirmDeleteCellToTable(record.key || 0, index)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ fontWeight: "600", color: "red" }} />
          </Popconfirm>
        )
      },
    },
  ];

  const getDrugUnitById: any = (unitId: number, data: IImportInventoryDetailCreate) => {
    if (data === null || data.drug_units === null || data.drug_units === undefined || data.drug_units.length === 0) {
      return null;
    }

    return data.drug_units.find(x => x.unit_id === unitId.toString()) || null;
  }

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
            dataSource={props.exportInvDetails}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default InvExportCreateTable;