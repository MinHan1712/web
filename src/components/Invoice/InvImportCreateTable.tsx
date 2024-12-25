import { DeleteOutlined } from "@ant-design/icons";
import { DatePicker, Empty, Input, notification, Popconfirm, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { vat } from "../../constants/general.constant";
import { IImportInventoryDetailCreate } from "../../interfaces/inventoryDetail";
import { useUserContextImport } from "../../pages/InvImportCreate";


interface Props {
  confirmDeleteCellToTable: (key: number, index: number) => void;
}

const InvImportCreateTable = (props: Props) => {
  const { invImportCreateReq, setInvImportCreateReq } = useUserContextImport();

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
            min={0}
            value={record.quantity}
            name="quantity"
            status={record.quantity || 0 > 0 ? "" : "error"}
            onChange={(e: any) => {
              var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;
              var totalAmntCurrent = record.total_amount || 0;
              var drugUnit = getDrugUnitById(record.unit_id, record);

              record.quantity = Math.min(record.quantity_pre || 0, value);
              record.total_amount = (record.quantity || 0) * ((drugUnit === null ? record.price : drugUnit.price * drugUnit.unit_qty) || 0);
              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount = (invImportCreateReq.info.amount || 0) - totalAmntCurrent + record.total_amount;

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
          label: item.unit_name || ''
        }))
        return (
          <Select
            size="middle"
            defaultValue={record.unit_id || ''}
            style={{ textAlign: 'left' }}
            value={record.unit_id}
            onChange={(e: any) => {
              var drugUnit = getDrugUnitById(record.unit_id, record);
              var totalAmntCurrent = record.total_amount || 0;
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
              invImportCreateReq.info.amount = (invImportCreateReq.info.amount || 0) - totalAmntCurrent;

              invImportCreateReq.products[index] = record;
              setInvImportCreateReq({ ...invImportCreateReq });
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
              if (value < (record.discount_amount || 0) * (record.quantity || 0)) {
                notification["error"]({
                  message: "Lỗi",
                  description: 'Giá nhập không được nhỏ hơn giảm giá',
                });
              }

              if (value < (record.cur_price || 0)) {
                notification["warning"]({
                  message: "Cảnh bảo",
                  description: 'Giá nhập cao hơn giá bán, vui lòng kiểm tra lại',
                });
              }

              var totalAmntCurrent = record.total_amount || 0;
              record.price = value;
              record.total_amount = (record.quantity || 0) * (record.price || 0) - (record.discount_amount || 0) * ((record.vat_percent || 0) + 100) / 100;

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount = (invImportCreateReq.info.amount || 0) - totalAmntCurrent + record.total_amount;

              setInvImportCreateReq({ ...invImportCreateReq });
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
              var total_sum_current = (record.total_amount || 0) + (record.discount_amount || 0) * (record.quantity || 0)

              if (value > total_sum_current) {
                notification["error"]({
                  message: "Lỗi",
                  description: 'Giảm giá không được lớn hơn tổng tiền',
                });
              }

              if (value < (record.cur_price || 0)) {
                notification["warning"]({
                  message: "Cảnh bảo",
                  description: 'Giá nhập cao hơn giá bán, vui lòng kiểm tra lại',
                });
              }

              var totalAmntCurrent = record.total_amount || 0;
              record.discount_amount = value / (record.quantity || 1);
              record.total_amount = total_sum_current - (record.discount_amount || 0) * (record.quantity || 0);

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount = (invImportCreateReq.info.amount || 0) - totalAmntCurrent + record.total_amount;

              setInvImportCreateReq({ ...invImportCreateReq });
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
              record.vat_percent = e;
              record.total_amount = (record.quantity || 0) * (record.price || 0) - (record.discount_amount || 0) * (((record.vat_percent || 0) + 100) / 100);

              invImportCreateReq.products[index] = record;
              invImportCreateReq.info.amount = (invImportCreateReq.info.amount || 0) - totalAmntCurrent + record.total_amount;

              setInvImportCreateReq({ ...invImportCreateReq });
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
            <span>{Math.abs(record.total_amount || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
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
            onConfirm={() => props.confirmDeleteCellToTable(record.key || 0, index)}
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