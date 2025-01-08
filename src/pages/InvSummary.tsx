import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, notification, Pagination, Select, SelectProps } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { format } from "date-fns/format";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceSummaryApi from "../apis/summary.api";
import '../assets/css/style.css';
import InvSummarySearch from "../components/summary/InvSummarySearch";
import InvSummaryView from "../components/summary/InvSummaryView";
import { selectPageSize } from "../constants/general.constant";
import { IPageResponse } from "../interfaces/common";
import { IInventoryImportPageRequest } from "../interfaces/inventoryImport";
import { IProperty } from "../interfaces/property";
import { IDrugInvSummaryPageRequest, IDrugInvSummaryResponse } from "../interfaces/summaryInvoice";
import { getListImportTypeOption } from "../utils/local";
import userApi from "../apis/user.api";
import { IUserWithRoleResponse } from "../interfaces/userManager";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const InvoiceSummary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [openViewDate, setOpenviewDate] = useState(false);
  const [dataItem, setDataItem] = useState({ summary_id: '0' });
  const [isReload, setIsReload] = useState(false);
  const [user, setUser] = useState<SelectProps<string>['options']>([]);
  const [importTypeOptions, setImportTypeOptions] = useState<SelectProps<string>['options']>([]);
  const [isExcel, setIsExcel] = useState(false);
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
      var request = {
        ...invSummaryReq,
        page: isExcel ? 0 : invSummaryReq.page,
        size: isExcel ? 0 : invSummaryReq.size
      }
      await invoiceSummaryApi.getList(request).then((response) => {
        switch (response.meta.code) {
          case 200:
            if (isExcel) {
              exportToExcel(response.data);
              setIsExcel(false);
            } else {
              setInvSummaryRes(response.data);
            }
            break;
          default:
            notification['error']({
              message: "Lỗi",
              description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
            });
            break;
        }
      })
        .catch(() => {
          notification['error']({
            message: "Lỗi",
            description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
          });
        })

    } catch (err) {
      notification['error']({
        message: "Lỗi",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    } finally { setLoading(false); }
  }

  const getListUserManger = async () => {
    await userApi.get({ page: 0, size: 0 })
      .then((response) => {
        if (response.meta.code === 200) {
          setUser(response.data.data.map((user: IUserWithRoleResponse) => {
            return {
              value: user.login,
              label: user.user_name
            }
          }));

        }
      }).catch(() => {

      })
  }

  const exportAndCallApi = async () => {
    setIsExcel(true);
    getListInvSummary();
  }

  const exportToExcel = (result: IPageResponse<IDrugInvSummaryResponse[]>) => {
    if (result) {
      const importData = result.data?.map((item) => {
        if (item.drg_inv_summary_details) {
          return item.drg_inv_summary_details.map((drg) => ({
            "Mã phiếu": item.summary_id,
            "Ghi chú": item.note,
            "Người kiểm": item.check_user,
            "Ngày tạo": item.check_date,
            "Mã sản phẩm": drg.drg_drug_cd,
            "Tên sản phẩm": drg.drg_drug_name,
            "Số lô": drg.lot,
            "SL tồn": drg.pre_qty,
            "SL thực tế": drg.cur_qty,
            "SL nhập": Math.max((drg.cur_qty || 0) - (drg.pre_qty || 0), 0),
            "SL xuất": Math.max((drg.pre_qty || 0) - (drg.cur_qty || 0), 0),
            "Đơn vị": drg.unit_name
          }));
        }
        return [];
      }).flat();

      console.log(result.data);

      const ws = XLSX.utils.json_to_sheet(importData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Import Data");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const file = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(file, `Lich-su-kiểm-kho${new Date().toISOString().split('T')[0]}.xlsx`);
    } else {
      notification['info']({
        message: "Thông báo",
        description: 'Không có dữ liệu để xuất file',
      });
    }
  };

  const triggerFormEvent = (value: IInventoryImportPageRequest) => {
    setInvSummaryReq({
      ...value,
      page: invSummaryReq.page,
      size: invSummaryReq.size,
    });
    // get list provider
  }

  const handleCreateReceipt = () => {
    navigate('/kho/taophieukiemkho');
  };

  useEffect(() => {
    setImportTypeOptions(getListImportTypeOption);
    getListUserManger();
  }, [])

  useEffect(() => {
    setIsReload(false);
    getListInvSummary();
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
        <InvSummarySearch invSummaryReq={invSummaryReq} triggerFormEvent={triggerFormEvent} users={user} exportToExcel={exportAndCallApi} />
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
          scroll={{ x: 240 }}
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