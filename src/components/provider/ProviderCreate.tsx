import {
    CloseCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, notification } from "antd";
import { useState } from "react";
import providerApi from "../../apis/provider.api";
import { formItemLayout } from "../../constants/general.constant";
import { IProviderCreate } from '../../interfaces/provider';

interface IProviderInformationProps {
    open: boolean;
    onCancel: () => void;
}

const ProviderCreate = (props: IProviderInformationProps) => {
    const [form] = Form.useForm<IProviderCreate>();
    const [loading, setLoading] = useState(false);

    const eventSummitForm = (formValue: IProviderCreate) => {
        createProvider(formValue);
    }

    const createProvider = async (value: IProviderCreate) => {
        try {
            return await providerApi.create(value)
                .then((response) => {
                    switch (response.meta.code) {
                        case 200:
                            notification['success']({
                                message: "Thông báo",
                                description: 'Tạo nhà cung cấp thành công',
                            });
                            form.resetFields();
                            props.onCancel();
                            break;
                        default:
                            notification['error']({
                                message: "Lỗi",
                                description: 'Tạo nhà cung cấp không thành công',
                            });
                            break;
                    }
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
                title="Chi tiết nhà cung cấp"
                okText="Create"
                maskClosable={false}
                cancelText="Cancel"
                onCancel={() => {
                    form.resetFields();
                    props.onCancel();
                }}
                width={"70%"}
                footer={[
                    <Button
                        key="back"
                        className="button btn-cancel d-block"
                        type="primary"
                        onClick={() => {
                            form.resetFields();
                            props.onCancel();
                        }}
                    >
                        <CloseCircleOutlined style={{ verticalAlign: "baseline" }} />
                        <span>Đóng</span>
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={(event) => {
                            event.preventDefault();
                            form.submit();
                        }}
                        className="button btn-add d-block"
                    >
                        <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
                        <span>Thêm mới nhà cung cấp</span>
                    </Button>,
                ]}
            >
                <Form
                    name="providerCreate"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ width: "100%", padding: '0 10px' }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={eventSummitForm}
                >
                    <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
                        <div className="wrapper-column" style={{ width: '40%' }}>
                            <Form.Item<IProviderCreate>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'provider_name'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhà cung cấp</span>
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
                                    placeholder={"Nhập tên nhà cung cấp"}
                                    name={'provider_name'}
                                    id={'provider_name'}
                                    // value={provider?.provider_name}
                                    prefix={<UserOutlined />}
                                />
                            </Form.Item>

                        </div>
                        <div className="wrapper-column" style={{ width: '40%' }}>
                            <Form.Item<IProviderCreate>
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
                                    className="form-input "
                                    size="middle"
                                    placeholder={"Nhập email nhà cung cấp"}
                                    name={'email'}
                                    id={'email'}
                                // value={provider?.email}
                                />
                            </Form.Item>
                        </div>
                    </Flex>
                    <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
                        <div className="wrapper-column" style={{ width: '40%' }}>
                            <Form.Item<IProviderCreate>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'phone'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thông tin',
                                        whitespace: true
                                    },
                                    // {
                                    //     required: false,
                                    //     pattern: new RegExp("/\S+@\S+\.\S+/"),
                                    //     message: 'Định dạng số điện thoại không đúng',
                                    // },
                                ]}
                            >
                                <Input
                                    className="form-input "
                                    size="middle"
                                    placeholder={"Nhập số điện thoại nhà cung cấp"}
                                    name={'phone'}
                                    id={'phone'}
                                    // value={provider?.phone}
                                    prefix={<PhoneOutlined />}
                                />
                            </Form.Item>

                        </div>
                        <div className="wrapper-column" style={{ width: '40%' }}>
                            <Form.Item<IProviderCreate>
                                {...formItemLayout}
                                name={'website'}
                                labelAlign={"left"}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Website</span>
                                }
                            >
                                <Input
                                    className="form-input "
                                    size="middle"
                                    placeholder={"Nhập website nhà cung cấp"}
                                    name={'website'}
                                    id={'website'}
                                // value={provider?.website}
                                />
                            </Form.Item>
                        </div>
                    </Flex>
                    <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }}>
                        <div className="wrapper-column" style={{ width: '40%' }}>
                            <Form.Item<IProviderCreate>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'address'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Địa chỉ</span>
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
                                    placeholder={"Nhập địa chỉ nhà cung cấp"}
                                    name={'address'}
                                    id={'address'}
                                    // value={provider?.address}
                                    prefix={<EnvironmentOutlined />}
                                />
                            </Form.Item>

                        </div>
                        <div className="wrapper-column" style={{ width: '40%' }}>
                            <Form.Item<IProviderCreate>
                                {...formItemLayout}
                                name={'tax_no'}
                                labelAlign={"left"}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã thuế</span>
                                }
                            >
                                <Input
                                    className="form-input "
                                    size="middle"
                                    placeholder={"Nhập số thuế nhà cung cấp"}
                                    name={'tax_no'}
                                    id={'tax_no'}
                                // value={provider?.tax_no}
                                />
                            </Form.Item>
                        </div>
                    </Flex>
                </Form>
            </Modal>

        </>
    );
};

export default ProviderCreate;