import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Pagination, Select, SelectProps } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns/format";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceSummaryApi from "../apis/summary.api";
import '../assets/css/style.css';
import { selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IInventoryImportPageRequest } from "../interfaces/inventoryImport";
import { IProperty } from "../interfaces/property";
import { IDrugInvSummaryPageRequest, IDrugInvSummaryResponse } from "../interfaces/summaryInvoice";
import routes from "../router";
import InvSummarySearch from "../components/summary/InvSummarySearch";
import InvSummaryView from "../components/summary/InvSummaryView";


const InvoiceSummary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [openViewDate, setOpenviewDate] = useState(false);
  const [dataItem, setDataItem] = useState({ summary_id: '0' });
  const [isReload, setIsReload] = useState(false);
  const [user, setUser] = useState<SelectProps<string>['options']>([]);
  const [importType, setImportType] = useState<SelectProps<string>['options']>([]);

  const [listImportType, setListImportType] = useState<IProperty[]>([]);

  const [listPayMenthods, setListPayMenthods] = useState<IProperty[]>([]);
  const navigate = useNavigate();

  let stt: number = 1;
  const columns: ColumnsType<IDrugInvSummaryResponse> = [
    {
      title: "Mã kiểm kho",
      dataIndex: "summary_id",
      key: "summary_id",
      width: "15%",
      align: 'left',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Số thuốc đã kiểm",
      dataIndex: "total_product",
      key: "total_product",
      width: "15%",
      align: 'left',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Ngày kiểm kho",
      dataIndex: "check_date",
      key: "check_date",
      width: "15%",
      align: "center" as AlignType,
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text ? format(new Date(text), 'hh:ss dd-MM-yyy') : ''}</span>
        </div>
      ),
    },
    {
      title: "Ngày tạo phiếu",
      dataIndex: "created_date",
      key: "created_date",
      width: "15%",
      align: "left" as AlignType,
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text ? format(new Date(text), 'hh:ss dd-MM-yyy') : ''}</span>
        </div>
      ),
    },
    {
      title: "Người kiểm",
      dataIndex: "check_user",
      key: "check_user",
      width: "15%",
      align: "center" as AlignType,
      render: (text) => {
        // var user = listUser.find(x => x.user_id == text); TODO
        return (
          <div className="style-text-limit-number-line2">
            <span>{text}</span>
          </div>
        )
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: "25%",
      align: "left" as AlignType,
      render: (text) => (

        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    }
  ];

  const [invSummaryRes, setInvSummaryRes] = useState<IPageResponse<IDrugInvSummaryResponse[]>>({
    page: 1,
    size: 20,
    totalElements: 0,
    data: []
  });

  const [invSummaryReq, setInvSummaryReq] = useState<IDrugInvSummaryPageRequest>({
    page: 1,
    size: 20
  });

  const getListInvSummary = async () => {
    setLoading(true);
    try {
      const response = await invoiceSummaryApi.getList(invSummaryReq);
      console.log(response)

      // if (response.meta[0].code !== API_STATUS.SUCCESS) {
      // 	//error
      // 	return;
      // }

      setInvSummaryRes(response);
    } catch (err) {
      console.log(err);
    } finally { setLoading(false); }
  }

  const triggerFormEvent = (value: IInventoryImportPageRequest) => {
    setInvSummaryReq({
      ...value,
      page: invSummaryReq.page,
      size: invSummaryReq.size,
    });

    console.log(invSummaryReq);

    // get list provider
  }

  let locale = {
    emptyText: (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
    )
  };

  const handleCreateReceipt = () => {
    navigate({
      pathname: routes[2].path,
    });
  };

  useEffect(() => {
    setIsReload(false);
    getListInvSummary();
    console.log('request', invSummaryReq);
  }, [invSummaryReq, isReload])

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Kiểm kho</h3>
          <Button
            className="button btn-add"
            type="primary"
            onClick={() => handleCreateReceipt()}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <InvSummarySearch invSummaryReq={invSummaryReq} triggerFormEvent={triggerFormEvent} users={user} />
      </Flex>
      <div className="table-wrapper">
        <Table
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
            )
          }}
          rowKey={(record) => record.summary_id}
          size="small"
          scroll={{ x: 1024 }}
          bordered={false}
          components={{
            header: {
              cell: (props: any) => {
                return (
                  <th
                    {...props}
                    style={{ ...props.style, backgroundColor: '#012970', color: '#ffffff' }}
                  />
                );
              },
            },
          }}
          columns={columns}
          loading={loading}
          dataSource={invSummaryRes.data}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                setDataItem(record);
                setOpenviewDate(true);
              },
            };
          }}
        />
        <Flex gap="middle" justify="space-between" align={'center'} style={{ paddingTop: '10px' }}>
          <Flex gap="middle" justify="flex-start" align={'center'}>
            <h5>Hiển thị</h5>
            <Select
              style={{ width: 70 }}
              options={selectPageSize}
              className='me-2 ms-2'
              value={pageSize || selectPageSize[0].value}
              onChange={(size: number) => {
                setInvSummaryReq({
                  ...invSummaryReq,
                  page: 1,
                  size: size
                });
                setPageSize(size);
              }} />
            <h5> Tổng số {invSummaryRes.totalElements || 0}  phiếu</h5>
          </Flex>


          <Pagination
            total={invSummaryRes.totalElements || 0}
            current={invSummaryRes.page}
            pageSize={invSummaryRes.size}
            showSizeChanger={false}
            onChange={(page) => {
              setInvSummaryReq({
                ...invSummaryReq,
                page: page,
              });
            }} />
        </Flex>

      </div>

      <InvSummaryView
        open={openViewDate}
        onCancel={() => {
          setOpenviewDate(false);
          getListInvSummary();
        }}
        data={dataItem}
        payMenthods={listPayMenthods}
        importTypes={listImportType}

      />

    </>
  );
};

export default InvoiceSummary;