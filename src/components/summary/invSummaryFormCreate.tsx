import { DeleteOutlined } from "@ant-design/icons";
import { Empty, Input, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { useSummaryContext } from "../../pages/InvSummaryCreate";
import { IDrgInvSummaryDetailCreate } from "../../interfaces/summaryInvoice";

interface InventorySummaryCreateFormPorps {
  confirmDeleteCellToTable: (key: number, index: number) => void;
}


const InvSummaryFormCreate = (props: InventorySummaryCreateFormPorps) => {
  const { invSummaryCreateReq, setInvSummaryCreateReq } = useSummaryContext();
  let count = 1;
  const columnsInvSummaryDetail: ColumnsType<IDrgInvSummaryDetailCreate> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "50px",
      align: 'left',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{count++}</span>
        </div>
      ),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "drug_code",
      key: "drug_code",
      width: "17%",
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
      width: "18%",
      align: 'left',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Số lô",
      dataIndex: "lot",
      key: "lot",
      width: "10%",
      align: "center",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "drug_unit_name",
      key: "drug_unit_name",
      width: "10%",
      align: "center",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "exp_date",
      key: "exp_date",
      width: "12%",
      align: "center",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text ? format(new Date(text), 'dd-MM-yyyy') : ''}</span>
        </div>
      ),
    },
    {
      title: "SL tồn",
      dataIndex: "pre_qty",
      key: "pre_qty",
      width: "10%",
      align: "center",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "SL thực tế",
      dataIndex: "cur_qty",
      key: "cur_qty",
      width: "12%",
      align: "center",
      render: (_: any, record: IDrgInvSummaryDetailCreate, index: number) => {
        return (
          <Input
            size="middle"
            min={0}
            value={record.cur_qty}
            name="cur_qty"
            onChange={(e: any) => {
              var value = parseFloat(e?.target?.value.replace(/,/g, '')) || 0;
              record.cur_qty = value;

              invSummaryCreateReq.products[index] = record;
              setInvSummaryCreateReq({ ...invSummaryCreateReq });
            }}
          />
        )
      },
    },
    {
      title: "",
      dataIndex: "key",
      key: "key",
      width: "50px",
      align: "right",
      render: (_: any, record: IDrgInvSummaryDetailCreate, index: number) => {
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
  return (
    <div className="table-wrapper">
      <div className="table-container">
        <Table locale={{
          emptyText: (
            <div style={{ textAlign: 'center', color: 'black' }}>Chưa có thuốc được chọn</div>
          )
        }}
          rowKey={(record) => record.key || ''}
          size="small"
          style={{
            marginTop: '5px', height: '611px', overflowY: 'scroll'
          }}
          scroll={{ x: 240 }}
          className="table table-hover provider-table"
          columns={columnsInvSummaryDetail}
          dataSource={invSummaryCreateReq.products}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default InvSummaryFormCreate;