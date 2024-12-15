import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Modal, notification, Popconfirm, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { AlignType } from "rc-table/lib/interface";
import { IInvoiceImportResponse } from "../../interfaces/inventoryImport";
import { IDrugInventoryDetailResponse } from "../../interfaces/inventoryDetail";
import { renderText } from "../common";
import { IProperty } from "../../interfaces/property";

interface IModalInvHistoryImportProps {
  open: boolean;
  onCancel: () => void;
  data: IInvoiceImportResponse;
  importTypes: IProperty[];
  payMenthods: IProperty[];
}

const InvImportView = (props: IModalInvHistoryImportProps) => {

  const cancelInventoryImport = (inventory_id: string) => {
    try {
      console.log(inventory_id);
    } catch {
      notification['error']({
        message: "Thông báo",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    }
  }

  const columnInvoiceDetailHistoryImport: ColumnsType<IDrugInventoryDetailResponse> = [
    {
      title: "Mã sản phẩm",
      dataIndex: "drug_code",
      align: "left" as AlignType,
      width: "15%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      )
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "drug_name",
      align: "left" as AlignType,
      width: "20%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {text}
        </div>
      )
    },
    {
      title: "Số lô",
      dataIndex: "lot",
      align: "center" as AlignType,
      width: "10%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      )
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "exp_date",
      align: "center" as AlignType,
      width: "14%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text ? format(new Date(text), "dd-MM-yyyy") : ''}</span>
        </div>
      )
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center" as AlignType,
      width: "9%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text || 0}</span>
        </div>
      )
    },
    {
      title: "Đơn vị",
      dataIndex: "unit_name",
      align: "center" as AlignType,
      width: "9%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      )
    },
    {
      title: "Giá nhập",
      dataIndex: "price",
      align: "right" as AlignType,
      width: "15%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ fontWeight: "600", color: "red" }}>{Number(text || '0').toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
        </div>
      )
    },
    {
      title: "Giảm giá/SP",
      dataIndex: "discount_amount",
      align: "right" as AlignType,
      width: "10%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ fontWeight: "400" }}>{Number(text || '0').toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
        </div>
      )
    },
    {
      title: "VAT",
      dataIndex: "vat_percent",
      align: "center" as AlignType,
      width: "5%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text || 0} %</span>
        </div>
      )
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      align: "right" as AlignType,
      width: "15%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ color: "red" }}>{Number(text || '0').toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
        </div>
      )
    }
  ];

  return (
    <Modal
      open={props.open}
      title={`Chi tiết phiếu nhập kho ${props.data.inventory_id || ''} `}
      okText="Create"
      maskClosable={false}
      cancelText="Cancel"
      onCancel={() => { props.onCancel(); }}
      width={"80%"}
      footer={null}
    >
      <>

        <Row style={{ margin: "5px" }} className="d-flex ant-row-flex-space-around">
          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Mã phiếu nhập", props.data.inventory_code || '')}
            {renderText("Thời gian tạo", props.data.created_date ? format(new Date(props.data.created_date), "HH:mm dd-MM-yyyy") : "")}
            {renderText("Ngày thực tế", props.data.process_date ? format(new Date(props.data.process_date), "HH:mm dd-MM-yyyy") : "")}
          </Col>
          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Loại nhập", props.importTypes.find((x) => x.unit_cd == props.data.inventory_type)?.value || '')}
            {renderText("Nhà cung cấp", props.data.provider_name || '')}
            {renderText("Người tạo", props.data.updated_user || '')}
            {renderText("Ghi chú", props.data.note || '')}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {renderText("PT thanh toán", props.payMenthods.find((x) => x.unit_cd == props.data.pay_method)?.value || '')}
            {renderText("VAT", props.data.vat + "%" || '0%')}
            {renderText("Giảm giá", (props.data.discount_amount || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' }))}
            {renderText("Thành tiền", (props.data.amount || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' }))}
            {renderText("Còn nợ", (props.data.amount_debt || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' }))}
          </Col>
        </Row>

        <div className="ant-table-wrapper" style={{ backgroundColor: 'rgb(255, 255, 255)', marginTop: '10px', minHeight: '300px' }}>
          <div className="table-container">
            <Table locale={{
              emptyText: (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
              )
            }}
              rowKey={(record) => record.id ? record.id : "0"}
              size="small"
              className="table table-hover provider-table"
              scroll={{ x: 1024, y: 440 }}
              columns={columnInvoiceDetailHistoryImport}
              dataSource={props.data.drg_inv_inventory_details}
              pagination={false}
            />
          </div>
        </div>
        <Row className="ant-modal-footer">
          <Col span={12} className="d-flex">
            {props.data.inventory_type == 'CHK' || props.data.status == '0' ? "" :
              <Popconfirm
                title="Bạn có muốn hủy phiếu này?"
                onConfirm={() => cancelInventoryImport(props.data.inventory_id)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button
                  className={`button btn-delete d-flex flex-row justify-content-center align-content-center btn-delete`}
                  type="primary"
                >
                  <DeleteOutlined />
                  <span>Hủy phiếu</span>
                </Button>
              </Popconfirm>

            }
          </Col>
          <Col span={12} className="d-flex justify-content-end">
            <Button
              className="button btn-cancel d-flex flex-row justify-content-center align-content-center"
              type="primary"
              onClick={() => { props.onCancel(); }}
            >
              <CheckCircleOutlined />
              <span>Đóng</span>
            </Button>
          </Col>
        </Row>
      </>
    </Modal>
  );
};

export default InvImportView;
