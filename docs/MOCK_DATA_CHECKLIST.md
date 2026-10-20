# Checklist dữ liệu mẫu / hard-code FE_Kido_MBH

## Đang render dữ liệu mẫu trực tiếp

- [x] `src/datas/payrollData.js`
  - Mock bảng lương `BL000001`, `BL000002`.
  - `src/pages/Employee/Paysheet.jsx` đã dùng `payrollApi`.

- [x] `src/datas/suppliersData.js`
  - Mock danh sách nhà cung cấp `NCC001...`, công ty ABC/XYZ.
  - `src/pages/Suppliers/Suppliers.jsx` đã dùng `supplierApi`.

- [x] `src/datas/stockTakeData.js`
  - Mock hàng kiểm kho `Coca Cola`, `Pepsi`, `Aquafina`, bị lặp nhiều lần.
  - `src/components/StockTakes/StockTakeModal.jsx` đã dùng `inventoryItemApi`.

- [ ] `src/components/Home/RecentActivities.jsx`
  - Hard-code hoạt động gần đây: user, số tiền, thời gian `6 days ago`.

## Hard-code / fallback có thể làm sai dữ liệu thật

- [x] `src/pages/Account.jsx`
  - Hard-code tài khoản: `Nguyen`, `0776142018`, `Admin`, `+84776142018`.
  - Đã dùng `GET /users/me` và `PUT /users/me`.

- [x] `src/pages/reports/ReportProduct.jsx`
  - Hard-code branch và ngày mặc định: `Chi nhánh trung tâm`, `2026-05-07`.
  - Đã lấy branch mặc định từ API/token và ngày mặc định theo ngày hiện tại.

- [x] `src/components/reports/reportProduct/ProductSaleReport.jsx`
  - Fallback report hard-code: `150,000,000`, `CÔNG TY TNHH KIDO EDU`, `KIDO`.
  - Đã bỏ fallback mẫu và truyền `branchId` vào API.

- [x] `src/components/reports/reportProduct/ProductInventoryReport.jsx`
  - Có gọi API inventory nhưng nhiều cột map cứng thành `"0"`, `"-"`, `""`.
  - Header hard-code số liệu: `15`, `18,000,000`, `30,000,000`, `May-26`.
  - Đã map từ inventory/revenue API; các field backend chưa có để rỗng/0 thay vì số mẫu.

- [x] `src/components/reports/reportProduct/ProductSaleChart.jsx`
  - Header hard-code branch/date.
  - KPI hard-code: `25.500.000đ`, `245`, `1.250`, `+15%`.
  - Đã dùng branch/date props và revenue/top/bottom products API.

- [x] `src/components/reports/reportProduct/ProductProfitReport.jsx`
  - Màn lợi nhuận là placeholder.
  - Hard-code branch/date và text `Nội dung báo cáo lợi nhuận`.
  - Branch/date đã dùng props; nội dung vẫn placeholder do chưa có API profit report.

- [x] `src/components/reports/reportProduct/ProductCancelReport.jsx`
  - Màn xuất hủy là placeholder.
  - Hard-code branch/date và text `Nội dung báo cáo xuất hủy`.
  - Branch/date đã dùng props; nội dung vẫn placeholder do chưa có API product cancel report riêng.

- [ ] `src/components/reports/reportEndDay/ReportContent.jsx`
  - Fallback branch `Trường tiểu học ABC`.
  - Hard-code `branchId = "11111111-1111-4111-8111-111111111111"`.

- [ ] `src/components/Home/SalesChart.jsx`
  - Chart theo giờ đang ước tính/chia đều từ dữ liệu tổng.
  - Khách theo giờ đang ước tính bằng `customers / 8`.

- [ ] `src/components/Home/StaffAndCancelReport.jsx`
  - Giờ làm nhân viên đang tính mock theo loại ca.
  - Các chỉ số `absent`, `pendingRequests`, `late`, `earlyLeave` set cứng `0`.

- [x] `src/components/Products/SidebarFilter.jsx`
  - Nhóm hàng hard-code: `BIA & THUỐC LÁ`, `CLASSIC COCKTAILS`, `MÓN KHAI VỊ`, `SÚP`, `TEA`.
  - Đã dùng `/categories`.

- [x] `src/components/PriceBook/SidebarPrice.jsx`
  - Nhóm hàng hard-code giống sidebar sản phẩm.
  - Bảng giá mặc định hard-code `Bảng giá chung`.
  - Nhóm hàng đã dùng `/categories`; bảng giá riêng vẫn pending vì chưa có API price book.

- [x] `src/components/Employee/AddPaySheetModal.jsx`
  - Kỳ làm việc/date hard-code: `01/06/2026 - 30/06/2026`, `2026-06-02`.
  - Đã dùng ngày/tháng hiện tại.

- [x] `src/components/Employee/AddEmployeeModal.jsx`
  - Mức lương mặc định hard-code `400,000`.
  - Đã bỏ default salary mẫu; branch dropdown lấy `/branches` nhưng chưa gửi payload vì BE employee chưa có `branchId`.

- [x] `src/components/Employee/EmployeeDetail.jsx`
  - Chi nhánh trả lương/làm việc hard-code `Chi nhánh trung tâm`.
  - Đã bỏ branch/salary mẫu; hiển thị từ employee nếu BE bổ sung field.

- [ ] `src/components/StockTakes/TableStock.jsx`
  - Table phiếu kiểm kho đang set `const data = []`, chưa lấy API.

## Ghi chú

- Không tính placeholder input, label tab/filter cố định như `Hôm nay`, `Đồ ăn`, `Đồ uống` là dữ liệu mẫu, trừ khi chúng đang thay cho dữ liệu nghiệp vụ từ API.
- Các mục trong nhóm đầu tiên là ưu tiên cao vì đang render mock data trực tiếp lên UI.
