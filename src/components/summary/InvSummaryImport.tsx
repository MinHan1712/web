import { Col, DatePicker, Empty, notification, Row } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import invoiceApi from "../../apis/invoice.api";
import "../../assets/css/supplier.css";
import { IDrugInventoryDetailResponse } from "../../interfaces/inventoryDetail";
import { IInvoiceImportResponse } from "../../interfaces/inventoryImport";
import { IProperty } from "../../interfaces/property";
import { IDrugInvSummaryResponse } from "../../interfaces/summaryInvoice";
import { renderText } from "../common";
const { RangePicker } = DatePicker;

interface IInvSummaryWithImportInvProps {
    data: IDrugInvSummaryResponse;
    importTypes: IProperty[];
    payMenthods: IProperty[];
}

const InvSummaryImport = (props: IInvSummaryWithImportInvProps) => {
    const [isEmptyDate, setIsEmptyData] = useState(true);
    const [detail, setInvImportRes] = useState<IInvoiceImportResponse>({ inventory_id: '' });


    // get
    const getListInvImportWidthSummaryID = async () => {
        setIsEmptyData(true);
        try {
            await invoiceApi.getList({
                page: 0,
                size: 0,
                classification: false,
                summary_id: props.data.summary_id
            }).then((response) => {

                if (response.meta.code === 200) {
                    setInvImportRes(response.data.data.length > 0 ? response.data.data[0] : { inventory_id: '' });
                    setIsEmptyData(false);
                    return;
                } else {
                    notification['error']({
                        message: "Lỗi",
                        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
                    });
                }

            })
                .catch(() => {
                    notification['error']({
                        message: "Lỗi",
                        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
                    });
                })

        } catch (err) {
            notification['error']({
                message: "Lỗi",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
            setIsEmptyData(true);
        } finally { }

    }

    const columnInvSummaryWithImportInv: ColumnsType<IDrugInventoryDetailResponse> = [
        {
            title: "Mã sản phẩm",
            dataIndex: "drug_code",
            align: "left" as AlignType,
            width: "16%",
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
            width: "11%",
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
            width: "15%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span>{format(new Date(text), "dd-MM-yyyy")}</span>
                </div>
            )
        },
        {
            title: "Đơn vị",
            dataIndex: "unit_name",
            align: "center" as AlignType,
            width: "10%",
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
            width: "16%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span style={{ fontWeight: "600", color: "red" }}>{Math.abs(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                </div>
            )
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            align: "center" as AlignType,
            width: "10%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span>{text}</span>
                </div>
            )
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            align: "right" as AlignType,
            width: "16%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span style={{ color: "red" }}>{Math.abs(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                </div>
            )
        },
        {
            title: "VAT",
            dataIndex: "vat_percent",
            align: "center" as AlignType,
            width: "6%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span>{text || 0}%</span>
                </div>
            )
        }

    ];

    useEffect(() => {
        getListInvImportWidthSummaryID();
    }, [props.data])
    return (
        <div className="container-page history-provider-container tab-pane-container">
            {isEmptyDate ? <Empty description='Không có dữ liệu' /> :
                <>
                    <Row style={{ margin: "5px" }} className="d-flex ant-row-flex-space-around">
                        <Col span={8} style={{ padding: "5px" }}>
                            {renderText("Mã phiếu nhập", detail.inventory_code || '')}
                            {renderText("Thời gian tạo", detail.created_date ? format(new Date(detail.created_date), "HH:mm dd-MM-yyyy") : "")}
                            {renderText("Ngày thực tế", detail.process_date ? format(new Date(detail.process_date), "HH:mm dd-MM-yyyy") : "")}
                        </Col>
                        <Col span={8} style={{ padding: "5px" }}>
                            {renderText("Loại nhập", props.importTypes.find((x) => x.unit_cd == detail.inventory_type)?.value || '')}
                            {renderText("Nhà cung cấp", detail.provider_name || '')}
                            {renderText("Người tạo", detail.updated_user || '')}
                            {renderText("Ghi chú", detail.note || '')}
                        </Col>

                        <Col span={8} style={{ padding: "5px" }}>
                            {renderText("PT thanh toán", props.payMenthods.find((x) => x.unit_cd == detail.pay_method)?.value || '')}
                            {renderText("VAT", detail.vat + "%" || '0%')}
                        </Col>
                    </Row>

                    <div className="ant-table-wrapper" style={{ backgroundColor: 'rgb(255, 255, 255)', marginTop: '10px', minHeight: '300px' }}>
                        {/* <div className="table-container"> */}
                        <Table locale={{
                            emptyText: (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
                            )
                        }}
                            rowKey={(record) => record.id ? record.id : "0"}
                            style={{
                                backgroundColor: 'rgb(255, 255, 255',
                                marginTop: '10px',
                                minHeight: '350px'
                            }}
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
                            size="small"
                            className="table table-hover provider-table"
                            scroll={{ x: 1024, y: 440 }}
                            columns={columnInvSummaryWithImportInv}
                            dataSource={detail.drg_inv_inventory_details}
                            pagination={false}
                        />
                        {/* </div> */}
                    </div>
                </>}
        </div>
    );
};


export default InvSummaryImport;

