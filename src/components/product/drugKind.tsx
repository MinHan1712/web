import {
  Button, Col, Flex, Form,
  Input,
  Modal, notification, Row
} from "antd";
import { useEffect, useState } from "react";

import "../../assets/css/page.css";
import "../../assets/css/supplier.css";
import { IDrugKindCreateRequest, IDrugKindResponse, IDrugKindUpdateRequest } from "../../interfaces/drugKind";
import drgKindApi from "../../apis/drugKind.api";
import { formItemLayout } from "../../constants/general.constant";
import { reloadDrgKind } from "../../utils/local";




interface IModalDrugKindProps {
  open: boolean;
  onCancel: () => void;
  isSettingButton: boolean;
  data?: IDrugKindResponse;
}

const DrugKind = (props: IModalDrugKindProps) => {


  const [form] = Form.useForm<IDrugKindResponse>();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(0);

  useEffect(() => {
    form.setFieldsValue({ ...props.data });
    console.log(form.getFieldValue("code"), form.getFieldValue("name"));
  }, [props.data]);

  const handleCancel = () => {
    form.resetFields();
    props.onCancel();
  }

  const handleAction = (value: IDrugKindResponse) => {
    switch (action) {
      case 1: //create
        createDrugKindToApi(value);
        return;
      case 2: //update
        console.log(value);
        value = {
          ...value,
          drug_kind_id: props.data?.drug_kind_id
        }
        updateDrugKindToApi(value);
        return;
      case 3: //delete
        removeDrugKindToApi(props.data?.drug_kind_id || '');
        return;
      default:
        handleCancel();
        return;
    }

  }

  const createDrugKindToApi = (drgKindRequest: IDrugKindCreateRequest) => {
    try {
      setLoading(true);
      drgKindApi.create(drgKindRequest).then((response) => {
        // switch (response.meta[0].code) {
        //     case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Thêm ngành hàng mới thành công',
        });
        reloadDrgKind();
        form.resetFields();
        handleCancel();
        // break;
        //     default:
        //         notification['error']({
        //             message: "Lỗi",
        //             description: 'Thêm ngành hàng mới không thành công',
        //         });
        //         break;
        // }
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

  const removeDrugKindToApi = (drg_kind_id: string) => {
    setLoading(true);
    try {
      setLoading(true);
      drgKindApi.delete(drg_kind_id).then((response) => {
        // switch (response.meta[0].code) {
        //     case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Xoá ngành hàng mới thành công',
        });
        reloadDrgKind();
        form.resetFields();
        handleCancel();
        // break;
        //     default:
        //         notification['error']({
        //             message: "Lỗi",
        //             description: 'Xoá ngành hàng mới không thành công',
        //         });
        //         break;
        // }
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

  const updateDrugKindToApi = (drgKindUpdate: IDrugKindUpdateRequest) => {
    setLoading(true);
    try {
      setLoading(true);
      drgKindApi.update(drgKindUpdate).then((response) => {
        // switch (response.meta[0].code) {
        //     case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Cập nhập ngành hàng mới thành công',
        });
        reloadDrgKind();
        form.resetFields();
        handleCancel();
        // break;
        //     default:
        //         notification['error']({
        //             message: "Lỗi",
        //             description: 'Cập nhập ngành hàng mới không thành công',
        //         });
        //         break;
        // }
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
        title="Thêm mới ngành hàng"
        className="modal-drug-kind"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => { handleCancel() }}
        width={"30%"}
        footer={[
          <Button
            className={`button d-flex ${props.isSettingButton ? 'btn-cancel' : 'btn-delete'}`}
            type="primary"
            onClick={() => {
              setAction(props.isSettingButton ? 0 : 3);
              form.submit();
            }}
          >
            <span>{props.isSettingButton ? "Bỏ qua" : "Hủy"}</span>
          </Button>,
          <Button
            className="button btn-add d-block"
            type="primary"
            loading={loading}
            onClick={() => {
              setAction(props.isSettingButton ? 1 : 2);
              form.submit();
            }}
          >
            <span>{props.isSettingButton ? "Đồng ý" : "Cập nhập"}</span>
          </Button>,
        ]}
      >
        <Form
          name="drgKindInformation"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%", padding: '0 10px' }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={handleAction}
        >
          <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%', paddingTop: '10px' }}>
            <div className="wrapper-column" style={{ width: '100%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'code'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã nhóm</span>
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
                  placeholder={"Nhập mã ngành hàng"}
                  name={'code'}
                  id={'code'}
                  disabled={!props.isSettingButton}
                />
              </Form.Item>

            </div>
            <div className="wrapper-column" style={{ width: '100%' }}>
              <Form.Item
                {...formItemLayout}
                name={'name'}
                labelAlign={"left"}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên loại</span>
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
                  placeholder={"Nhập tên ngành hàng"}
                  name={'name'}
                  id={'name'}
                />
              </Form.Item>
            </div>
          </Flex>
        </Form>
      </Modal >
    </>
  );
};

export default DrugKind;
