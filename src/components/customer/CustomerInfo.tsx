
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, MailOutlined, PhoneOutlined, SyncOutlined, UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, notification, Popconfirm, Radio, Select, SelectProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CustomerApi from "../../apis/customer.api";
import '../../assets/css/style.css';
import { CityType, CustonerSource, CustonerType, formItemLayout, sexType } from "../../constants/general.constant";
import { ICustomerCreate, ICustomerResponse, ICustomerUpdate } from "../../interfaces/customer";


interface ICustomerInformationProps {
    data: ICustomerResponse,
    onCancel: () => void;
    optionsCusGroup: SelectProps<string>['options'];
}

const CustomerInfo = (props: ICustomerInformationProps) => {
    const [form] = Form.useForm<ICustomerResponse>();
    const [isSummitForm, setIsSummitForm] = useState(false);
    const [btnEdit, setBtnEdit] = useState(false);
    const [action, setAction] = useState(false);
    const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
    const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);


    useEffect(() => {
        handleCloseModalView();
        form.setFieldsValue({ ...props.data });
        form.setFieldValue("birthday", props.data.birthday ? dayjs(props.data.birthday) || null : null)
    }, [props.data]);


    useEffect(() => {
        console.log("vao")
        if (isSummitForm) form.submit();
    }, [isSummitForm]);



    const updateCustomer = async (value: ICustomerResponse) => {
        try {
            let CustomerUpdate: ICustomerUpdate = {
                customer_id: props.data.customer_id,
                city: props.data.city,
                customer_group_id: value.customer_group_id,
                customer_name: value.customer_name,
                customer_type: value.customer_type,
                address: value.address,
                email: value.email,
                birthday: value.birthday ? dayjs(value.birthday, "YYYY-MM-DD").format("YYYY-MM-DD") || '' : '',
                sex: value.sex,
                phone: value.phone,
                source: value.source,
                note: value.note,
                status: action ? props.data.status : false
            };
            console.log("CustomerUpdate", CustomerUpdate);

            await CustomerApi.update(CustomerUpdate).then((response) => {
                console.log(response)
                switch (response.meta.code) {
                    case 200:
                        notification['success']({
                            message: "Thông báo",
                            description: 'Cập nhập khách hàng thành công',
                        });
                        handleCloseModalView();
                        props.onCancel();
                        break;
                    default:
                        notification['error']({
                            message: "Lỗi",
                            description: 'Cập nhập khách hàng không thành công',
                        });
                        break;
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
        } finally {
            setConfirmLoadingDelete(false);
            setConfirmLoadingUpdate(false);
        }
    }

    const handleActiondDelete = () => {
        try {
            setConfirmLoadingDelete(true);
            setAction(false);
            console.log(isSummitForm);
            setIsSummitForm(!isSummitForm);
        } catch {
            notification['error']({
                message: "Thông báo",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
        }
    };

    const handleCloseModalView = () => {
        form.resetFields();
        setConfirmLoadingDelete(false);
        setConfirmLoadingUpdate(false);
        setBtnEdit(false);
        setAction(true);
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
                onFinish={updateCustomer}
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
                                    disabled={!btnEdit}
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
                                    disabled={!btnEdit}
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
                                    disabled={!btnEdit}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'email'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Email</span>
                                }
                                rules={[
                                    {
                                        type: 'email',
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
                                    disabled={!btnEdit}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
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
                                    disabled={!btnEdit}
                                    options={props.optionsCusGroup}
                                    // defaultValue={optionCustomerGroup && optionCustomerGroup.length > 0 ? optionCustomerGroup[0].value : ''}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            {/* TODO <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }} className="d-flex justify-content-center align-content-center">
                                                <Button className="button" type="text" icon={<PlusOutlined />}  >
                                                    Thêm
                                                </Button>
                                            </Space> */}
                                        </>
                                    )}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'birthday'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày sinh</span>
                                }
                            >
                                <DatePicker
                                    className="form-input d-flex"
                                    size="middle"
                                    format={"DD/MM/YYYY"}
                                    placeholder="Nhập ngày sinh"
                                    disabled={!btnEdit}
                                />

                            </Form.Item>
                        </div>
                    </Flex>
                    <Flex gap="middle" vertical justify="flex-end" align={'center'} style={{ width: '90%' }}>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
                                {...formItemLayout}
                                labelAlign={"left"}
                                name={'sex'}
                                label={
                                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Giới tính</span>
                                }
                            >
                                <Radio.Group
                                    size="middle"
                                    name={'sex'}
                                    id={'sex'}
                                    options={sexType}
                                    disabled={!btnEdit}
                                />


                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
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
                                    disabled={!btnEdit}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
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
                                    disabled={!btnEdit}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
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
                                    disabled={!btnEdit}
                                />
                            </Form.Item>
                        </div>
                        <div className="wrapper-column" style={{ width: '90%' }}>
                            <Form.Item<ICustomerResponse>
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
                        onConfirm={handleActiondDelete}
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
                                setIsSummitForm(!isSummitForm);
                                setAction(true);
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

export default CustomerInfo;