import { CheckCircleOutlined, DeleteOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, notification, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import providerApi from "../../apis/provider.api";
import '../../assets/css/style.css';
import { formItemLayout } from "../../constants/general.constant";
import { IProviderResponse, IProviderUpdate } from "../../interfaces/provider";


interface IModalProviderViewProps {
  openViewDate: boolean;
  onCancel: () => void;
  data: IProviderResponse;
}

const ProviderView = (props: IModalProviderViewProps) => {
  // const items: TabsProps["items"] = [
  //   {
  //     key: "1",
  //     label: "Thông tin",
  //     children: <ProviderInfo data={props.data} onCancel={props.onCancel}/>,
  //   },
  //   // {
  //   //   key: "2",
  //   //   label: "Lịch sử nhập hàng",
  //   //   // children: <ModalProviderHistoryInvoiceProduct provider={valueProvider} roleScreen={roleScreen} />,
  //   // },
  //   // {
  //   //   key: "3",
  //   //   label: "Lịch sử sản phẩm",
  //   //   // children: <ModalProviderHistoryProduct provider={valueProvider} />,
  //   // },
  // ];
  const [form] = Form.useForm<IProviderResponse>();
  // const [isSummitForm, setIsSummitForm] = useState(false);
  const [btnEdit, setBtnEdit] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);


  useEffect(() => {
    form.setFieldsValue({ ...props.data });
  }, [props.data]);


  // useEffect(() => {
  //   if (isSummitForm) form.submit();
  // }, [isSummitForm]);



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
        status: props.data.status,
        email: value.email
      };

      await providerApi.update(providerUpdate).then((response) => {
        switch (response.meta.code) {
          case 200:
            notification['success']({
              message: "Thông báo",
              description: 'Cập nhập nhà cung cấp thành công',
            });
            handleCloseModalView();
            props.onCancel();
            break;
          default:
            notification['error']({
              message: "Lỗi",
              description: 'Cập nhập nhà cung cấp không thành công',
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
    } finally { setConfirmLoadingUpdate(false); }
  }

  const deleteProvider = async () => {
    return providerApi.delete(props.data.provider_id)
      .then((response) => {
        switch (response.meta.code) {
          case 200:
            notification['success']({
              message: "Thông báo",
              description: 'Xóa nhà cung cấp thành công',
            });
            handleCloseModalView();
            props.onCancel();
            break;
          default:
            notification['error']({
              message: "Lỗi",
              description: 'Xóa nhà cung cấp không thành công',
            });
            break;
        }
      })
      .catch(() => {
        notification['error']({
          message: "Lỗi",
          description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
        });
      }).finally(() => {

      })
  }

  const handleCloseModalView = () => {
    form.resetFields();
    setConfirmLoadingDelete(false);
    setConfirmLoadingUpdate(false);
    setBtnEdit(false);
  };

  return (
    <>
      <Modal
        open={props.openViewDate}
        title="Chi tiết nhà cung cấp"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          props.onCancel();

        }}
        width={"70%"}
        footer={null}
      >
        {/* <div className="ant-modal-content">
          
            <Tabs
              type="card"
              items={items}
              className="h-100"
            />
          
        </div> */}
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
              rules={[
                  {
                      required: false,
                      pattern: /^[0-9]{10}$/,
                      message:'Định dạng số điện thoại không đúng',
                  },
                ]}
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
              onConfirm={deleteProvider}
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
                  // setIsSummitForm(!isSummitForm);
                  form.submit();
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
      </Modal >
    </>
  );
};

export default ProviderView;
