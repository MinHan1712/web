import { EditOutlined, QuestionCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import storeApi from "../apis/store.api";
import { formItemLayout } from "../constants/general.constant";
import { IStoreCreate, IStoreResponse } from "../interfaces/store";


const Store = () => {
  const [form] = Form.useForm<IStoreResponse>();
  const { confirm } = Modal;
  const [btnEdit, setBtnEdit] = useState(false);

  const [store, setStore] = useState<IStoreResponse | null>(null);


  const updateStore = (value: IStoreCreate) => {
    return storeApi.update(value)
      .then((response) => {
        // switch (response.meta[0].code) {
        //   case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Cập nhập thông tin cửa hàng thành công',
        });
        getStore();
        setBtnEdit(false);
        //     break;
        //   case 513:
        //     notification['error']({
        //       message: "Lỗi",
        //       description: 'Số điện thoại đã tồn tại, vui lòng nhập SĐT khác',
        //     });
        //     break;
        //   case 517:
        //     notification['error']({
        //       message: "Lỗi",
        //       description: 'Email đã tồn tại, vui lòng nhập email khác',
        //     });
        //     break;
        //   default:
        //     notification['error']({
        //       message: "Lỗi",
        //       description: 'Cập nhập thông tin cửa hàng không thành công',
        //     });
        //     break;
        // }
      })
      .catch((error) => {
        notification['error']({
          message: "Lỗi",
          description: 'Cập nhập thông tin cửa hàng không thành công',
        });
      }).finally(() => {

      });
  }

  const getStore = () => {
    return storeApi.get()
      .then((response) => {
        // if (response.meta[0].code === 200) {
        // form.setFieldsValue({ ...response.data });
        setStore(response);
        console.log(response);

        // } else {
        //   notification['error']({
        //     message: "Lỗi",
        //     description: 'Không tìm thấy thông tin cửa hàng. Vui lòng thử lại',
        //   });
        // }
      })
      .catch(() => {
        notification['error']({
          message: "Lỗi",
          description: 'Không tìm thấy thông tin cửa hàng. Vui lòng thử lại',
        });
      })
  }

  const onClickConfirmUpdateStore = (value: IStoreCreate): any => {
    confirm({
      title: 'Bạn muốn cập nhật thông tin nhà thuốc?',
      icon: <QuestionCircleOutlined />,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          console.log(value);
          // Gọi updateStore và truyền resolve() vào đây
          updateStore(value)
            .then(() => {
              resolve(); // Resolve promise khi update thành công
            })
            .catch(() => {
              notification['error']({
                message: "Lỗi",
                description: 'Cập nhật thông tin cửa hàng không thành công',
              });
              resolve(); // Resolve promise để đóng modal ngay cả khi có lỗi
            });
        });
      },
      onCancel() { },
    });

  }

  useEffect(() => {
    getStore();
  }, []);

  useEffect(() => {
    if (store && Object.keys(store).length > 0) {
      console.log("Setting form values with:", store); // Debugging
      form.setFieldsValue({
        store_id: store.store_id,
        store_name: store.store_name,
        email: store.email,
        phone: store.phone,
        address: store.address,
        city: store.city,
        district: store.district,
        tax_no: store.tax_no,
      });
    }
  }, [store, form]); // Form 

  return (
    <>
      <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%', paddingBottom: '30px' }}>
        <h3 className="title">Thông tin cửa hàng</h3>
      </Flex>

      <div className="table-wrapper">
        <Form
          name="StoreView"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%", padding: '0 10px' }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onClickConfirmUpdateStore}
        >
          <Flex justify="flex-start" align={'center'} style={{ width: '50%' }}>
            <Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '90%' }}>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'store_id'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã nhà thuốc</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={'Nhập mã nhà thuốc'}
                    name={'store_id'}
                    id={'store_id'}
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
                  {...formItemLayout}
                  name={'store_name'}
                  labelAlign={"left"}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên nhà thuốc</span>
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
                    className="form-input d-flex"
                    size="middle"
                    placeholder={'Nhập tên nhà thuốc'}
                    name={'store_name'}
                    id={'store_name'}
                    value={store?.store_name}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'note'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Email</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={'Nhập email'}
                    name={'email'}
                    id={'email'}
                    // value={store?.email}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'phone'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={'Nhập số điện thoại'}
                    name={'phone'}
                    id={'phone'}
                    // value={store?.phone}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
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
                    placeholder={'Nhập địa chỉ nhà thuốc'}
                    name={'address'}
                    id={'address'}
                    // value={store?.address}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'city'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Tỉnh thành phố</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder='Nhập tên / tỉnh thành phố'
                    name={'city'}
                    id={'city'}
                    // value={store?.city}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'district'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Quận</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder='Nhập tên quận'
                    name={'district'}
                    id={'district'}
                    // value={store?.district}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '90%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'tax_no'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã số thuế</span>
                  }
                >
                  <Input
                    className="form-input d-flex"
                    size="middle"
                    placeholder={"Nhập mã số thuế"}
                    name={'tax_no'}
                    id={'tax_no'}
                    disabled={!btnEdit}
                  />
                </Form.Item>
              </div>
            </Flex>
          </Flex>
        </Form>
        <Flex gap="middle" justify="space-between" align={'center'} style={{ borderTop: '1px solid #e2e3e5', paddingTop: '10px' }}>
          <Flex>
            <Button
              className="button btn-add"
              type="primary"
              onClick={() => {
                setBtnEdit(!btnEdit);
                if (btnEdit) {
                  form.submit();
                }
              }}
            >
              {btnEdit ? <SyncOutlined /> : <EditOutlined />}
              <span>{btnEdit ? "Cập nhập" : "Sửa"}</span>
            </Button>
          </Flex>
        </Flex>
      </div>
    </>
  )
}

export default Store;