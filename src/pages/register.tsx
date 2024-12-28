import { useState } from "react";
import { IRegisterStore } from "../interfaces/login";

import { Button, Col, Empty, Flex, Form, Input, notification, Row, Select, SelectProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import { Link, useNavigate } from "react-router-dom";
import '../assets/css/register.css';
import commonApi from "../apis/common.api";
import { CityType, DistrictType, formItemLayout } from "../constants/general.constant";

const Register = () => {

  const [form] = Form.useForm<IRegisterStore>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [messageLogin, setMessageLogin] = useState("");


  const [registerStore, setRegisterStore] = useState<IRegisterStore>({});

  const [optionDistrict, setOptionDistrict] = useState<SelectProps<string>['options']>([])


  const triggerFormEvent = async (register: IRegisterStore) => {
    return await commonApi.registerStore(register)
      .then(response => {
        console.log(response)
        switch (response.meta[0].code) {
          case 200:
            navigate('/dangnhap');
            setLoading(false);
            notification['success']({
              message: "Thông báo",
              description: 'Tạo tài khoản thành công',
            });
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
              description: 'Lỗi khi tạo tài khoản, vui lòng thử lại',
            });
            break;
        }
        setLoading(false);
      })
      .catch((error) => {
        notification['error']({
          message: "Lỗi",
          description: 'Lỗi khi tạo tài khoản, vui lòng thử lại',
        });
        setLoading(false);
      })
  }

  return (
    <>
      <div className="register-background">
        <div className="register-view" style={{ overflow: 'hidden' }}>
          <div className="register-left-bg-store" style={{ backgroundImage: `url(${require("../assets/img/register-img-store.png")})` }}>
          </div>
          <div className="register-form" style={{ marginLeft: '-10px' }}>
            <div className="register-logo">
              <img
                alt="logo medicine"
                src={require("../assets/img/logo-app.af7d24a2.png")}
                className="logo"
              />
              <h3 style={{ marginLeft: '10px' }}>Medicine</h3>
            </div>
            <div className="register-form">
              <Form form={form}
                name="basic"
                onFinish={triggerFormEvent}
                autoComplete="off"
              >
                <Flex gap="middle" vertical justify="flex-start" align={'center'} style={{ width: '100%' }}>
                  <div className="wrapper-column" style={{ width: '90%' }}>
                    <Form.Item
                      name="store_name"
                      rules={[{ required: true, message: 'Nhập tên nhà thuốc' }]}

                      label={
                        <h5 className="text-muted">
                          Tên nhà thuốc
                        </h5>
                      }
                    >
                      <Input
                        className="form-control"
                        type="text"
                        id="store_name"
                        placeholder="Tên nhà thuốc"
                        name="store_name" />
                    </Form.Item>
                  </div>
                  <div className="wrapper-column" style={{ width: '90%' }}>
                    <Form.Item
                      className="floating-label form-address form-floating"
                      name="city"
                      rules={[{ required: true, message: 'Nhập địa chỉ' }]}

                      label={
                        <h5 className="text-muted">
                          Địa chỉ
                        </h5>
                      }
                    >
                      <Select
                        className="form-control-address form-control"
                        options={CityType}
                        id="city"
                        placeholder="Địa chỉ"
                        onChange={(e: any) => {
                          setOptionDistrict(DistrictType.find(x => x.value == e)?.content || []);
                        }} />
                    </Form.Item>
                  </div>
                  <div className="wrapper-column" style={{ width: '90%' }}>
                    <Form.Item
                      className="floating-label form-address form-floating"
                      name="district"
                      rules={[{ required: true, message: 'Nhập Quận huyện' }]}

                      label={
                        <h5 className="text-muted">
                          Quận/Huyện
                        </h5>
                      }
                    >
                      <Select
                        className="form-control-address form-control"
                        options={optionDistrict}
                        placeholder="Quận/Huyện"
                        id="district"
                        notFoundContent={optionDistrict ? <Empty description="Không có dữ liệu" /> : null}
                      />
                    </Form.Item>
                  </div>
                  <div className="wrapper-column" style={{ width: '90%' }}>
                    <Form.Item className="floating-label form-password form-floating"
                      name="phone"
                      rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                      label={
                        <h5 className="text-muted">
                          Số điện thoại
                        </h5>
                      }
                    >
                      <Input
                        placeholder="Số điện thoại"
                        type="phone-number"
                        className="form-control"
                        id="phone"
                        name="phone" />
                    </Form.Item>
                  </div>
                  <div className="wrapper-column" style={{ width: '90%' }}>
                    <Form.Item
                      className="floating-label form-email form-floating"
                      name="email"
                      rules={[{ required: true, message: 'Nhập email' }]}
                      label={
                        <h5 className="text-muted">
                          Email
                        </h5>
                      }
                    >
                      <Input
                        placeholder="Email"
                        type="text"
                        className="form-control"
                        id="email"
                        name="email" />
                    </Form.Item>
                  </div>
                  <div className="wrapper-column" style={{ width: '90%' }}>
                    <Form.Item
                      className="floating-label form-password form-floating"
                      name="password"
                      rules={[{ required: true, message: 'Nhập password' }]}

                      label={
                        <h5 className="text-muted">
                          Mật khẩu
                        </h5>
                      }
                    >
                      <Input
                        autoComplete="new-password"
                        placeholder="Mật khẩu"
                        type="password"
                        className="form-control"
                        id="password"
                        name="password" />
                    </Form.Item>
                  </div>
                  <div className="wrapper-column" style={{ width: '90%' }}>

                    <Button type="primary" className="ant-btn button-register" style={{ width: '100%' }} ant-click-animating-without-extra-node="false"
                      onClick={form.submit} loading={loading}>
                      <span>Đăng ký</span>
                    </Button>

                  </div>
                  <div className="textRegister" style={{ textAlign: 'center' }}>
                    Bạn đã là thành viên?
                    <Link className="txtLinkRegister" to={'/dangnhap'} >
                      Đăng nhập?
                    </Link>{" "}
                  </div>
                </Flex>
              </Form>

            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Register;
