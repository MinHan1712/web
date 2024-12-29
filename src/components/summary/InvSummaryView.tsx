import type { TabsProps } from "antd";
import { Modal, Tabs } from "antd";
import '../../assets/css/style.css';
import { IProperty } from "../../interfaces/property";
import { IDrugInvSummaryResponse } from "../../interfaces/summaryInvoice";
import InvSummaryExport from "./InvSummaryExport";
import InvSummaryImport from "./InvSummaryImport";
import InvSummaryInfo from "./InvSummaryInfo";

interface IModalProviderViewProps {
  open: boolean;
  onCancel: () => void;
  data: IDrugInvSummaryResponse;
  importTypes: IProperty[];
  payMenthods: IProperty[];
}

const InvoiceSummaryView = (props: IModalProviderViewProps) => {

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Chi tiết thuốc kiểm kho",
      children: <InvSummaryInfo data={props.data} />,
    },
    {
      key: "2",
      label: "Tham chiếu xuất kho",
      children: <InvSummaryExport data={props.data} />,
    },
    {
      key: "3",
      label: "Tham chiếu nhập kho",
      children: <InvSummaryImport data={props.data} payMenthods={props.payMenthods} importTypes={props.importTypes} />,
    },
  ];


  return (
    <>
      <Modal
        open={props.open}
        title="Chi tiết phiếu kiểm kho"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          props.onCancel();

        }}
        width={"70%"}
        footer={null}
      >

        <Tabs
          type="card"
          items={items}
          className="h-100"
        />

      </Modal >
    </>
  );
};

export default InvoiceSummaryView;
