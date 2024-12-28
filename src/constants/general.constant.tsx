export const KEY_LOCAL_STORAGE = {
  AUTHEN: "authen"
}

export const API_STATUS = {
  SUCCESS: 200,
}

export const selectPageSize = [
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 200, label: "200" },
];

export const formItemLayout = {
  labelCol: { sm: { span: 24 }, md: { span: 24 }, lg: { span: 10 }, xl: { span: 8 } },
  wrapperCol: { sm: { span: 24 }, md: { span: 24 }, lg: { span: 14 }, xl: { span: 16 } }
};

export const buttonAction = {
  create: 1,
  delete: 2,
  update: 3
}

export const CustonerType = [
  { value: 'COM', label: 'công ty' },
  { value: 'PER', label: 'Cá nhân' },
];

export const CityType = [
  // { value: "", label: "Tất cả" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Thành phố Hồ Chí Minh", label: "Thành phố Hồ Chí Minh" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "An Giang", label: "An Giang" },
  { value: "Bà Rịa - Vũng Tàu", label: "Bà Rịa - Vũng Tàu" },
  { value: "Bình Dương", label: "Bình Dương" },
  { value: "Bình Phước", label: "Bình Phước" },
  { value: "Bình Thuận", label: "Bình Thuận" },
  { value: "Bình Định", label: "Bình Định" },
  { value: "Bạc Liêu", label: "Bạc Liêu" },
  { value: "Bắc Giang", label: "Bắc Giang" },
  { value: "Bắc Kạn", label: "Bắc Kạn" },
  { value: "Bắc Ninh", label: "Bắc Ninh" },
  { value: "Bến Tre", label: "Bến Tre" },
  { value: "Cao Bằng", label: "Cao Bằng" },
  { value: "Cà Mau", label: "Cà Mau" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Gia Lai", label: "Gia Lai" },
  { value: "Hoà Bình", label: "Hoà Bình" },
  { value: "Hà Giang", label: "Hà Giang" },
  { value: "Hà Nam", label: "Hà Nam" },
  { value: "Hà Tĩnh", label: "Hà Tĩnh" },
  { value: "Hưng Yên", label: "Hưng Yên" },
  { value: "Hải Dương", label: "Hải Dương" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Hậu Giang", label: "Hậu Giang" },
  { value: "Khánh Hòa", label: "Khánh Hòa" },
  { value: "Kiên Giang", label: "Kiên Giang" },
  { value: "Kon Tum", label: "Kon Tum" },
  { value: "Lai Châu", label: "Lai Châu" },
  { value: "Long An", label: "Long An" },
  { value: "Lào Cai", label: "Lào Cai" },
  { value: "Lâm Đồng", label: "Lâm Đồng" },
  { value: "Lạng Sơn", label: "Lạng Sơn" },
  { value: "Nam Định", label: "Nam Định" },
  { value: "Nghệ An", label: "Nghệ An" },
  { value: "Ninh Bình", label: "Ninh Bình" },
  { value: "Ninh Thuận", label: "Ninh Thuận" },
  { value: "Phú Thọ", label: "Phú Thọ" },
  { value: "Phú Yên", label: "Phú Yên" },
  { value: "Quảng Bình", label: "Quảng Bình" },
  { value: "Quảng Nam", label: "Quảng Nam" },
  { value: "Quảng Ngãi", label: "Quảng Ngãi" },
  { value: "Quảng Ninh", label: "Quảng Ninh" },
  { value: "Quảng Trị", label: "Quảng Trị" },
  { value: "Sóc Trăng", label: "Sóc Trăng" },
  { value: "Sơn La", label: "Sơn La" },
  { value: "Thanh Hóa", label: "Thanh Hóa" },
  { value: "Thái Bình", label: "Thái Bình" },
  { value: "Thái Nguyên", label: "Thái Nguyên" },
  { value: "Thừa Thiên Huế", label: "Thừa Thiên Huế" },
  { value: "Tiền Giang", label: "Tiền Giang" },
  { value: "Trà Vinh", label: "Trà Vinh" },
  { value: "Tuyên Quang", label: "Tuyên Quang" },
  { value: "Tây Ninh", label: "Tây Ninh" },
  { value: "Vĩnh Long", label: "Vĩnh Long" },
  { value: "Vĩnh Phúc", label: "Vĩnh Phúc" },
  { value: "Yên Bái", label: "Yên Bái" },
  { value: "Điện Biên", label: "Điện Biên" },
  { value: "Đắk Lắk", label: "Đắk Lắk" },
  { value: "Đắk Nông", label: "Đắk Nông" },
  { value: "Đồng Nai", label: "Đồng Nai" },
  { value: "Đồng Tháp", label: "Đồng Tháp" },
];

export const DistrictType = [
  { value: "Tất cả", content: [] },
  {
    value: "Hà Nội",
    content: [
      { value: "Quận Ba Đình", label: "Quận Ba Đình" },
      { value: "Quận Hoàn Kiếm", label: "Quận Hoàn Kiếm" },
      { value: "Quận Tây Hồ", label: "Quận Tây Hồ" },
      { value: "Quận Long Biên", label: "Quận Long Biên" },
      { value: "Quận Cầu Giấy", label: "Quận Cầu Giấy" },
      { value: "Quận Đống Đa", label: "Quận Đống Đa" },
      { value: "Quận Hai Bà Trưng", label: "Quận Hai Bà Trưng" },
      { value: "Quận Hoàng Mai", label: "Quận Hoàng Mai" },
      { value: "Quận Thanh Xuân", label: "Quận Thanh Xuân" },
      { value: "Sóc Sơn", label: "Sóc Sơn" },
      { value: "Đông Anh", label: "Đông Anh" },
      { value: "Gia Lâm", label: "Gia Lâm" },
      { value: "Quận Nam Từ Liêm", label: "Quận Nam Từ Liêm" },
      { value: "Thanh Trì", label: "Thanh Trì" },
      { value: "Quận Bắc Từ Liêm", label: "Quận Bắc Từ Liêm" },
      { value: "Mê Linh", label: "Mê Linh" },
      { value: "Quận Hà Đông", label: "Quận Hà Đông" },
      { value: "Thị xã Sơn Tây", label: "Thị xã Sơn Tây" },
      { value: "Ba Vì", label: "Ba Vì" },
      { value: "Phúc Thọ", label: "Phúc Thọ" },
      { value: "Đan Phượng", label: "Đan Phượng" },
      { value: "Hoài Đức", label: "Hoài Đức" },
      { value: "Quốc Oai", label: "Quốc Oai" },
      { value: "Thạch Thất", label: "Thạch Thất" },
      { value: "Chương Mỹ", label: "Chương Mỹ" },
      { value: "Thanh Oai", label: "Thanh Oai" },
      { value: "Thường Tín", label: "Thường Tín" },
      { value: "Phú Xuyên", label: "Phú Xuyên" },
      { value: "Ứng Hòa", label: "Ứng Hòa" },
      { value: "Mỹ Đức", label: "Mỹ Đức" },
    ],
  },
];

export const sexType = [
  { value: 'false', label: 'Nữ' },
  { value: 'true', label: 'Nam' }
]

export const CustonerSource = [
  { value: 'phone', label: 'Điện thoại' },
  { value: 'truc tiep', label: 'Trực tiếp' },
  { value: 'qua gioi thieu', label: 'Qua giới thiệu' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'website', label: 'Website' },
];

export const CustonerGroupType = [
  { value: 'DYNAMIC', label: 'Tự động' },
  { value: 'FIXED', label: 'Cố định' },
];

export const StatusType = [
  { value: "1", label: "Đang kinh doanh" },
  { value: "0", label: "Đã ngừng kinh doanh" },
];

export const vat = [
  { name: "vat_percent", value: "0", label: "0%" },
  { name: "vat_percent", value: "5", label: "5%" },
  { name: "vat_percent", value: "8", label: "8%" },
  { name: "vat_percent", value: "10", label: "10%" },
];

export const ImportStatus = [
  { value: "0", label: "Đã hủy", name: "red" },
  { value: "1", label: "Đã hoàn thành", name: "green" },
  { value: "2", label: "Thanh toán một phần", name: "yellow" },
  { value: "3", label: "Chưa thanh toán", name: "red" }
]

export const ImportImportType = [
  { value: "YCNK", label: "Yêu cầu nhập kho" },
  { value: "TLK", label: "Trả lại kho" },
  { value: "TLBH", label: "Trả lại bán hàng" },
  { value: "KH", label: "Kiểm kho" }
]

export const PayMethod = [
  { value: "0", label: "Tiền mặt" },
  { value: "2", label: "Đã duyệt" },
  { value: "1", label: "Thanh toán một phần" },
  { value: "3", label: "Chưa thanh toán" }
]

export const Type = [
  { IMPORT_TYPE: "IMPORT_TYPE" },
  { EXPORT_TYPE: "EXPORT_TYPE" },
  { PAY_METHOD: "PAY_METHOD" },
  { INVOICE_SOURCE: "INVOICE_SOURCE" },
]

export const activeStatus = [
  { value: "true", label: "Đang hoạt động" },
  { value: "false", label: "Không hoạt đông" },
];