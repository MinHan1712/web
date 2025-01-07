import { CheckCircleOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Flex, Modal, notification, Popconfirm, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { AlignType } from "rc-table/lib/interface";
import { IDrugInventoryDetailResponse } from "../../interfaces/inventoryDetail";
import { IInvoiceImportResponse } from "../../interfaces/inventoryImport";
import { IProperty } from "../../interfaces/property";
import { renderText } from "../common";
import { ImportStatus } from "../../constants/general.constant";
import invoiceApi from "../../apis/invoice.api";
import { IUserWithRoleResponse } from "../../interfaces/userManager";
import { ILoginResponse } from "../../interfaces/login";
import { useNavigate } from "react-router-dom";

interface IModalInvHistoryExportProps {
    open: boolean;
    onCancel: () => void;
    data: IInvoiceImportResponse;
    // users: IProperty[];
    users: IUserWithRoleResponse[];
    store: ILoginResponse;
}

const InvExportView = (props: IModalInvHistoryExportProps) => {
    const navigate = useNavigate();
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
                        <span style={{ fontWeight: "600", color: "red" }}>{((Math.abs(record.price || 0) - Math.abs(record.discount_amount || 0)) * (1 + (record.vat_percent || 0) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
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
                    <span style={{ fontWeight: "600", color: "red" }}>{Math.abs(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                </div>
            )
        }
    ];

    const handleNavigate = () => {
        navigate('/kho/suaphieuxuatkho', { state: props.data });
    };

    const cancelInventoryExport = async (inventory_id: string) => {
        try {
            console.log(inventory_id);
            return await invoiceApi.cancel(inventory_id, "e")
                .then((response) => {
                    if (response.meta.code === 200) {
                        notification['success']({
                            message: "Thông báo",
                            description: 'Hủy phiếu xuất kho thành công',
                        });
                        props.onCancel();
                    } else {
                        notification['error']({
                            message: "Lỗi",
                            description: 'Hủy phiếu xuất kho không thành công. Có một lỗi nào đó. Vui lòng thử lại',
                        });
                    }
                })
                .catch(() => {
                    notification['error']({
                        message: "Lỗi",
                        description: 'Hủy phiếu xuất kho không thành công. Có một lỗi nào đó. Vui lòng thử lại',
                    });
                })
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
                        {renderText("Tên cửa hàng", props.store.storeName || '')}
                        {renderText("Người tạo phiếu", props.users.find(x => x.login == props.data.updated_user)?.user_name || '')}
                    </Col>

                    <Col span={8} style={{ padding: "5px" }}>
                        {renderText("Tổng tiền", `${(props.data.amount || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`, true)}
                        {renderText("Trạng thái", ImportStatus.find((x) => x.value == props.data.status)?.label || '')}
                        {renderText("Ghi chú", props.data.note || '')}
                    </Col>
                </Row>

                <div className="ant-table-wrapper" style={{ backgroundColor: 'rgb(255, 255, 255)', marginTop: '10px', minHeight: '300px' }}>
                    <Table locale={{
                        emptyText: (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
                        )
                    }}
                        rowKey={(record) => record.id ? record.id : "0"}

                        size="small"
                        className="table table-hover provider-table"
                        scroll={{ x: 1024, y: 440 }}
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
                        columns={columnInvoiceDetailHistoryImport}
                        dataSource={props.data.drg_inv_inventory_details}
                        pagination={false}
                    />
                </div>
                <Flex gap="middle" justify="flex-end" align={'center'} style={{ borderTop: '1px solid #e2e3e5', paddingTop: '10px' }}>

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
                    {props.data.status === "1" || props.data.status === "3" ?
                        <Button
                            className="button btn-update d-flex flex-row justify-content-center align-content-center"
                            type="primary"
                            onClick={handleNavigate}
                        >
                            <CheckCircleOutlined />
                            <span>Sửa phiếu</span>
                        </Button>
                        : ""}

                    <Button
                        className="button btn-cancel d-flex flex-row justify-content-center align-content-center"
                        type="primary"
                        onClick={() => { props.onCancel(); }}
                    >
                        <CheckCircleOutlined />
                        <span>Đóng</span>
                    </Button>
                </Flex>
            </>
        </Modal >
    );
};

export default InvExportView;
