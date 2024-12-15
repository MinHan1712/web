import { Col, DatePicker, Empty, Row, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";

import "../../../../assets/css/page.css";
import "../../../../assets/css/supplier.css";
import { IDrugInvSummaryResponse } from "../../interfaces/summaryInvoice";
import { IInvoiceImportResponse } from "../../interfaces/inventoryImport";
import { IDrugInventoryDetailResponse } from "../../interfaces/inventoryDetail";
import { ImportImportType, ImportStatus, PayMethod } from "../../constants/general.constant";
import { renderText } from "../common";

const { RangePicker } = DatePicker;

interface IInvSummaryWithExportInvProps {
    data: IDrugInvSummaryResponse
}

const InvSummaryExport = (props: IInvSummaryWithExportInvProps) => {

    const [isEmptyDate, setIsEmptyData] = useState(true);
    const [detail, setDetail] = useState<IInvoiceImportResponse>({ inventory_id: '' })

    // get
    const getListInvImportWidthSummaryID = () => {
        setIsEmptyData(true);
        //set detail
        // return invSummaryAPI.getInvExportWidthSummaryId(invSummaryItem.summary_id)
        //     .then((value) => {
        //         if (value.data) {
        //             setDetail(value.data);
        //             setIsEmptyData(false);
        //         }

        //     })
        //     .catch((error) => {
        //         setIsEmptyData(true);
        //     });
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
                    <span style={{ fontWeight: "600", color: "red" }}>{Math.abs(text || 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
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
                        <div className="table-container">
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
                                size="small"
                                className="table table-hover provider-table"
                                scroll={{ x: 1024, y: 440 }}
                                columns={columnInvSummaryWithExportInv}
                                dataSource={detail.drg_inv_inventory_details}
                                pagination={false}
                            />
                        </div>
                    </div>
                </>
            }
        </div>
    );
};


export default InvSummaryExport;

