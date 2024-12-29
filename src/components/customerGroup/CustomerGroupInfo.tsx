
import { CityType, CustonerSource, CustonerType, formItemLayout, sexType } from "../../constants/general.constant";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, SyncOutlined, QuestionCircleOutlined, PlusOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Flex, Form, Input, Modal, notification, Popconfirm, Radio, Row, Select, Space, Tabs } from "antd";
import { useEffect, useState } from "react";
import '../../assets/css/style.css';
import TextArea from "antd/es/input/TextArea";
import { ICustomerGroupResponse, ICustomerGroupUpdate } from "../../interfaces/customerGroup";
import customerGroupApi from "../../apis/customerGroup.api";


interface ICustomerGroupInformationProps {
    data: ICustomerGroupResponse,
    onCancel: () => void;
}

const CustomerGroupInfo = (props: ICustomerGroupInformationProps) => {
    const [form] = Form.useForm<ICustomerGroupResponse>();
    // const [isSummitForm, setIsSummitForm] = useState(false);
    const [btnEdit, setBtnEdit] = useState(false);
    const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
    const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);


    useEffect(() => {
        form.setFieldsValue({ ...props.data });
    }, [props.data]);


    // useEffect(() => {
    //     if (isSummitForm) form.submit();
    // }, [isSummitForm]);



    const updateCustomerGroup = async (value: ICustomerGroupResponse) => {
        try {
            let CustomerGroupUpdate: ICustomerGroupUpdate = {
                customer_group_id: props.data.customer_group_id,
                customer_group_name: value.customer_group_name,
                customer_group_cd: value.customer_group_cd,
                customer_group_type: value.customer_group_type,
                note: value.note,
                status: props.data.status
            };

            await customerGroupApi.update(CustomerGroupUpdate).then((response) => {
                console.log(response)
                // switch (response.meta[0].code) {
                //     case 200:
                notification['success']({
                    message: "Thông báo",
                    description: 'Cập nhập nhóm khách hàng thành công',
                });
                handleCloseModalView();
                props.onCancel();
                //     break;
                // default:
                //     notification['error']({
                //         message: "Lỗi",
                //         description: 'Cập nhập nhóm khách hàng không thành công',
                //     });
                //     break;
                // }
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
        } finally { setConfirmLoadingUpdate(false); }
    }

    const handleActiondDelete = async (id: string) => {
        try {
            await customerGroupApi.remove(id).then((response) => {
                console.log(response)
                // switch (response.meta[0].code) {
                //     case 200:
                notification['success']({
                    message: "Thông báo",
                    description: 'Xóa nhóm khách hàng thành công',
                });
                handleCloseModalView();
                props.onCancel();
                //     break;
                // default:
                //     notification['error']({
                //         message: "Lỗi",
                //         description: 'Xóa nhóm khách hàng không thành công',
                //     });
                //     break;
                // }
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
        } finally { }
    };

    const handleCloseModalView = () => {
        form.resetFields();
        setConfirmLoadingDelete(false);
        setConfirmLoadingUpdate(false);
        setBtnEdit(false);
    };

    return (
        <>
            <Form
                name="CustomerView"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "100%", padding: '0 10px' }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={updateCustomerGroup}
            >
                <Flex justify="space-between" align={'center'} style={{ width: '100%' }}>
                    <Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '100%' }}>
                        <div className="wrapper-column" style={{ width: '100%' }}>
                            <Form.Item<ICustomerGroupResponse>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'customer_group_cd'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã nhóm khách hàng</span>
                                }
                            >
                                <Input
                                    className="form-input d-flex"
                                    size="middle"
                                    placeholder={'Nhập mã nhóm khách hàng'}
                                    name={'customer_group_code'}
                                    id={'customer_group_code'}
                                    disabled={true}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '100%' }}>
                            <Form.Item<ICustomerGroupResponse>
                                {...formItemLayout}
                                name={'customer_group_name'}
                                labelAlign={"left"}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên nhóm khách hàng</span>
                                }
                            >
                                <Input
                                    className="form-input d-flex"
                                    size="middle"
                                    placeholder={'Nhập tên nhóm khách hàng'}
                                    name={'customer_group_name'}
                                    id={'customer_group_name'}
                                    disabled={!btnEdit}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '100%' }}>
                            <Form.Item<ICustomerGroupResponse>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'note'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mô tả</span>
                                }
                            >
                                <TextArea
                                    rows={3}
                                    className="form-input d-flex"
                                    size="middle"
                                    name={'note'}
                                    id={'note'}
                                    disabled={!btnEdit}
                                />
                            </Form.Item>
                        </div>
                    </Flex>
                </Flex>
            </Form>
            <Flex gap="middle" justify="space-between" align={'center'} style={{ borderTop: '1px solid #e2e3e5', paddingTop: '10px' }}>
                <Flex>
                    <Popconfirm
                        title="Title"
                        description="Bạn có chắc chắn muốn xoá nhà cung cấp?"
                        onConfirm={() => handleActiondDelete(props.data.customer_group_id)}
                        okText='Đồng ý'
                        cancelText='Hủy'
                        okButtonProps={{ loading: confirmLoadingDelete }}
                    >
                        <Button
                            className="button btn-delete"
                            type="primary"
                        >
                            <DeleteOutlined style={{ paddingRight: '5px' }} />
                            <span>Xóa</span>
                        </Button>
                    </Popconfirm>


                    <Button
                        className="button btn-add"
                        type="primary"
                        loading={confirmLoadingUpdate}
                        onClick={() => {
                            setBtnEdit(!btnEdit);
                            if (btnEdit) {
                                setConfirmLoadingUpdate(true);
                                form.submit()
                            }
                        }}
                    >
                        {btnEdit ? <SyncOutlined /> : <EditOutlined />}
                        <span>{btnEdit ? "Cập nhập" : "Sửa"}</span>
                    </Button>
                </Flex>
                <Button
                    className="button btn-cancel"
                    type="primary"
                    onClick={() => {
                        handleCloseModalView();
                        props.onCancel();
                    }}
                >
                    <CheckCircleOutlined style={{ paddingRight: '5px' }} />
                    <span>Đồng ý</span>
                </Button>
            </Flex>
        </>
    );
};

export default CustomerGroupInfo;