import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input } from "antd";
import { formItemLayout } from "../../constants/general.constant";
import { useEffect, useState } from "react";
import { IProviderPageRequest } from "../../interfaces/provider";
import { YYYY_MM_DD, YYYY_MM_DDTHH_mm_ss } from "../../constants/datetime.constant";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface mapProviderFormSearchToProps {
  providerReq: IProviderPageRequest,
  triggerFormEvent: (formValue: any) => void,
}

const ProviderSearch = (props: mapProviderFormSearchToProps) => {
  const [form] = Form.useForm<IProviderPageRequest>();


  useEffect(() => {
    form.setFieldsValue({ ...props.providerReq });
  }, [props.providerReq]);

  const eventSummitForm = (formValue: IProviderPageRequest) => {
    props.triggerFormEvent(formValue);
  }

  const providerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

  }
  return (
    <>
      <div style={providerStyleContent}>
        <Form form={form} name="provider_filter" className="common-form wrapper-form"
          style={{ width: '100%' }}
          onFinish={eventSummitForm}>
          <Flex gap="middle" justify="space-between" align={'center'}
            style={{ width: '100%', padding: '5px' }}>
            <div style={{ width: '40%' }}>
              <Form.Item
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
                  placeholder={"Mã/Tên NCC"}
                  name={'provider_name'}
                  id={'provider_name'}
                  value={props.providerReq.provider_name}
                />
              </Form.Item>

            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                name={'date_search'}
                labelAlign={"left"}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Thời gian</span>
                }
              >
                <RangePicker format={"DD/MM/YYYY"} size="middle" style={{ width: '100%' }}
                // value={}
                //   onChange={(dates) => {
                //     setProviderSearch({
                //       ...providerSearch,
                //       date_to: dates && dates[0] && dayjs(dates[0], YYYY_MM_DD).format(YYYY_MM_DD) || '',
                //       date_from: dates && dates[1] && dayjs(dates[1], YYYY_MM_DDTHH_mm_ss).format(YYYY_MM_DDTHH_mm_ss) || ''
                //     });
                //   }} 
                />
              </Form.Item>
            </div>
          </Flex>
        </Form>
        <Flex gap="middle" justify="flex-end" align={'center'} style={{ width: '100%', paddingBottom: '10px' }}>
          <Button
            className="button btn-add"
            type="primary" onClick={() => {
              form.submit();
            }}>
            <SearchOutlined style={{ verticalAlign: "baseline" }} />
            <span>Tìm kiếm</span>
          </Button>
        </Flex>
      </div>
    </>
  );
};

export default ProviderSearch;