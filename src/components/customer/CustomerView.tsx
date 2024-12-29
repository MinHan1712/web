import type { SelectProps, TabsProps } from "antd";
import { Modal, Tabs } from "antd";
import { ICustomerResponse } from "../../interfaces/customer";
import '../../assets/css/style.css';
import CustomerInfo from "./CustomerInfo";


interface IModalCustomerViewProps {
  openViewDate: boolean;
  onCancel: () => void;
  data: ICustomerResponse;
  optionsCusGroup: SelectProps<string>['options'];
}

const CustomerView = (props: IModalCustomerViewProps) => {
  // const items: TabsProps["items"] = [
  //   {
  //     key: "1",
  //     label: "Thông tin",
  //     children: <CustomerInfo data={props.data} onCancel={props.onCancel} optionsCusGroup={props.optionsCusGroup} />,
  //   },
  // {
  //   key: "2",
  //   label: "Lịch sử nhập hàng",
  //   // children: <ModalCustomerHistoryInvoiceProduct Customer={valueCustomer} roleScreen={roleScreen} />,
  // },
  // {
  //   key: "3",
  //   label: "Lịch sử sản phẩm",
  //   // children: <ModalCustomerHistoryProduct Customer={valueCustomer} />,
  // },
  // ];

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

        {/* <Tabs
              type="card"
              items={items}
              className="h-100"
            /> */}
        <CustomerInfo data={props.data} onCancel={props.onCancel} optionsCusGroup={props.optionsCusGroup} />

      </Modal >
    </>
  );
};

export default CustomerView;
