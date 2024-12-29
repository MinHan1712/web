import { DeleteOutlined } from "@ant-design/icons";
import { Empty, Input, notification, Popconfirm, Popover, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { IImportInventoryDetailCreate } from "../../interfaces/inventoryDetail";
import { UseInvExportContext } from "../../pages/InvExportCreate";
import TextArea from "antd/es/input/TextArea";
import showMessage from "../notification";
import { UseInvCustomerExportContext } from "../../pages/InvCustomerCreate";

interface Props {
  confirmDeleteCellToTable: (key: number, index: number, record: IImportInventoryDetailCreate) => void;
  updateAmtInfo: (amt: number) => void;
}


const InvCustomerCreateTable = (props: Props) => {

  const { invImportCreateReq, setInvImportCreateReq } = UseInvCustomerExportContext();
  let count = 1;
  const columnsInvImportDetail: ColumnsType<IImportInventoryDetailCreate> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "50px",
      align: 'center',
      render: () => {
        return (
          <h5>
            <span>{count++}</span>
          </h5>
        )
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "drug_name",
      key: "drug_name",
      width: "15%",
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
    // {
    //   title: "Liều dùng ",
    //   dataIndex: "dosage",
    //   key: "dosage",
    //   width: "10%",
    //   align: "center",
    //   render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
    //     return (
    //       <Popover content={
    //         <TextArea rows={4} value={record.dosage} onChange={(e) => {
    //           let newData = [...invImportCreateReq];
    //           newData[index]['dosage'] = e?.target?.value;
    //           setInvImportCreateReq(newData);
    //         }} />
    //       } title="Liều dùng" trigger="hover">
    //         <Mentions
    //           style={{ width: '100px' }}
    //           readOnly
    //           value={record.dosage}
    //         />
    //       </Popover>
    //     )
    //   },
    // },
    {
      title: "Tồn",
      dataIndex: "quantity_pre",
      key: "quantity_pre",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <h5>
            <span>{record.quantity_pre}</span>
          </h5>
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
      dataIndex: "price",
      key: "price",
      width: "11%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Input
            size="middle"
            min={0}
            value={(record.price?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter="đ"
            status={(record.price || 0) > 0 ? "" : "error"}
            name="price"
            onChange={(e: any) => {

              var value = parseFloat(e?.target?.value.replace(/,/g, ''));
              if (value < (record.discount_amount || 0)) {
                notification["error"]({
                  message: "Lỗi",
                  description: 'Giá bán không được nhỏ hơn giảm giá',
                });
              }

              var totalAmntCurrent = record.total_amount || 0;
              record.price = value;
              record.total_amount = amountTotal(record.quantity, record.price, record.discount_amount, record.vat_percent);

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount_original = (invImportCreateReq.info.amount_original || 0) - totalAmntCurrent + record.total_amount;
              setInvImportCreateReq({ ...invImportCreateReq });
              props.updateAmtInfo(invImportCreateReq.info.amount_original);
            }}
          />
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
            status={record.quantity || 0 > 0 ? "" : "error"}
            name="quantity"
            onChange={(e: any) => {

              var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;

              if (value > (record.quantity_pre || 0)) {
                showMessage("error", "Vui lòng kiểm tra lại thuốc trong đơn", "Số lượng thuốc không đủ");
                return;
              }

              var totalAmntCurrent = record.total_amount || 0;

              record.quantity = value;
              record.total_amount = amountTotal(record.quantity, record.price, record.discount_amount, record.vat_percent);

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount_original = (invImportCreateReq.info.amount_original || 0) - totalAmntCurrent + record.total_amount;
              setInvImportCreateReq({ ...invImportCreateReq });
              props.updateAmtInfo(invImportCreateReq.info.amount_original);
            }}
          />
        )
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount_amount",
      key: "discount_amount",
      width: "11%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Input
            size="middle"
            min={0}
            value={(record.discount_amount?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter="đ"
            status={(record.price || 0) > 0 ? "" : "error"}
            name="discount_amount"
            onChange={(e: any) => {

              var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;

              if (value > (record.price || 0)) {
                notification["error"]({
                  message: "Lỗi",
                  description: 'Giảm giá không được lớn hơn giá nhập',
                });
              }

              var totalAmntCurrent = record.total_amount || 0;

              record.discount_amount = Math.min(value, (record.price || 0));
              record.total_amount = amountTotal(record.quantity, record.price, record.discount_amount, record.vat_percent);

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount_original = (invImportCreateReq.info.amount_original || 0) - totalAmntCurrent + record.total_amount;
              setInvImportCreateReq({ ...invImportCreateReq });
              props.updateAmtInfo(invImportCreateReq.info.amount_original);
            }}
          />
        )
      },
    },
    {
      title: "Tổng tiền",
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
      width: "60px",
      align: "right",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Popconfirm
            placement="topLeft"
            title={"Bạn có muốn xóa thuốc này?"}
            description={""}
            onConfirm={() => props.confirmDeleteCellToTable(record.key || 0, index, record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ fontWeight: "600", color: "red", textAlign: 'right' }} />
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
            columns={columnsInvImportDetail}
            dataSource={invImportCreateReq.products}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default InvCustomerCreateTable;