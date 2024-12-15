import type { TabsProps } from "antd";
import { Modal, Tabs } from "antd";
import { ICustomerResponse } from "../../interfaces/customer";
import '../../assets/css/style.css';
import CustomerInfo from "./CustomerInfo";


interface IModalCustomerViewProps {
  openViewDate: boolean;
  onCancel: () => void;
  data: ICustomerResponse;
}

const CustomerView = (props: IModalCustomerViewProps) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin",
      children: <CustomerInfo data={props.data} onCancel={props.onCancel}/>,
    },
    {
      key: "2",
      label: "Lịch sử nhập hàng",
      // children: <ModalCustomerHistoryInvoiceProduct Customer={valueCustomer} roleScreen={roleScreen} />,
    },
    {
      key: "3",
      label: "Lịch sử sản phẩm",
      // children: <ModalCustomerHistoryProduct Customer={valueCustomer} />,
    },
  ];

  return (
    <>
      <Modal
        open={props.openViewDate}
        title="Chi tiết khách hàng"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          props.onCancel();

        }}
        width={"70%"}
        footer={null}
      >
        <div className="ant-modal-content">
          <div className="tab-container-Customer">
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

export default CustomerView;
