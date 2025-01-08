import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Empty,
  Flex,
  Modal,
  notification,
  Popconfirm,
  Row,
  Table
} from "antd";
import type { ColumnsType } from 'antd/es/table';
import { format } from "date-fns";
import { AlignType } from "rc-table/lib/interface";
import invoiceApi from "../../apis/invoice.api";
import { ImportStatus } from "../../constants/general.constant";
import { IDrugInventoryDetailResponse } from "../../interfaces/inventoryDetail";
import { IInvoiceImportResponse } from "../../interfaces/inventoryImport";
import { IProperty } from "../../interfaces/property";
import { IUserWithRoleResponse } from "../../interfaces/userManager";
import { renderText } from "../common";

interface IModalInvHistoryExportProps {
  open: boolean;
  onCancel: () => void;
  data: IInvoiceImportResponse;
  users: IUserWithRoleResponse[];
  payMenthods: IProperty[];
  // users: IProperty[];
}

const InvCustomerView = (props: IModalInvHistoryExportProps) => {
  let stt: number = 1;

  const columnInvoiceDetailBill: ColumnsType<IDrugInventoryDetailResponse> = [
    {
      title: "STT",
      dataIndex: "drug_id",
      align: "left" as AlignType,
      width: "50px",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{stt++}</span>
        </div>
      )
    },
    {
      title: "Mã SP",
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
      title: "Tên SP",
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
      title: "Liều dùng",
      dataIndex: "dosage",
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
          <span>{text ? format(new Date(text), "dd-MM-yyyy") : ""}</span>
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
          <span>{Math.abs(text)}</span>
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
      title: "Đơn giá",
      dataIndex: "price",
      align: "right" as AlignType,
      width: "15%",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span style={{ fontWeight: "600", color: "red" }}>{(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
        </div>
      )
    },
    {
      title: "Giá đã giảm",
      dataIndex: "vat_percent",
      align: "right" as AlignType,
      width: "10%",
      render: (_: any, record: IDrugInventoryDetailResponse, index: number) => {
        return <div className="style-text-limit-number-line2">
          <span style={{ fontWeight: "400" }}>{((record.price || 0) - (record.discount_amount || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
        </div>
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      align: "right" as AlignType,
      width: "15%",
      render: (_: any, record: IDrugInventoryDetailResponse, index: number) => {
        return <div className="style-text-limit-number-line2">
          <span style={{ color: "red" }}>{Math.abs(record.total_amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
        </div>
      }
    }
  ];

  const cancelInventoryImport = async (inventory_id: string) => {
    try {
      return await invoiceApi.cancel(inventory_id, "e")
        .then((response) => {
          if (response.meta.code === 200) {
            notification['success']({
              message: "Thông báo",
              description: 'Hủy hóa đơn thành công',
            });
            props.onCancel();
          } else {
            notification['error']({
              message: "Lỗi",
              description: 'Hủy hóa đơn không thành công. Có một lỗi nào đó. Vui lòng thử lại',
            });
          }
        })
        .catch(() => {
          notification['error']({
            message: "Lỗi",
            description: 'Hủy hóa đơn không thành công. Có một lỗi nào đó. Vui lòng thử lại',
          });
        })
    } catch {
      notification['error']({
        message: "Thông báo",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    }
  }

  const amountTotal = () => {
    return Math.round(((props.data.amount || 0) + (props.data.discount_amount || 0)));
  }

  return (
    <Modal
      open={props.open}
      title="Chi tiết hóa đơn"
      okText="Create"
      maskClosable={false}
      cancelText="Cancel"
      onCancel={() => { props.onCancel(); }}
      width={"80%"}
      footer={null}
    >

      <Row className="d-flex">
        <Col span={8} style={{ padding: "8px 24px" }}>
          {renderText("Mã hóa đơn", props.data.inventory_code || '')}
          {renderText("Khách hàng", props.data.customer_name || '')}
          {renderText("Ngày bán", props.data.created_date ? format(new Date(props.data.created_date), "dd-MM-yyyy") : "")}
          {renderText("Ngày tạo đơn", props.data.process_date ? format(new Date(props.data.process_date), "dd-MM-yyyy") : "")}
        </Col>
        <Col span={8} style={{ padding: "8px 24px" }}>
          <Row className="d-flex align-items-center mb-1">
            <Col xs={14} sm={14} md={12} lg={10} xl={8}>
              <h5>Trạng thái: </h5>
            </Col>
            <Col xs={14} sm={14} md={12} lg={10} xl={8}>
              <div className="style-text-limit-number-line2" style={{ color: ImportStatus.find((x) => x.value == props.data.status)?.name }}>
                {ImportStatus.find((x) => x.value == props.data.status)?.label}
              </div>
            </Col>
          </Row>
          {renderText("NV bán hàng", props.users.find(x => x.user_id == props.data.updated_user)?.user_name || '')}
          {renderText("PT thanh toán", (props.payMenthods.find((x) => x.unit_cd == (props.data.pay_method || ''))?.value) || '')}
          {renderText("Ghi chú", props.data.note || "")}

        </Col>
        <Col span={8} style={{ padding: "8px 24px" }}>
          {renderText("Tổng tiền", `${(amountTotal() || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`)}
          {renderText("VAT", props.data.vat + "%" || '0%')}
          {renderText("Giảm giá", `${(props.data.discount_amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`)}
          {renderText("Thành tiền", `${(props.data.amount || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`)}
          {renderText("Khách trả", `${(props.data.amount_paid || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`)}
          {renderText("Còn nợ", `${(props.data.amount_debt || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`)}
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
            columns={columnInvoiceDetailBill}
            dataSource={props.data.drg_inv_inventory_details}
            pagination={false}
          />
        </div>
      </div>
      <Flex gap="middle" justify="flex-end" align={'center'} style={{ borderTop: '1px solid #e2e3e5', paddingTop: '10px' }}>

        {props.data.inventory_type == 'CHKE' || props.data.status == '0' ? "" :
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


        <Button
          className="button btn-cancel d-flex flex-row justify-content-center align-content-center"
          type="primary"
          onClick={() => { props.onCancel(); }}
        >
          <CheckCircleOutlined />
          <span>Đóng</span>
        </Button>
      </Flex>

    </Modal>
  );
}

export default InvCustomerView;