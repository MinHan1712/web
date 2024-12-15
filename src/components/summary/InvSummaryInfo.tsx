import { Empty, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { DrugInvSummaryDetailResponse, IDrugInvSummaryResponse } from "../../interfaces/summaryInvoice";

interface IDrgInvSummaryProps {
  data: IDrugInvSummaryResponse
}

const InvSummaryInfo = (props: IDrgInvSummaryProps) => {
  const [loading, setLoading] = useState(false);

  const columnsDrugSummaryInv: TableColumnsType<DrugInvSummaryDetailResponse> = [
    {
      title: "Mã sản phẩm",
      dataIndex: "drg_drug_cd",
      key: "drg_drug_cd",
      width: "15%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "drg_drug_name",
      key: "drg_drug_name",
      width: "25%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit_name",
      key: "unit_name",
      align: "center",
      width: "15%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ fontWeight: "600" }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Số lô",
      dataIndex: "lot",
      key: "lot",
      width: "15%",
      align: "center",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "SL Tồn",
      dataIndex: "pre_qty",
      key: "pre_qty",
      align: "center",
      width: "15%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ fontWeight: "600", color: "red" }}>{text}</span>
        </div>
      ),
    },
    {
      title: "SL thực tế",
      dataIndex: "cur_qty",
      key: "cur_qty",
      align: "center",
      width: "15%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ fontWeight: "600", color: "red" }}>{text}</span>
        </div>
      ),
    }
  ];
  return (
    <div className="table-container">
      <Table locale={{
        emptyText: (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
        )
      }}
        rowKey={(record) => record.summary_dd_id}
        style={{
          backgroundColor: 'rgb(255, 255, 255',
          marginTop: '10px',
          minHeight: '350px'
        }}
        size="small"
        className="table"
        columns={columnsDrugSummaryInv}
        loading={loading}
        dataSource={props.data.drg_inv_summary_details}
        pagination={false}
      />
    </div>

  );
};

export default InvSummaryInfo;