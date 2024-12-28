import type { TabsProps } from "antd";
import { Modal, Tabs } from "antd";
import '../../assets/css/style.css';
import { IProviderResponse } from "../../interfaces/provider";
import ProviderInfo from "./ProviderInfo";

interface IModalProviderViewProps {
  openViewDate: boolean;
  onCancel: () => void;
  data: IProviderResponse;
}

const ProviderView = (props: IModalProviderViewProps) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin",
      children: <ProviderInfo data={props.data} onCancel={props.onCancel}/>,
    },
    // {
    //   key: "2",
    //   label: "Lịch sử nhập hàng",
    //   // children: <ModalProviderHistoryInvoiceProduct provider={valueProvider} roleScreen={roleScreen} />,
    // },
    // {
    //   key: "3",
    //   label: "Lịch sử sản phẩm",
    //   // children: <ModalProviderHistoryProduct provider={valueProvider} />,
    // },
  ];

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
        <div className="ant-modal-content">
          {/* <div className="tab-container-provider"> */}
            <Tabs
              type="card"
              items={items}
              className="h-100"
            />
          {/* </div> */}
        </div>
      </Modal >
    </>
  );
};

export default ProviderView;
