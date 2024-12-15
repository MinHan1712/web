import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Flex, Form, Input, Popconfirm, Select, SelectProps } from "antd";
import { formItemLayout, ImportStatus, vat } from "../../constants/general.constant";
import { useEffect } from "react";
import { ICustomerPageRequest } from "../../interfaces/customer";
import dayjs from 'dayjs';
import { IInventoryImportPageRequest } from "../../interfaces/inventoryImport";
import Table, { ColumnsType } from "antd/es/table";
import { IImportInventoryDetailCreate } from "../../interfaces/inventoryDetail";

interface Props {
  // importInvDetails: IImportInventoryDetailCreate[];
}

const InvImportCreateTable = (props: Props) => {
  let count = 1;

  const columnsInvImportDetail: ColumnsType<IImportInventoryDetailCreate> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "40px",
      align: 'center',
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{count++}</span>
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "drug_name",
      key: "drug_name",
      width: "11%",
      align: 'left',
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <div className='style-text-limit-number-line2 d-flex align-items-center'>
            <span>{record.drug_name}</span>
          </div>
        )
      },
    },
    {
      title: "Số lô",
      dataIndex: "lot",
      key: "lot",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Input
            size="middle"
            placeholder="Số lô"
            value={record.lot}
            status={record.lot ? "" : "warning"}
            onChange={(e: any) => {
              // let newData = [...importInvDetails];
              // newData[index]['lot'] = e?.target?.value;
              // setImportInvDetails(newData);
            }}
            id="lot"
          />
        )
      },
    },
    {
      title: "HSD",
      dataIndex: "exp_date",
      key: "exp_date",
      width: "11%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <DatePicker
            size="middle"
            format={"DD/MM/YYYY"}
            placeholder="HSD"
            status={record.exp_date ? "" : 'warning'}
            value={record.exp_date ? dayjs(record.exp_date) : null}
            onChange={(date, dateString) => {
              // let newData = [...importInvDetails];
              // newData[index]['exp_date'] = date && dayjs(date, 'YYYY-MM-DD').format('YYYY-MM-DD') || '';
              // setImportInvDetails(newData);
            }}
          />
        )
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Input
            size="middle"
            min={0}
            value={record.quantity}
            name="quantity"
            status={record.quantity || 0 > 0 ? "" : "error"}
            onChange={(e: any) => {

              // var value = parseFloat(e?.target?.value.replace(/,/g, ''));
              // let newData = [...importInvDetails];

              // value = value ? value : 0;

              // newData[index]['quantity'] = value || 0;
              // newData[index]['total_amount'] = (newData[index]['quantity'] || 0) * ((newData[index]['price'] || 0) - (newData[index]['discount_amount'] || 0)) * ((newData[index]['vat_percent'] || 0) + 100) / 100;
              // setImportInvDetails(newData);
            }}
          />
        )
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit_id",
      width: "10%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        var unitOptions = record.drug_units?.map((item) => ({
          value: item.unit_id || '',
          label: item.unit_name || ''
        }))
        return (
          <Select
            size="middle"
            defaultValue={record.unit_id || ''}
            style={{ textAlign: 'left' }}
            value={record.unit_id}
            onChange={(e: any) => {
              // let newData = [...importInvDetails];
              // var units = record.drug_units?.find(x => x.unit_id == e) || { unit_parent_id: e, unit_qty: 1, import_price: 0, price: 0 };
              // newData[index]['unit_id'] = e;
              // newData[index]['unit_parent_id'] = units?.unit_parent_id;
              // newData[index]['price'] = units?.import_price;
              // newData[index]['cur_price'] = units && units.price || 0;
              // newData[index]['total_amount'] = (newData[index]['quantity'] || 0) * ((newData[index]['price'] || 0) - (newData[index]['discount_amount'] || 0)) * ((newData[index]['vat_percent'] || 0) + 100) / 100;
              // setImportInvDetails(newData);
            }}
            options={unitOptions}
          />
        )
      },
    },
    {
      title: "Giá nhập",
      dataIndex: "price",
      key: "price",
      width: "11%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {

        return (
          <Input
            size="middle"
            min={0}
            value={(record.price?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter="đ"
            name="price"
            onChange={(e: any) => {

              // var value = parseFloat(e?.target?.value.replace(/,/g, ''));
              // let newData = [...importInvDetails];

              // value = value ? value : 0;

              // if (value < (newData[index]['discount_amount'] || 0) * ((newData[index]['quantity'] || 0))) {
              //     showMessage("error", "Giảm nhập không được nhỏ hơn giảm giá", 'Lỗi');

              // }

              // if (value > (newData[index]['cur_price'] || 0)) {
              //     showMessage('warning', "Giá nhập cao hơn giá bán, vui lòng kiểm tra lại", 'Cảnh bảo');
              // }

              // newData[index]['price'] = value || 0;
              // newData[index]['total_amount'] = (newData[index]['quantity'] || 0) * ((newData[index]['price'] || 0) - (newData[index]['discount_amount'] || 0)) * ((newData[index]['vat_percent'] || 0) + 100) / 100;

              // setImportInvDetails(newData);
            }}
          />
        )
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount_amount",
      key: "discount_amount",
      width: "11%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (

          <Input
            size="middle"
            min={0}
            value={(record.discount_amount?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter="đ"
            name="discount_amount"
            onChange={(e: any) => {

              // var value = parseFloat(e?.target?.value.replace(/,/g, ''));
              // let newData = [...importInvDetails];
              // let total_sum_current = (newData[index]['total_amount'] || 0) + (newData[index]['discount_amount'] || 0) * (newData[index]['quantity'] || 0);
              // console.log('value', value, total_sum_current);
              // value = value ? value * (newData[index]['quantity'] || 0) : 0;
              // if (value > total_sum_current) {
              //     showMessage("error", "Giảm giá không được lớn hơn tổng tiền", 'Lỗi');
              //     return;
              // }

              // if (!value) {
              //     newData[index]['discount_amount'] = 0;
              // }

              // newData[index]['discount_amount'] = value / (newData[index]['quantity'] || 1);
              // newData[index]['total_amount'] = total_sum_current - (newData[index]['discount_amount'] || 0) * (newData[index]['quantity'] || 0);

              // setImportInvDetails(newData);
              // console.log(newData);
            }}
          />
        )
      },
    },
    {
      title: "Vat",
      dataIndex: "vat_percent",
      key: "vat_percent",
      width: "50px",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Select
            size="middle"
            defaultValue={record.vat_percent || '0%'}
            value={record.vat_percent || 0}
            onChange={(e: any) => {
              // let newData = [...importInvDetails];
              // newData[index]['vat_percent'] = e;
              // newData[index]['total_amount'] = (newData[index]['quantity'] || 0) * ((newData[index]['price'] || 0) - (newData[index]['discount_amount'] || 0)) * (((newData[index]['vat_percent'] || 0) + 100) / 100);
              // setImportInvDetails(newData);
            }}
            options={vat}
          />
        )
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      width: "11%",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate, index: number) => {
        return (
          <Input
            size="middle"
            min={0}
            value={(record.total_amount?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter="đ"
            name="total_amount"
            onChange={(e: any) => {

              // var value = parseFloat(e?.target?.value.replace(/,/g, ''));
              // let newData = [...importInvDetails];
              // value = value ? value : 0;

              // newData[index]['total_amount'] = value || 0;

              // newData[index]['price'] = ((newData[index]['total_amount'] || 0) - (newData[index]['discount_amount'] || 0) * (newData[index]['quantity'] || 0)) / (((newData[index]['vat_percent'] || 0) + 100) / 100);
              // setImportInvDetails(newData);
            }}
          />
        )
      },
    },
    {
      title: "",
      dataIndex: "key",
      key: "key",
      width: "40px",
      align: "center",
      render: (_: any, record: IImportInventoryDetailCreate) => {
        return (
          <Popconfirm
            placement="topLeft"
            title={"Bạn có muốn xóa thuốc này?"}
            description={""}
            // onConfirm={() => confirmDeleteCellToTable(record.key || 0)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ fontWeight: "600", color: "red", textAlign: 'right' }} />
          </Popconfirm>
        )
      },
    },
  ];

  // useEffect(() => {
  //   form.setFieldsValue({ ...props.InvImportReq });
  // }, [props.InvImportReq]);

  // const eventSummitForm = (formValue: ICustomerPageRequest) => {
  //   props.triggerFormEvent(formValue);
  // }

  const CustomerStyleContent: React.CSSProperties = {
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
      <div className="table-wrapper" style={{width: '100%'}}>
        <div className="table-container">
          <Table locale={{
            emptyText: (
              <Empty description="Chưa chọn sản phẩm nào" />
            )
          }}
            rowKey={(record) => record.key || ''}
            size="small"
            style={{
              marginTop: '5px', height: '611px', overflowY: 'scroll'
            }}
            scroll={{ x: 900 }}
            className="table table-hover provider-table"
            columns={columnsInvImportDetail}
            // dataSource={[...importInvDetails]}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default InvImportCreateTable;