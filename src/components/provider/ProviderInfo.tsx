
import { formItemLayout } from "../../constants/general.constant";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, SyncOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Input, Modal, notification, Popconfirm, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { IProviderDelete, IProviderResponse, IProviderUpdate } from "../../interfaces/provider";
import '../../assets/css/style.css';
import providerApi from "../../apis/provider.api";


interface IProviderInformationProps {
    data: IProviderResponse,
    onCancel: () => void;
}

const ProviderInfo = (props: IProviderInformationProps) => {
    const [form] = Form.useForm<IProviderResponse>();
    const [isSummitForm, setIsSummitForm] = useState(false);
    const [btnEdit, setBtnEdit] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
    const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);


    useEffect(() => {
        form.setFieldsValue({ ...props.data });
    }, [props.data]);


    useEffect(() => {
        if (isSummitForm) form.submit();
    }, [isSummitForm]);



    const updateProvider = async (value: IProviderResponse) => {
        try {
            let providerUpdate: IProviderUpdate = {
                provider_id: props.data.provider_id,
                provider_name: value.provider_name,
                phone: value.phone,
                address: value.address,
                note: value.note,
                website: value.website,
                tax_no: value.tax_no,
                status: props.data.status
            };
            console.log("providerUpdate", providerUpdate);

            const response = await providerApi.update(providerUpdate);
            handleCloseModalView();
            props.onCancel();
            console.log(response)
        } catch (err) {
            console.log(err);
        } finally { setConfirmLoadingUpdate(false); }
    }

    const handleActiondDelete = () => {
        try {
            setConfirmLoadingDelete(true);

            setTimeout(() => {
                setOpenConfirmDelete(false);
                setConfirmLoadingDelete(false);
            }, 2000);
        } catch {
            notification['error']({
                message: "Thông báo",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
        }
    };

    const handleCloseModalView = () => {
        form.resetFields();
        setOpenConfirmDelete(false);
        setConfirmLoadingDelete(false);
        setConfirmLoadingUpdate(false);
        setBtnEdit(false);
    };

    return (
        <>
            <Form
                name="providerInformation"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "100%", padding: '0 10px' }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={updateProvider}
            >
                <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
                    <div className="wrapper-column" style={{ width: '40%' }}>
                        <Form.Item<IProviderResponse>
                            {...formItemLayout}
                            labelAlign={"left"}
                            name={'provider_name'}
                            label={
                                <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhà cung cấp</span>
                            }
                        >
                            <Input
                                className="form-input d-flex"
                                size="middle"
                                placeholder={"Nhập tên nhà cung cấp"}
                                name={'provider_name'}
                                id={'provider_name'}
                                value={props.data.provider_name}
                                disabled={!btnEdit}
                            />
                        </Form.Item>

                    </div>
                    <div className="wrapper-column" style={{ width: '40%' }}>
                        <Form.Item<IProviderResponse>
                            {...formItemLayout}
                            name={'email'}
                            labelAlign={"left"}
                            label={
                                <span style={{ fontWeight: "550", fontSize: "14px" }}>Email</span>
                            }
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Email không đúng định dạng',
                                },
                            ]}
                        >
                            <Input
                                className="form-input d-flex"
                                size="middle"
                                placeholder={"Nhập email nhà cung cấp"}
                                name={'email'}
                                id={'email'}
                                value={props.data.email}
                                disabled={!btnEdit}
                            />
                        </Form.Item>
                    </div>
                </Flex>
                <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
                    <div className="wrapper-column" style={{ width: '40%' }}>
                        <Form.Item<IProviderResponse>
                            {...formItemLayout}
                            labelAlign={"left"}
                            name={'phone'}
                            label={
                                <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
                            }
                        // rules={[
                        //     {
                        //         required: false,
                        //         pattern: new RegExp("/\S+@\S+\.\S+/"),
                        //         message:'Định dạng số điện thoại không đúng',
                        //     },
                        //   ]}
                        >
                            <Input
                                className="form-input d-flex"
                                size="middle"
                                placeholder={"Nhập số điện thoại nhà cung cấp"}
                                name={'phone'}
                                id={'phone'}
                                value={props.data.phone}
                                disabled={!btnEdit}
                            />
                        </Form.Item>

                    </div>
                    <div className="wrapper-column" style={{ width: '40%' }}>
                        <Form.Item<IProviderResponse>
                            {...formItemLayout}
                            name={'website'}
                            labelAlign={"left"}
                            label={
                                <span style={{ fontWeight: "550", fontSize: "14px" }}>Website</span>
                            }
                        >
                            <Input
                                className="form-input d-flex"
                                size="middle"
                                placeholder={"Nhập website nhà cung cấp"}
                                name={'website'}
                                id={'website'}
                                value={props.data.website}
                                disabled={!btnEdit}
                            />
                        </Form.Item>
                    </div>
                </Flex>
                <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
                    <div className="wrapper-column" style={{ width: '40%' }}>
                        <Form.Item<IProviderResponse>
                            {...formItemLayout}
                            labelAlign={"left"}
                            name={'address'}
                            label={
                                <span style={{ fontWeight: "550", fontSize: "14px" }}>Địa chỉ</span>
                            }
                        >
                            <Input
                                className="form-input d-flex"
                                size="middle"
                                placeholder={"Nhập địa chỉ nhà cung cấp"}
                                name={'address'}
                                id={'address'}
                                value={props.data.address}
                                disabled={!btnEdit}
                            />
                        </Form.Item>

                    </div>
                    <div className="wrapper-column" style={{ width: '40%' }}>
                        <Form.Item<IProviderResponse>
                            {...formItemLayout}
                            name={'tax_no'}
                            labelAlign={"left"}
                            label={
                                <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã thuế</span>
                            }
                        >
                            <Input
                                className="form-input d-flex"
                                size="middle"
                                placeholder={"Nhập số thuế nhà cung cấp"}
                                name={'tax_no'}
                                id={'tax_no'}
                                value={props.data.tax_no}
                                disabled={!btnEdit}
                            />
                        </Form.Item>
                    </div>
                </Flex>
            </Form>
            <Flex gap="middle" justify="space-between" align={'center'} style={{ borderTop: '1px solid #e2e3e5', paddingTop: '10px' }}>
                <Flex>
                    <Popconfirm
                        title="Title"
                        description="Bạn có chắc chắn muốn xoá nhà cung cấp?"
                        open={openConfirmDelete}
                        onConfirm={handleActiondDelete}
                        okText='Đồng ý'
                        cancelText='Hủy'
                        okButtonProps={{ loading: confirmLoadingDelete }}
                        onCancel={() => setOpenConfirmDelete(false)}
                    >
                        <Button
                            className="button btn-delete"
                            type="primary"
                            onClick={() => setOpenConfirmDelete(true)}
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
                                setIsSummitForm(!isSummitForm);
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

export default ProviderInfo;