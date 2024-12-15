import {
  CheckCircleOutlined, DeleteOutlined, EditOutlined,
  QuestionCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import {
  Button, Col, Form,
  Modal,
  Row,
  Tabs
} from "antd";
import { useEffect, useState } from "react";

import { ICustomerGroupResponse } from "../../interfaces/customerGroup";
import CustomerGroupInfo from "./CustomerGroupInfo";

interface IModalCustomerGroupViewProps {
  openViewDate: boolean;
  onCancel: () => void;
  data: ICustomerGroupResponse;
}

const CustomerGroupView = (props: IModalCustomerGroupViewProps) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin",
      children: <CustomerGroupInfo data={props.data} onCancel={props.onCancel} />,
    },
    {
      key: "2",
      label: "Lịch sử nhập hàng",
      // children: <ModalCustomerGroupWithCustomer
      //   customerGroup={valueCustomerGroup}
      //   roleScreen={roleScreen} />,
    }
  ];

  return (
    <>
      <Modal
        open={props.openViewDate}
        title="Chi tiết nhóm khách hàng"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          props.onCancel();
        }}
        width={"80%"}
        footer={null}
      >
        <div className="ant-modal-content">
          <div className="tab-container-provider">
            <Tabs
              type="card"
              items={items}
              className="h-100"
            />
          </div>
        </div>
      </Modal >
    </>
  );
};

export default CustomerGroupView;
