import { Col, DatePicker, Empty, notification, Row, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import "../../assets/css/supplier.css";
import { IDrugInvSummaryResponse } from "../../interfaces/summaryInvoice";
import { IInvoiceImportResponse } from "../../interfaces/inventoryImport";
import { IDrugInventoryDetailResponse } from "../../interfaces/inventoryDetail";
import { ImportImportType, ImportStatus, PayMethod } from "../../constants/general.constant";
import { renderText } from "../common";
import invoiceApi from "../../apis/invoice.api";

const { RangePicker } = DatePicker;

interface IInvSummaryWithExportInvProps {
    data: IDrugInvSummaryResponse
}

const InvSummaryExport = (props: IInvSummaryWithExportInvProps) => {

    const [isEmptyDate, setIsEmptyData] = useState(true);
    const [detail, setInvImportRes] = useState<IInvoiceImportResponse>({ inventory_id: '' });


    // get
    const getListInvImportWidthSummaryID = async () => {
        setIsEmptyData(true);
        try {
            await invoiceApi.getList({
                page: 0,
                size: 0,
                classification: true,
                summary_id: props.data.summary_id
            }).then((response) => {
                if (response.meta.code === 200) {
                    setInvImportRes(response.data.data.length > 0 ? response.data.data[0] : { inventory_id: '' });
                    console.log(response.data.data.length > 0 ? response.data.data[0] : { inventory_id: '' }, detail);
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

    const columnInvSummaryWithExportInv: ColumnsType<IDrugInventoryDetailResponse> = [
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
            width: "25%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    {ImportImportType.find((x) => x.value == text)?.label}
                </div>
            )
        },
        {
            title: "Số lô",
            dataIndex: "lot",
            align: "center" as AlignType,
            width: "15%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span>{text}</span>
                </div>
            )
        },
        {
            title: "Đơn vị",
            dataIndex: "unit_name",
            align: "center" as AlignType,
            width: "15%",
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
            width: "15%",
            render: (text) => (
                <div className="style-text-limit-number-line2">
                    <span>{Math.abs(text || 0)}</span>
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
                    <span style={{ fontWeight: "600", color: "red" }}>{Math.abs(text || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                </div>
            )
        }
    ];

    useEffect(() => {
        getListInvImportWidthSummaryID();
    }, [props.data])

    return (
        <div className="container-page history-provider-container tab-pane-container">
            {isEmptyDate ? <Empty description='Không tìm thấy dữ liệu' /> :
                <>
                    <Row style={{ margin: "5px" }} className="d-flex ant-row-flex-space-around">
                        <Col span={8} style={{ padding: "5px" }}>
                            {renderText("Mã phiếu nhập", detail.inventory_code || '')}
                            {renderText("Thời gian tạo", detail.created_date ? format(new Date(detail.created_date), "HH:mm dd-MM-yyyy") : "")}
                            {renderText("Mã cửa hàng", detail.drg_store_id || '')}
                        </Col>
                        <Col span={8} style={{ padding: "5px" }}>
                            {renderText("Phân loại xuất", ImportImportType.find((x) => x.value == detail.inventory_type)?.label || '')}
                            {renderText("Trạng thái", ImportStatus.find((x) => x.value == props.data.status)?.label || '')} {/*TODO*/}
                        </Col>

                        <Col span={8} style={{ padding: "5px" }}>
                            {renderText("Người tạo phiếu", 'Hang')} {/*props.users.find(x => x.user_id == props.data.updated_user)?.user_name || ''*/}
                            {renderText("Ghi chú", detail.note || '')}
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
                            // className="table table-hover provider-table"
                            scroll={{ x: 1024, y: 440 }}
                            columns={columnInvSummaryWithExportInv}
                            dataSource={detail.drg_inv_inventory_details}
                            pagination={false}
                        />
                        {/* </div> */}
                    </div>
                </>
            }
        </div>
    );
};


export default InvSummaryExport;

