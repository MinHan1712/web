import {
    CloseCircleOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, notification, Select, SelectProps } from "antd";
import { useState } from "react";
import userApi from "../../apis/user.api";
import { activeStatus, formItemLayout } from "../../constants/general.constant";
import { IUserRequestUpdate } from "../../interfaces/userManager";

interface Props {
    open: boolean;
    onCancel: () => void;
    optionRole: SelectProps<string>['options'];
}

const UserCreate = (props: Props) => {
    const [form] = Form.useForm<IUserRequestUpdate>();
    const [loading, setLoading] = useState(false);

    const eventSummitForm = (formValue: IUserRequestUpdate) => {
        createUser(formValue);
    }

    const createUser = async (value: IUserRequestUpdate) => {
        try {
            console.log(`user`, value);
            value = {
                ...value,
                login: value.phone
            }
            return await userApi.create(value).then((response) => {
                console.log(response)
                switch (response.meta.code) {
                    case 200:
                        notification['success']({
                            message: "Thông báo",
                            description: 'Thêm mới nhân viên thành công',
                        });
                        form.resetFields();
                        props.onCancel();
                        break;
                    case 513:
                        notification['error']({
                            message: "Lỗi",
                            description: 'Số điện thoại đã tồn tại, vui lòng nhập SĐT khác',
                        });
                        break;
                    case 517:
                        notification['error']({
                            message: "Lỗi",
                            description: 'Email đã tồn tại, vui lòng nhập email khác',
                        });
                        break;
                    default:
                        notification['error']({
                            message: "Lỗi",
                            description: 'Thêm mới nhân viên không thành công',
                        });
                        break;
                }
            })
                .catch((error) => {
                    notification['error']({
                        message: "Lỗi",
                        description: 'Thêm mới nhân viên không thành công',
                    });
                })
                .finally(() => {
                    setLoading(false);
                })

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
                title="Thêm nhân viên"
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
                        <span>Thêm mới nhân viên</span>
                    </Button>,
                ]}
            >
                <Form
                    name="userCreate"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ width: "100%", padding: '0 10px' }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={eventSummitForm}
                >
                    <Flex gap="middle" justify="space-between" style={{ width: '100%' }}>
                        <Flex gap="middle" vertical justify="flex-start" align="self-start" style={{ width: '50%' }}>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'user_name'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên nhân viên</span>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                                >
                                    <Input
                                        className="form-input d-flex"
                                        size="middle"
                                        placeholder="Nhập tên nhân viên"
                                        prefix={<UserOutlined />}
                                        name='user_name'
                                        id={'user_name'}
                                    />
                                </Form.Item>

                            </div>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    name={'phone'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                                >
                                    <Input
                                        className="form-input d-flex"
                                        size="middle"
                                        placeholder="Nhập số điện thoại nhân viên"
                                        name={'phone'}
                                        id={'phone'}
                                        prefix={<PhoneOutlined />}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    name={'password'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Mật khẩu</span>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                                >
                                    <Input.Password
                                        className="form-input d-flex"
                                        size="middle"
                                        placeholder="Nhập mật khẩu"
                                        prefix={<LockOutlined />}
                                        name={'password'}
                                        id={'password'}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    name={'confirm_pasword'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhập lại mật khẩu</span>
                                    }
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập thông tin!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        className="form-input d-flex"
                                        size="middle"
                                        placeholder="Nhập lại mật khẩu"
                                        prefix={<LockOutlined />}
                                        name={'confirm_pasword'}
                                        id={'confirm_pasword'}
                                    />
                                </Form.Item>
                            </div>

                        </Flex>
                        <Flex gap="middle" vertical justify="flex-start" align="self-start" style={{ width: '50%' }}>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    name={'address'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Địa chỉ</span>
                                    }
                                >
                                    <Input
                                        className="form-input d-flex"
                                        size="middle"
                                        placeholder="Địa chỉ"
                                        name={'address'}
                                        id={'address'}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    name={'email'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Email</span>
                                    }
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'Định dạng email không đúng!',
                                        }
                                    ]}
                                >
                                    <Input
                                        className="form-input d-flex"
                                        size="middle"
                                        placeholder="Nhập email nhân viên"
                                        name={'email'}
                                        id={'email'}
                                        prefix={<MailOutlined />}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'role_id'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Chức vụ</span>
                                    }
                                >
                                    <Select
                                        className="d-flex"
                                        size="middle"
                                        id={'role_id'}
                                        options={[...props.optionRole || []]}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '100%' }}>
                                <Form.Item
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'status'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Trạng thái</span>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                                >
                                    <Select
                                        className="d-flex"
                                        size="middle"
                                        placeholder={"Trạng thái"}
                                        id={'status'}
                                        options={[...activeStatus || []]}
                                    />
                                </Form.Item>
                            </div>
                        </Flex>
                    </Flex>
                </Form>
            </Modal>

        </>
    );
};

export default UserCreate;