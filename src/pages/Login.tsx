import { EyeInvisibleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/login.css';
import { ILoginRequest } from '../interfaces/login';
import commonApi from '../apis/common.api';
import { setAuth } from '../utils/local';

interface ILogin {
  resetLogin?: () => void
}
const Login = (prop: ILogin) => {
  const [form] = Form.useForm<ILoginRequest>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // const loginToApi = async (login: ILoginRequest) => {
  //   return await commonApi.login(login)
  //     .then(response => {
  //       if (response.meta[0].code === 200) {
  //         setAuth(response.data)
  //         navigate('/sanpham/danhmuc', {
  //           state: {
  //             token: response.data.token
  //           }
  //         });
  //         setLoading(false);
  //         return;
  //       }

  //       notification['error']({
  //         message: "Lỗi",
  //         description: 'Sai mật khẩu hoặc tên đăng nhập',
  //       });

  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       notification['error']({
  //         message: "Lỗi",
  //         description: 'Sai mật khẩu hoặc tên đăng nhập',
  //       });
  //       setLoading(false);
  //     });
  // }

  const triggerFormEvent = async (login: ILoginRequest) => {
    return await commonApi.login(login)
      .then(response => {
        console.log(response);
        // if (response.meta[0].code === 200) {
          setAuth(response)
          navigate('/sanpham', {
            state: {
              token: response.token
            }
          });
          setLoading(false);
          return;
      //   }

      //   notification['error']({
      //     message: "Lỗi",
      //     description: 'Sai mật khẩu hoặc tên đăng nhập',
      //   });

      //   setLoading(false);
      })
      .catch(() => {
        notification['error']({
          message: "Lỗi",
          description: 'Sai mật khẩu hoặc tên đăng nhập',
        });
        setLoading(false);
      });
  }

  return (
    <>
      <div className="login-info">
        <div className="login-form-container">
          <Form form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            className='ant-form ant-form-horizontal login-form'
            // initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={triggerFormEvent}
          >
            <div className="login-logo">
              <img
                alt="logo medicine"
                src={require('../assets/img/logo-app.af7d24a2.png')}
                className="logo"
              />
              <h3>Medicine</h3>
            </div>
            <Form.Item
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
              name="login"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              style={{ height: 50 }}
            >
              <Input prefix={<UserOutlined />}
                className="ant-input d-flex w-100 mb-0"
                placeholder="Nhập email hoặc số điện thoại"
                type="text"
                id="login"
                name="login" />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              style={{ height: 50 }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                suffix={<EyeInvisibleOutlined />}
                autoComplete="off"
                type="password"
                placeholder="Nhập mật khẩu"
                formAction="click"
                id="password"
                className="ant-input mb-0" />
            </Form.Item>

            <Form.Item
              name="rememberMe"
              valuePropName="checked"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}>
              <div className='d-flex align-items-center justify-content-between '>
                <Checkbox
                  id="rememberMe"
                  name='rememberMe'
                  type="checkbox"
                  className="ant-checkbox-input"
                  defaultChecked={false}>Lưu mật khẩu</Checkbox>
                <a className="login-form-forgot" href="/quen-mat-khau">
                  Quên mật khẩu?
                </a>
              </div>
            </Form.Item>
            <Form.Item
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
            >
              <Button
                className="button btn-add d-flex flex-row justify-content-center align-content-center login-form-button ant-btn-primary"
                loading={loading}
                onClick={() => form.submit()}
              >
                <span>Đăng nhập</span>
              </Button>
              <div className="textRegister">
                <Link className="txtLinkRegister" to={'/dangky'} >
                  Đăng ký?
                </Link>{" "}
                nếu bạn chưa có tài khoản!
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;