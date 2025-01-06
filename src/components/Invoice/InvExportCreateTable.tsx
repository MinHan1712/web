import { DeleteOutlined } from "@ant-design/icons";
import { Empty, Input, Popconfirm, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { IImportInventoryDetailCreate } from "../../interfaces/inventoryDetail";
import { UseInvExportContext } from "../../pages/InvExportCreate";

interface Props {
  confirmDeleteCellToTable: (key: number, index: number, record: IImportInventoryDetailCreate) => void;
}


const InvExportCreateTable = (props: Props) => {

  const { invImportCreateReq, setInvImportCreateReq } = UseInvExportContext();

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
            max={record.quantity_pre === 0 ? record.quantity : record.quantity_pre}
            onChange={(e: any) => {
              var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;

              var totalAmntCurrent = record.total_amount || 0;

              record.quantity = Math.min(record.quantity_pre || 0, value);
              record.total_amount = amountTotal(record.quantity, record.price, record.discount_amount, record.vat_percent);

              invImportCreateReq.products[index] = record;

              invImportCreateReq.info.amount = (invImportCreateReq.info.amount || 0) - totalAmntCurrent + record.total_amount;
              invImportCreateReq.info.amount_paid = invImportCreateReq.info.amount;
              setInvImportCreateReq({ ...invImportCreateReq });
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

        console.log(unitOptions, record);
        return (
          <Select
            size="middle"
            defaultValue={record.unit_id || ''}
            style={{ textAlign: 'left' }}
            value={record.unit_id}
            disabled={true}
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
            <span>{calcPrice(record.price, record.discount_amount, record.vat_percent)}</span>
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
            <span>{Math.abs(record.total_amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
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
            onConfirm={() => props.confirmDeleteCellToTable(record.key || 0, index, record)}
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

    return data.drug_units.find(x => x.unit_id?.toString() === unitId.toString()) || null;
  }

  const amountTotal = (qty?: number, price?: number, discount?: number, vat?: number) => {
    return Math.round(((price || 0) - (discount || 0)) * (qty || 0) * (1 + (vat || 0) / 100));
  }

  const calcPrice = (price?: number, discount?: number, vat?: number) => {
    return Math.round(((price || 0) - (discount || 0)) * ((vat || 0) + 100) / 100);
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
            scroll={{ x: 240 }}
            className="table table-hover provider-table"
            columns={columnsExportDetail}
            dataSource={invImportCreateReq.products}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default InvExportCreateTable;