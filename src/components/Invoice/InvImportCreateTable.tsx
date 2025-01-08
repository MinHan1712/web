import { DeleteOutlined } from "@ant-design/icons";
import { DatePicker, Empty, Input, notification, Popconfirm, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { vat } from "../../constants/general.constant";
import { IImportInventoryDetailCreate } from "../../interfaces/inventoryDetail";
import { UseInvImportContext } from "../../pages/InvImportCreate";


interface Props {
  confirmDeleteCellToTable: (key: number, index: number, record: IImportInventoryDetailCreate) => void;
  updateAmtInfo: (amt: number) => void;
}

const InvImportCreateTable = (props: Props) => {
  const { invImportCreateReq, setInvImportCreateReq } = UseInvImportContext();

  let count = 1;

  const columnsInvImportDetail: ColumnsType<IImportInventoryDetailCreate> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "40px",
      align: 'center',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{count++}</span>
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "drug_name",
      key: "drug_name",
      width: "11%",
      align: 'left',
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <div className='style-text-limit-number-line2 d-flex align-items-center'>
            <span>{record.drug_name}</span>
          </div>
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
          <Input
            size="middle"
            placeholder="Số lô"
            value={record.lot}
            status={record.lot ? "" : "warning"}
            onChange={(e: any) => {
              record.lot = e?.target?.value;
              invImportCreateReq.products[index] = record;
              setInvImportCreateReq({ ...invImportCreateReq });
            }}
            id="lot"
          />
        )
      },
    },
    {
      title: "HSD",
      dataIndex: "exp_date",
      key: "exp_date",
      width: "11%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <DatePicker
            size="middle"
            format={"DD/MM/YYYY"}
            placeholder="HSD"
            status={record.exp_date ? "" : 'warning'}
            value={record.exp_date ? dayjs(record.exp_date) : null}
            onChange={(date, dateString) => {
              record.exp_date = date && dayjs(date, 'YYYY-MM-DD').format('YYYY-MM-DD') || '';
              invImportCreateReq.products[index] = record;
              setInvImportCreateReq({ ...invImportCreateReq });
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
        return (
          <Input
            size="middle"
            min={record.is_update ? record.qty_export : 0}
            value={record.quantity}
            name="quantity"
            status={record.quantity || 0 > 0 ? "" : "error"}
            onChange={(e: any) => {
              var data = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;
              if (record.is_update && data < (record.qty_export || 0)) {
                notification["error"]({
                  message: "Lỗi",
                  description: 'Sô lượng nhập không được nhỏ hơn số lượng đã xuất kho',
                });
              }
              var totalAmntCurrent = record.total_amount || 0;

              record.quantity = record.is_update ? Math.max(record.qty_export || 0, data) : data;
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
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit_id",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        var unitOptions = record.drug_units?.map((item) => ({
          value: item.unit_id || '',
          label: item.unit_name || ''
        }))
        return (
          <Select
            size="middle"
            defaultValue={record.unit_id || ''}
            style={{ textAlign: 'left' }}
            value={record.unit_id}
            onChange={(e: any) => {

              var drugUnit = getDrugUnitById(e, record);
              var totalAmntCurrent = record.total_amount || 0;
              if (drugUnit === null) {
                drugUnit = { unit_parent_id: e, unit_qty: 1, import_price: 0, price: 0 }
              }

              record.unit_id = e;
              record.unit_parent_id = drugUnit.unit_parent_id;
              record.price = drugUnit.import_price;
              record.total_amount = 0;
              record.quantity = 0;

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount_original = (invImportCreateReq.info.amount_original || 0) - totalAmntCurrent + record.total_amount;
              setInvImportCreateReq({ ...invImportCreateReq });
              props.updateAmtInfo(invImportCreateReq.info.amount_original);
            }}
            options={unitOptions}
          />
        )
      },
    },
    {
      title: "Giá nhập",
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
            name="price"
            onChange={(e: any) => {
              var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;
              if (value < (record.discount_amount || 0)) {
                notification["error"]({
                  message: "Lỗi",
                  description: 'Giá nhập không được nhỏ hơn giảm giá',
                });
              }

              // if (value < (record.cur_price || 0)) {
              //   notification["warning"]({
              //     message: "Cảnh bảo",
              //     description: 'Giá nhập cao hơn giá bán, vui lòng kiểm tra lại',
              //   });
              // }

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
      title: "Vat",
      dataIndex: "vat_percent",
      key: "vat_percent",
      width: "50px",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Select
            size="middle"
            defaultValue={record.vat_percent || '0%'}
            value={record.vat_percent || 0}
            onChange={(e: any) => {
              var totalAmntCurrent = record.total_amount || 0;
              record.vat_percent = parseInt(e) || 0;
              record.total_amount = amountTotal(record.quantity, record.price, record.discount_amount, record.vat_percent);

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount_original = (invImportCreateReq.info.amount_original || 0) - totalAmntCurrent + record.total_amount;
              setInvImportCreateReq({ ...invImportCreateReq });
              props.updateAmtInfo(invImportCreateReq.info.amount_original);
            }}
            options={vat}
          />
        )
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      width: "11%",
      align: "center",
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
      width: "40px",
      align: "center",
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
            scroll={{ x: 900 }}
            components={{
              header: {
                cell: (props: any) => {
                  return (
                    <th
                      {...props}
                      style={{ ...props.style, backgroundColor: '#012970', color: '#ffffff' }}
                    />
                  );
                },
              },
            }}
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

export default InvImportCreateTable;