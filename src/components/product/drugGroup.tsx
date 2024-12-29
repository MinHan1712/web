import {
    Button, Col, Flex, Form,
    Input,
    Modal, notification, Row
} from "antd";
import { useEffect, useState } from "react";

import "../../assets/css/page.css";
import "../../assets/css/supplier.css";

import { formItemLayout } from "../../constants/general.constant";
import { reloadDrgGrop, reloadDrgKind } from "../../utils/local";
import { IDrugGroupCreateRequest, IDrugGroupResponse, IDrugGroupUpdateRequest } from "../../interfaces/drugGroup";
import drgGroupApi from "../../apis/drugGroup.api";




interface IModalDrugGroupProps {
    open: boolean;
    onCancel: () => void;
    isSettingButton: boolean;
    data?: IDrugGroupResponse;
}

const DrugGroup = (props: IModalDrugGroupProps) => {


    const [form] = Form.useForm<IDrugGroupResponse>();
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState(0);

    useEffect(() => {
        form.setFieldsValue({ ...props.data });
        console.log(form.getFieldValue("code"), form.getFieldValue("name"));
    }, [props.data]);

    const handleCancel = () => {
        form.resetFields();
        props.onCancel();
    }

    const handleAction = (value: IDrugGroupResponse) => {
        switch (action) {
            case 1: //create
                createDrugGroupToApi(value);
                return;
            case 2: //update
                console.log(value);
                value = {
                    ...value,
                    drug_group_id: props.data?.drug_group_id
                }
                updateDrugGroupToApi(value);
                return;
            case 3: //delete
                removeDrugGroupToApi(props.data?.drug_group_id || '');
                return;
            default:
                handleCancel();
                return;
        }

    }

    const createDrugGroupToApi = (drgKindRequest: IDrugGroupCreateRequest) => {
        try {
            setLoading(true);
            drgGroupApi.create(drgKindRequest).then((response) => {
                // switch (response.meta[0].code) {
                //     case 200:
                notification['success']({
                    message: "Thông báo",
                    description: 'Thêm phân nhóm hàng mới thành công',
                });
                reloadDrgGrop();
                form.resetFields();
                handleCancel();
                // break;
                //     default:
                //         notification['error']({
                //             message: "Lỗi",
                //             description: 'Thêm phân nhóm hàng mới không thành công',
                //         });
                //         break;
                // }
            })
                .catch(() => {
                    notification['error']({
                        message: "Lỗi",
                        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
                    });
                }).finally(() => { setLoading(false) });
        } catch (err) {
            notification['error']({
                message: "Lỗi",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
        } finally { setLoading(false); }
    }

    const removeDrugGroupToApi = (drg_kind_id: string) => {
        setLoading(true);
        try {
            setLoading(true);
            drgGroupApi.delete(drg_kind_id).then((response) => {
                // switch (response.meta[0].code) {
                //     case 200:
                notification['success']({
                    message: "Thông báo",
                    description: 'Xoá phân nhóm hàng mới thành công',
                });
                reloadDrgGrop();
                form.resetFields();
                handleCancel();
                // break;
                //     default:
                //         notification['error']({
                //             message: "Lỗi",
                //             description: 'Xoá phân nhóm hàng mới không thành công',
                //         });
                //         break;
                // }
            })
                .catch(() => {
                    notification['error']({
                        message: "Lỗi",
                        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
                    });
                }).finally(() => { setLoading(false) });
        } catch (err) {
            notification['error']({
                message: "Lỗi",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
        } finally { setLoading(false); }
    }

    const updateDrugGroupToApi = (drgKindUpdate: IDrugGroupUpdateRequest) => {
        setLoading(true);
        try {
            setLoading(true);
            drgGroupApi.update(drgKindUpdate).then((response) => {
                // switch (response.meta[0].code) {
                //     case 200:
                notification['success']({
                    message: "Thông báo",
                    description: 'Cập nhập phân nhóm hàng mới thành công',
                });
                reloadDrgGrop();
                form.resetFields();
                handleCancel();
                // break;
                //     default:
                //         notification['error']({
                //             message: "Lỗi",
                //             description: 'Cập nhập phân nhóm hàng mới không thành công',
                //         });
                //         break;
                // }
            })
                .catch(() => {
                    notification['error']({
                        message: "Lỗi",
                        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
                    });
                }).finally(() => { setLoading(false) });
        } catch (err) {
            notification['error']({
                message: "Lỗi",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
        } finally { setLoading(false); }
    }

    return (
        <>
            <Modal
                open={props.open}
                title="Thêm mới phân nhóm"
                className="modal-drug-kind"
                okText="Create"
                maskClosable={false}
                cancelText="Cancel"
                onCancel={() => { handleCancel() }}
                width={"30%"}
                footer={[
                    <Button
                        className={`button d-flex ${props.isSettingButton ? 'btn-cancel' : 'btn-delete'}`}
                        type="primary"
                        onClick={() => {
                            setAction(props.isSettingButton ? 0 : 3);
                            form.submit();
                        }}
                    >
                        <span>{props.isSettingButton ? "Bỏ qua" : "Hủy"}</span>
                    </Button>,
                    <Button
                        className="button btn-add d-block"
                        type="primary"
                        loading={loading}
                        onClick={() => {
                            setAction(props.isSettingButton ? 1 : 2);
                            form.submit();
                        }}
                    >
                        <span>{props.isSettingButton ? "Đồng ý" : "Cập nhập"}</span>
                    </Button>,
                ]}
            >
                <Form
                    name="drgKindInformation"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ width: "100%", padding: '0 10px' }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={handleAction}
                >
                    <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%', paddingTop: '10px' }}>
                        <div className="wrapper-column" style={{ width: '100%' }}>
                            <Form.Item
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'code'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã nhóm</span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thông tin',
                                        whitespace: true
                                    }
                                ]}
                            >
                                <Input
                                    className="form-input "
                                    size="middle"
                                    placeholder={"Nhập mã phân nhóm hàng"}
                                    name={'code'}
                                    id={'code'}
                                    disabled={!props.isSettingButton}
                                />
                            </Form.Item>

                        </div>
                        <div className="wrapper-column" style={{ width: '100%' }}>
                            <Form.Item
                                {...formItemLayout}
                                name={'name'}
                                labelAlign={"left"}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên loại</span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thông tin',
                                        whitespace: true
                                    }
                                ]}
                            >
                                <Input
                                    className="form-input "
                                    size="middle"
                                    placeholder={"Nhập tên phân nhóm hàng"}
                                    name={'name'}
                                    id={'name'}
                                />
                            </Form.Item>
                        </div>
                    </Flex>
                </Form>
            </Modal >
        </>
    );
};

export default DrugGroup;
