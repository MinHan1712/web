import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Flex, Form, Modal, notification, Select, SelectProps, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns";
import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceApi from "../apis/invoice.api";
import invoiceSummaryApi from "../apis/summary.api";
import InvSummaryFormCreate from "../components/summary/invSummaryFormCreate";
import { formItemLayout } from "../constants/general.constant";
import { IDrgInvProductResponse, IDrugInvProductPageRequest } from "../interfaces/inventoryImport";
import { IDrugInvSummaryRequest } from "../interfaces/summaryInvoice";
import userApi from "../apis/user.api";
import { IUserWithRoleResponse } from "../interfaces/userManager";

export interface SummaryContextType {
  invSummaryCreateReq: IDrugInvSummaryRequest | {
    products: []
  };
  setInvSummaryCreateReq: React.Dispatch<React.SetStateAction<IDrugInvSummaryRequest | {
    products: []
  }>>;
}
const SummaryContext = createContext<SummaryContextType | undefined>(undefined);
export const useSummaryContext = (): SummaryContextType => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

const InvSummaryCreate = () => {

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { confirm } = Modal;

  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [key, setKey] = useState(1);

  const [optionUserList, setOptionUserList] = useState<SelectProps<string>['options']>([]);
  const [invProductReq, setInvProductReq] = useState<IDrugInvProductPageRequest>({
    page: 1,
    size: 20,
    classification: false
  });

  const [productRes, setProductRes] = useState<IDrgInvProductResponse[]>([]);

  const [invSummaryCreateReq, setInvSummaryCreateReq] = useState<IDrugInvSummaryRequest>({
    products: []
  });

  useEffect(() => {
    getListProduct();
    getListUserManger();
  }, []);


  const getListProduct = async () => {
    setLoading(true);
    try {
      await invoiceApi.getListInvProduct(invProductReq).then((response) => {
        console.log(response)
        // switch (response.meta[0].code) {
        //     case 200:
        setProductRes(prevState => [...prevState, ...response.data]);
        console.log(response);
        //     break;
        // default:
        //     notification['error']({
        //         message: "Lỗi",
        //         description: 'Cập nhập nhà cung cấp không thành công',
        //     });
        //     break;
        // }
      })
        .catch(() => {
          // notification['error']({
          // 	message: "Lỗi",
          // 	description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
          // });
        })

    } catch (err) {
      console.log(err);
    } finally { setLoading(false); }
  }

  const getListUserManger = () => {
    userApi.get({ page: 0, size: 0 })
      .then((response) => {
        // if (response.meta[0].code === 200) {
        setOptionUserList(response.data?.map((user: IUserWithRoleResponse) => {
          return {
            value: user.login,
            label: user.user_name
          }
        }));
        // } else {
        //   notification['error']({
        //     message: "Thông báo",
        //     description: 'Có một lỗi nào đó xảy ra, vui lòng tải lại trang',
        //   });
        // }
      }).catch(() => {
      })
      .finally(() => {
      });
  }

  const addNewRowdetail = (value: IDrgInvProductResponse) => {
    if (value) {
      var checkItemDuplicate = invSummaryCreateReq.products.find(x => x.inv_detail_id == value.id);

      if (checkItemDuplicate) {
        notification["error"]({
          message: "Thông báo",
          description: "Thuốc đã có trong bảng. Xin vui lòng kiểm tra lại!",
        });
        return;
      }

      var data = {
        key: key,
        summary_dd_id: '',
        inv_detail_id: value.id,
        inv_detail: value.inventory_id,
        cur_qty: value.sum_base_quantity || value.base_quantity,
        pre_qty: value.sum_base_quantity || value.base_quantity,
        drug_id: value.drug_id,
        drug_name: value.drug_name,
        drug_code: value.drug_code,
        drug_unit_id: value.unit_parent_id,
        drug_unit_name: value.units?.find(x => x.unit_id == value.unit_parent_id)?.unit_name || value.unit_name,
        lot: value.lot,
        price: value.price,
        exp_date: value.exp_date,
        vat: value.vat_percent,
        discount_amt: value.discount_amount,
      };

      setKey(key + 1);
      setInvSummaryCreateReq({
        ...invSummaryCreateReq,
        products: [...invSummaryCreateReq.products, data]
      });
    }
  }

  const confirmDeleteCellToTable = (key: number, index: number) => {
    const updatedProducts = invSummaryCreateReq.products.filter(product => product.key !== key);
    setInvSummaryCreateReq((prevState) => ({
      ...prevState,
      products: updatedProducts,
    }));

  }

  const confirmCreateInvSummary = () => {
    var errorListInvDetail = invSummaryCreateReq.products.filter(item => item.cur_qty == 0)
    if (errorListInvDetail && errorListInvDetail.length > 0) {
      notification["error"]({
        message: "Thông báo",
        description: 'Vui lòng nhập số lượng thuốc',
      });
      return;
    }

    confirm({
      title: 'Bạn có đồng ý kiểm kho?',
      okText: "Đồng ý",
      cancelText: 'Hủy',
      async onOk() {
        try {
          createInvSummaryToApi();
        } catch (e) {
          notification["error"]({
            message: "Thông báo",
            description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
          });
        }
      }, onCancel() { },
    });
  }

  const onScrollSelectProduct = (event: any) => {
    var target = event.target
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setInvProductReq({
        ...invProductReq,
        page: invProductReq.page || 1 + 1,
      })
      getListProduct();
      target.scrollTo(0, target.scrollHeight)
    }
  }

  const createInvSummaryToApi = () => {
    setLoadingScreen(true);
    return invoiceSummaryApi.create(invSummaryCreateReq).then((response) => {
      console.log(response);
      // if (response.meta[0].code === 200) {
      form.resetFields();
      notification["success"]({
        message: "Thông báo",
        description: "Tạo phiếu kiểm kho thành công",
      });
      setInvSummaryCreateReq({
        products: []
      });
      navigate('/kho/kiemkho');
      // } else {
      //   notification["error"]({
      //     message: "Thông báo",
      //     description: "Tạo phiếu kiểm kho không thành công",
      //   });
      // }
      setLoadingScreen(false);
    })
      .catch(() => {
        notification["error"]({
          message: "Thông báo",
          description: "Tạo phiếu kiểm kho không thành công",
        });
        setLoadingScreen(false);
      })
  }

  const triggerFormEvent = (value: IDrugInvSummaryRequest) => {
    confirmCreateInvSummary();
  }

  return (
    <>
      {loadingScreen ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
      ) : (<>
        <SummaryContext.Provider value={{ invSummaryCreateReq, setInvSummaryCreateReq }}>
          <div className="form-filter-customer form-filter check-inv">
            <Form
              form={form}
              name="custoner_filter"
              className="common-form wrapper-form"
              onFinish={triggerFormEvent}
            >
              <Flex gap="middle" justify="space-between" align={'center'}
                style={{ width: '90%', padding: '5px' }}>
                <div style={{ width: '30%' }}>
                  <Form.Item
                    {...formItemLayout}
                    labelAlign={"left"}
                    name={'check_date'}
                    label={
                      <span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày kiểm</span>
                    }
                  >
                    <DatePicker className="form-input d-flex" size="middle"
                      value={invSummaryCreateReq.check_date ? dayjs(invSummaryCreateReq.check_date) : dayjs()}
                      placeholder="Chọn ngày" format={"DD/MM/YYYY"}
                      onChange={(e: any) => {
                        invSummaryCreateReq.check_date = e ? e.format("YYYY-MM-DD") : null;
                      }} />
                  </Form.Item>
                </div>

                <div style={{ width: '30%' }}>
                  <Form.Item
                    {...formItemLayout}
                    labelAlign={"left"}
                    name={'check_user'}
                    label={
                      <span style={{ fontWeight: "550", fontSize: "14px" }}>Người kiểm</span>
                    }
                  >
                    <Select
                      className="d-flex"
                      size="middle"
                      id={'check_user'}
                      placeholder="Người kiểm"
                      value={invSummaryCreateReq.check_user}
                      options={[{
                        value: '',
                        label: 'Tất cả'
                      }, ...optionUserList || []]}
                      onChange={(e: any) => {
                        invSummaryCreateReq.check_user = e;
                      }}
                    />
                  </Form.Item>
                </div>

                <div style={{ width: '30%' }}>
                  <Form.Item
                    {...formItemLayout}
                    labelAlign={"left"}
                    name={'note'}
                    label={
                      <span style={{ fontWeight: "550", fontSize: "14px" }}>Ghi chú</span>
                    }
                  >
                    <TextArea rows={1} value={invSummaryCreateReq.note}
                      placeholder="Nhập ghi chú" name="note"
                      onChange={(e: any) => {
                        invSummaryCreateReq.note = e?.target?.value;
                      }} />
                  </Form.Item>
                </div>
              </Flex>
              <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '90%' }}>
                <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
                  <h5 style={{ width: '150px', display: 'flex', alignItems: 'center' }}>Thêm sản phẩm</h5>
                  <Select
                    className="d-flex w-100 form-select-search "
                    style={{ minHeight: '30px' }}
                    size="middle"
                    optionLabelProp="label"
                    loading={loading}
                    onPopupScroll={onScrollSelectProduct}
                    onSelect={(e: string) => {
                      addNewRowdetail(productRes.find(x => x.id == e) || { id: '0' });
                    }}
                    notFoundContent={productRes ? <Empty description="Không có dữ liệu" /> : null}
                  >
                    {productRes?.map((value: IDrgInvProductResponse) => (
                      <Select.Option key={value.id} value={value.id} label={value.drug_name}>
                        <div className="item-search-info-container">
                          <div className="drug_info">
                            <div className="info_top">
                              <h4 className="item-name">
                                <span>{value.drug_name || ''}</span>
                              </h4>
                              <h4 className="item-price">{(((value.price || 0) - (value.discount_amount || 0)) * ((value.vat_percent || 0) + 100) / 100)}</h4>
                            </div>
                            <div className="info_bottom">
                              <p className="item-code">{value.drug_code}</p>
                              <p className="item-info-other">HSD:  <strong>{value.exp_date ? format(new Date(value.exp_date), 'dd-MM-yyyy') : ''}- </strong>Số lô:  <strong>{value.lot || ''}- </strong>Tồn:  <strong>{value.sum_base_quantity || 0}</strong> {value.units?.find(x => x.unit_id == value.unit_parent_id)?.unit_name || value.unit_name || ''}</p>
                            </div>
                          </div>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Flex>
                <Button
                  className="button btn-add d-flex flex-row justify-content-center align-content-center"
                  type="primary"
                  // disabled={settingButtonAdd}
                  onClick={() => {
                    form.submit();
                  }}
                >
                  <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
                  <span>Tạo phiếu</span>
                </Button>
              </Flex>
            </Form>
          </div >

          <InvSummaryFormCreate
            confirmDeleteCellToTable={confirmDeleteCellToTable}
          />
        </SummaryContext.Provider>
      </>)
      }
    </>
  );
};

export default InvSummaryCreate;