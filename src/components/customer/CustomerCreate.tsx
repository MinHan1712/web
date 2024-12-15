import { Button, DatePicker, Divider, Flex, Form, Input, Modal, Radio, Select, Space } from "antd";
import {useState } from "react";
import { ICustomerCreate, ICustomerResponse } from '../../interfaces/customer';
import { CityType, CustonerSource, CustonerType, formItemLayout, sexType } from "../../constants/general.constant";
import {
    CloseCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    UserOutlined,
} from "@ant-design/icons";
import customerApi from "../../apis/customer.api";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

interface ICustomerInformationProps {
    open: boolean;
    onCancel: () => void;
}

const CustomerCreate = (props: ICustomerInformationProps) => {
    const [form] = Form.useForm<ICustomerCreate>();
    const [loading, setLoading] = useState(false);

    const eventSummitForm = (formValue: ICustomerCreate) => {
        setLoading(true);
        createCustomer(formValue);
    }

    const createCustomer = async (value: ICustomerCreate) => {
        try {
            value.birthday = dayjs(value.birthday, "YYYY-MM-DD").format("YYYY-MM-DD") || ''
            console.log(`Customer`, value);
            const response = await customerApi.create(value);
            console.log(response);
            form.resetFields();
            props.onCancel();
        } catch (err) {
            console.log(err);
        } finally { setLoading(false); }
    }

    return (
        <>
            <Modal
                open={props.open}
                title="Thêm mới khách hàng"
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
                        <span>Thêm mới</span>
                    </Button>,
                ]}
            >
                <Form
                    name="CustomerCreate"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ width: "100%", padding: '0 10px' }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={eventSummitForm}
                >
                    <Flex justify="space-between" align={'center'} style={{ width: '100%' }}>
                        <Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '90%' }}>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'customer_type'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Loại khách hàng</span>
                                    }
                                >
                                    <Radio.Group
                                        size="middle"
                                        name={'customer_type'}
                                        id={'customer_type'}
                                        options={CustonerType}
                                    />
                                </Form.Item>

                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerResponse>
                                    {...formItemLayout}
                                    name={'customer_name'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên KH</span>
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
                                        placeholder={"Nhập tên khách hàng"}
                                        name={'customer_name'}
                                        id={'customer_name'}
                                        prefix={<UserOutlined />}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerResponse>
                                    {...formItemLayout}
                                    name={'phone'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
                                    }
                                    rules={[
                                        {
                                            pattern: /^[0-9]{10}$/,
                                            message: 'Định dạng số điện thoại không đúng',
                                        }
                                    ]}
                                >
                                    <Input
                                        className="form-input "
                                        size="middle"
                                        placeholder={'Nhập số điện thoại nhà cung cấp'}
                                        prefix={<PhoneOutlined />}
                                        name={'customephoner_name'}
                                        id={'phone'}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'email'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Email</span>
                                    }
                                    rules={[
                                        {
                                            pattern: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,4})+)$/,
                                            message: 'Định dạng email không đúng',
                                        }
                                    ]}
                                >
                                    <Input
                                        className="form-input d-flex"
                                        size="middle"
                                        placeholder={'Nhập email nhà cung cấp'}
                                        prefix={<MailOutlined />}
                                        name={'email'}
                                        id={'email'}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    name={'customer_group_id'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Nhóm KH</span>
                                    }
                                >
                                    <Select
                                        className="d-flex"
                                        style={{ marginBottom: "8px" }}
                                        size="middle"
                                        // options={optionCustomerGroup}
                                        // defaultValue={optionCustomerGroup && optionCustomerGroup.length > 0 ? optionCustomerGroup[0].value : ''}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }} className="d-flex justify-content-center align-content-center">
                                                    <Button className="button" type="text" icon={<PlusOutlined />}  >
                                                        Thêm
                                                    </Button>
                                                </Space>
                                            </>
                                        )}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'birthday'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày sinh</span>
                                    }
                                >
                                    <DatePicker className="form-input d-flex" size="middle" format={"DD/MM/YYYY"} placeholder="Nhập ngày sinh" />
                                </Form.Item>
                            </div>
                        </Flex>
                        <Flex gap="middle" vertical justify="flex-end" align={'center'} style={{ width: '90%' }}>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'sex'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Giới tính</span>
                                    }
                                >
                                    <Radio.Group style={{ marginBottom: "8px", display: "flex", justifyContent: "center" }} options={sexType} />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
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
                                        placeholder={'Nhập địa chỉ nhà cung cấp'}
                                        name={'address'}
                                        id={'address'}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    name={'city'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Khu vực</span>
                                    }
                                >
                                    <Select
                                        className="d-flex"
                                        style={{ marginBottom: "8px" }}
                                        size="middle"
                                        options={CityType}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    name={'source'}
                                    labelAlign={"left"}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Nguồn khách hàng</span>
                                    }
                                >
                                    <Select
                                        className="d-flex"
                                        size="middle"
                                        options={CustonerSource}
                                    />
                                </Form.Item>
                            </div>
                            <div className="wrapper-column" style={{ width: '90%' }}>
                                <Form.Item<ICustomerCreate>
                                    {...formItemLayout}
                                    labelAlign={"left"}
                                    name={'note'}
                                    label={
                                        <span style={{ fontWeight: "550", fontSize: "14px" }}>Ghi chú</span>
                                    }
                                >
                                    <TextArea
                                        rows={3}
                                        className="form-input d-flex"
                                        size="middle"
                                        name={'note'}
                                        id={'note'}
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

export default CustomerCreate;