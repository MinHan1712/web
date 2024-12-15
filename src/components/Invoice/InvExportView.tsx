import { CheckCircleOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Modal, notification, Popconfirm, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { AlignType } from "rc-table/lib/interface";
import { IDrugInventoryDetailResponse } from "../../interfaces/inventoryDetail";
import { IInvoiceImportResponse } from "../../interfaces/inventoryImport";
import { IProperty } from "../../interfaces/property";
import { renderText } from "../common";
import { ImportStatus } from "../../constants/general.constant";

interface IModalInvHistoryExportProps {
    open: boolean;
    onCancel: () => void;
    data: IInvoiceImportResponse;
    // users: IProperty[];
}

const InvExportView = (props: IModalInvHistoryExportProps) => {

    const columnInvoiceDetailHistoryImport: ColumnsType<IDrugInventoryDetailResponse> = [
        {
            title: "Mã sản phẩm",
            dataIndex: "drug_code",
            align: "left" as AlignType,
            width: "13%",
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
            width: "22%",
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
            width: "13%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span>{text}</span>
                </div>
            )
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            align: "center" as AlignType,
            width: "13%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span>{Math.abs(text) || 0}</span>
                </div>
            )
        },
        {
            title: "Đơn vị",
            dataIndex: "unit_name",
            align: "center" as AlignType,
            width: "13%",
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
            width: "13%",
            render: (_: any, record: IDrugInventoryDetailResponse, index: number) => {
                return (
                    <div className="style-text-limit-number-line2">
                        <span style={{ fontWeight: "600", color: "red" }}>{((Math.abs(record.price || 0) - Math.abs(record.discount_amount || 0)) * (1 + (record.vat_percent || 0) / 100)).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                )
            }
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            align: "right" as AlignType,
            width: "13%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span style={{ color: "red" }}>{Math.abs(text || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                </div>
            )
        }
    ];

    const cancelInventoryExport = (inventory_id: string) => {
        try {
            console.log(inventory_id);
        } catch {
            notification['error']({
                message: "Thông báo",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
        }
    }
    return (
        <Modal
            open={props.open}
            title="Chi tiết phiếu xuất kho"
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
                        {renderText("Mã phiếu xuất", props.data.inventory_code || '')}
                        {renderText("Thời gian tạo", props.data.created_date ? format(new Date(props.data.created_date), "HH:mm dd-MM-yyyy") : "")}
                        {renderText("Ngày thực tế", props.data.process_date ? format(new Date(props.data.process_date), "dd-MM-yyyy") : "")}
                    </Col>
                    <Col span={8} style={{ padding: "5px" }}>
                        {renderText("Mã cửa hàng", props.data.drg_store_id || '')}
                        {renderText("Tên cửa hàng", 'Hang')} {/*TODO */}
                        {renderText("Người tạo phiếu", 'Hang')} {/*props.users.find(x => x.user_id == props.data.updated_user)?.user_name || ''*/}
                    </Col>

                    <Col span={8} style={{ padding: "5px" }}>
                        {renderText("Tổng tiền", Number(props.data.amount || '0').toLocaleString('vi', { style: 'currency', currency: 'VND' }))}
                        {renderText("Trạng thái", ImportStatus.find((x) => x.value == props.data.status)?.label || '')}
                        {renderText("Ghi chú", props.data.note || '')}
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
                        {props.data.inventory_type == 'CHKE' || props.data.status == '0' ? "" :
                            <Popconfirm
                                title="Bạn có muốn hủy phiếu này?"
                                onConfirm={() => cancelInventoryExport(props.data.inventory_id)}
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
        </Modal >
    );
};

export default InvExportView;
