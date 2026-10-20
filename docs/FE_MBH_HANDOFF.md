# FE Handoff — MBH Management APIs

> Base URL: `http://localhost:3000` (hoặc theo `.env`)
> Tất cả API đều yêu cầu JWT trừ khi ghi rõ khác.

```http
Authorization: Bearer <accessToken>
```

---

## Mục lục

1. [Auth — Đăng nhập](#1-auth--đăng-nhập)
2. [Employees — Nhân viên](#2-employees--nhân-viên)
3. [Work Schedules — Lịch làm việc & Chấm công](#3-work-schedules--lịch-làm-việc--chấm-công)
4. [Products — Hàng hóa](#4-products--hàng-hóa)
5. [Reports — Báo cáo](#5-reports--báo-cáo)
   - 5.1 [Doanh thu tổng hợp](#51-doanh-thu-tổng-hợp)
   - 5.2 [Doanh thu theo ngày](#52-doanh-thu-theo-ngày)
   - 5.3 [Top sản phẩm bán chạy](#53-top-sản-phẩm-bán-chạy)
   - 5.4 [Sản phẩm bán chậm](#54-sản-phẩm-bán-chậm)
   - 5.5 [Báo cáo cuối ngày](#55-báo-cáo-cuối-ngày)
   - 5.6 [Báo cáo tồn kho](#56-báo-cáo-tồn-kho)
   - 5.7 [Tổng kết ca làm việc](#57-tổng-kết-ca-làm-việc)

---

## 1. Auth — Đăng nhập

```http
POST /auth/login
```

**Body:**
```json
{
  "email": "admin@pos.local",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGci...",
  "userId": "uuid",
  "role": "ADMIN"
}
```

> Dùng `accessToken` gắn vào header `Authorization: Bearer <token>` cho tất cả API phía dưới.

---

## 2. Employees — Nhân viên

> Tương ứng FE data: `employeeData.js`

### 2.1 Lấy danh sách nhân viên

```http
GET /employees
GET /employees?status=working
GET /employees?status=quit
```

**Query params:**

| Param | Kiểu | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `status` | `"working"` \| `"quit"` | Không | Lọc theo trạng thái |

**Response 200:**
```json
[
  {
    "id": "uuid",
    "code": "NV000001",
    "timekeepingCode": "CC001",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "cccd": "079123456789",
    "debt": 0,
    "note": "",
    "status": "working",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

> **Mapping FE:** `fullName` → hiển thị cột `Tên nhân viên`, `timekeepingCode` → cột `Mã chấm công`, `debt` → cột `Nợ và tạm ứng`.

---

### 2.2 Lấy chi tiết nhân viên

```http
GET /employees/:id
```

**Response 200:** Giống 1 phần tử của danh sách.

**Response 404:**
```json
{ "message": "Employee not found", "statusCode": 404 }
```

---

### 2.3 Tạo nhân viên mới

```http
POST /employees
```

**Body:**
```json
{
  "code": "NV000004",
  "timekeepingCode": "CC004",
  "fullName": "Phạm Thị D",
  "phone": "0912345678",
  "cccd": "079111222333",
  "debt": 0,
  "note": "",
  "status": "working"
}
```

| Field | Kiểu | Bắt buộc |
|-------|------|----------|
| `code` | string | **Có** (unique) |
| `timekeepingCode` | string | Không (unique nếu có) |
| `fullName` | string | **Có** |
| `phone` | string | Không |
| `cccd` | string | Không |
| `debt` | number ≥ 0 | Không (mặc định 0) |
| `note` | string | Không |
| `status` | `"working"` \| `"quit"` | Không (mặc định `"working"`) |

**Response 201:** Object nhân viên vừa tạo.

---

### 2.4 Cập nhật nhân viên

```http
PUT /employees/:id
```

**Body:** Giống POST, gửi toàn bộ fields cần update.

**Response 200:** Object nhân viên sau khi update.

---

### 2.5 Xóa nhân viên

```http
DELETE /employees/:id
```

**Response 204:** No content.

---

## 3. Work Schedules — Lịch làm việc & Chấm công

> Tương ứng FE data: `timeSheetData.js`, `workScheduleData.js`

### 3.1 Lấy bảng chấm công theo tuần

```http
GET /work-schedules/timesheet?from=2026-05-25&to=2026-05-31
GET /work-schedules/timesheet?from=2026-05-25&to=2026-05-31&employeeId=uuid
```

**Query params:**

| Param | Kiểu | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `from` | `YYYY-MM-DD` | **Có** | Ngày đầu tuần (thường là Thứ 2) |
| `to` | `YYYY-MM-DD` | **Có** | Ngày cuối tuần (thường là CN) |
| `employeeId` | UUID | Không | Lọc 1 nhân viên |

**Response 200:**
```json
[
  {
    "id": "uuid-nv1",
    "code": "NV000001",
    "name": "Nguyễn Văn A",
    "debt": 0,
    "shifts": {
      "25": "morning",
      "26": "afternoon",
      "27": "full"
    }
  },
  {
    "id": "uuid-nv2",
    "code": "NV000002",
    "name": "Trần Thị B",
    "debt": 150000,
    "shifts": {
      "25": "full",
      "28": "morning"
    }
  }
]
```

> **Mapping FE `timeSheetData`:** `shifts` là object key=ngày trong tháng (number), value=loại ca. Dùng `date.getDate()` để lookup.

**Shift values:**

| Value | Hiển thị FE |
|-------|------------|
| `"morning"` | Ca sáng |
| `"afternoon"` | Ca chiều |
| `"full"` | Cả ngày |

---

### 3.2 Lấy lịch làm việc theo tháng

```http
GET /work-schedules/monthly?year=2026&month=1
GET /work-schedules/monthly?year=2026&month=1&employeeId=uuid
```

**Query params:**

| Param | Kiểu | Bắt buộc |
|-------|------|----------|
| `year` | number | **Có** |
| `month` | number (1–12) | **Có** |
| `employeeId` | UUID | Không |

**Response 200:**
```json
[
  {
    "id": "uuid-schedule",
    "employeeId": "uuid-nv1",
    "employeeName": "Nguyễn Văn A",
    "employeeCode": "NV000001",
    "workDate": "2026-01-05",
    "shift": "morning",
    "note": null
  }
]
```

> **Mapping FE `workScheduleData`:** Group by tuần từ phía FE, dùng `workDate` để tính ngày/tuần.

---

### 3.3 Lấy chi tiết 1 lịch

```http
GET /work-schedules/:id
```

---

### 3.4 Tạo lịch làm việc (gán ca)

```http
POST /work-schedules
```

**Body:**
```json
{
  "employeeId": "uuid-nv1",
  "workDate": "2026-05-26",
  "shift": "morning",
  "note": ""
}
```

| Field | Kiểu | Bắt buộc |
|-------|------|----------|
| `employeeId` | UUID | **Có** |
| `workDate` | `YYYY-MM-DD` | **Có** |
| `shift` | `"morning"` \| `"afternoon"` \| `"full"` | **Có** |
| `note` | string | Không |

**Response 201:** Object lịch vừa tạo.

---

### 3.5 Cập nhật lịch làm việc

```http
PUT /work-schedules/:id
```

**Body:** Giống POST.

**Response 200:** Object sau khi update.

---

### 3.6 Xóa lịch làm việc (xóa ca)

```http
DELETE /work-schedules/:id
```

**Response 204:** No content.

> **Flow FE xóa ca:** Modal confirm → gọi `DELETE /work-schedules/:id` → reload timesheet.

---

## 4. Products — Hàng hóa

> Tương ứng FE data: `mockExamData.js` (products array)

### 4.1 Danh sách sản phẩm

```http
GET /products
GET /products?categoryId=uuid
GET /products?minPrice=10000&maxPrice=50000
```

**Response 200:**
```json
[
  {
    "id": "uuid",
    "categoryId": "uuid-cat",
    "sku": "SP000001",
    "name": "Lemon Juice",
    "description": null,
    "imageUrl": null,
    "price": "15000.00",
    "costPrice": "7000.00",
    "unit": "ly",
    "isActive": true,
    "category": {
      "id": "uuid-cat",
      "name": "Đồ uống",
      "sortOrder": 1
    }
  }
]
```

> **Mapping FE `mockExamData.products`:** `sku` → `code`, `price` → `price`, `costPrice` → `cost`.
> Lưu ý: `stock` hiện không lưu trong bảng `products`, dùng API `/reports/inventory` để lấy tồn kho.

---

### 4.2 Sản phẩm kèm danh mục (dùng cho POS)

```http
GET /products/full
```

**Response 200:**
```json
[
  {
    "id": "uuid-cat",
    "name": "Đồ uống",
    "sortOrder": 1,
    "products": [ ... ]
  }
]
```

---

### 4.3 Danh sách danh mục

```http
GET /products/categories
```

---

## 5. Reports — Báo cáo

> Tất cả endpoint báo cáo đều dưới `/reports` và yêu cầu JWT.

---

### 5.1 Doanh thu tổng hợp

```http
GET /reports/revenue?from=2026-05-01&to=2026-05-31
GET /reports/revenue?from=2026-05-01&to=2026-05-31&branchId=uuid
```

**Query params:**

| Param | Kiểu | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `from` | `YYYY-MM-DD` | Không | Mặc định: 30 ngày trước |
| `to` | `YYYY-MM-DD` | Không | Mặc định: hôm nay |
| `branchId` | UUID | Không | Lọc theo chi nhánh |

**Response 200:**
```json
{
  "from": "2026-05-01T00:00:00.000Z",
  "to": "2026-05-31T23:59:59.999Z",
  "branchId": null,
  "orderCount": 120,
  "totalRevenue": 5400000,
  "totalDiscount": 200000,
  "refundCount": 3,
  "refundAmount": 150000,
  "netRevenue": 5250000,
  "paymentBreakdown": [
    { "method": "CASH", "count": 80, "amount": 3200000 },
    { "method": "WALLET", "count": 40, "amount": 2200000 }
  ]
}
```

---

### 5.2 Doanh thu theo ngày

```http
GET /reports/revenue/daily?from=2026-05-01&to=2026-05-31
```

**Response 200:**
```json
{
  "from": "2026-05-01T00:00:00.000Z",
  "to": "2026-05-31T23:59:59.999Z",
  "branchId": null,
  "data": [
    { "day": "2026-05-01", "orderCount": 15, "revenue": 675000 },
    { "day": "2026-05-02", "orderCount": 20, "revenue": 900000 }
  ]
}
```

---

### 5.3 Top sản phẩm bán chạy

> Tương ứng FE data: `topSelling` (productSaleData.js)

```http
GET /reports/top-products?from=2026-05-01&to=2026-05-31&limit=10
```

**Query params:**

| Param | Kiểu | Mặc định | Mô tả |
|-------|------|----------|-------|
| `from` | `YYYY-MM-DD` | 30 ngày trước | - |
| `to` | `YYYY-MM-DD` | Hôm nay | - |
| `branchId` | UUID | - | Lọc chi nhánh |
| `limit` | number | 10 | Số sản phẩm trả về (1–100) |

**Response 200:**
```json
[
  {
    "productId": "uuid",
    "productName": "BÁNH OREO",
    "totalQuantity": 350,
    "totalRevenue": 1750000
  },
  {
    "productId": "uuid",
    "productName": "NƯỚC SUỐI",
    "totalQuantity": 200,
    "totalRevenue": 2000000
  }
]
```

> **Mapping FE `topSelling`:** Dùng `productName` → `name`, `totalQuantity` → `value` (hoặc tính %).

---

### 5.4 Sản phẩm bán chậm

> Tương ứng FE data: `lowSelling` (productSaleData.js)

```http
GET /reports/bottom-products?from=2026-05-01&to=2026-05-31&limit=10
```

**Query params:** Giống `top-products`.

**Response 200:** Giống `top-products`, nhưng sắp xếp `totalQuantity` ASC (ít nhất trước).

```json
[
  {
    "productId": "uuid",
    "productName": "KẸO DẺO",
    "totalQuantity": 5,
    "totalRevenue": 75000
  }
]
```

---

### 5.5 Báo cáo cuối ngày

> Tương ứng FE data: `reportDataEndDay.js`

```http
GET /reports/end-of-day?from=2026-05-07&to=2026-05-07
GET /reports/end-of-day?from=2026-05-01&to=2026-05-31&branchId=uuid
```

**Response 200:**
```json
{
  "from": "2026-05-07T00:00:00.000Z",
  "to": "2026-05-07T23:59:59.999Z",
  "branchId": null,
  "data": [
    {
      "date": "2026-05-07",
      "code": "SP001",
      "name": "Bánh mì xúc xích",
      "price": 20000,
      "qty": 3,
      "total": 60000,
      "gross": 60000,
      "tax": 6000,
      "net": 54000
    },
    {
      "date": "2026-05-07",
      "code": "SP002",
      "name": "Sữa tươi",
      "price": 15000,
      "qty": 5,
      "total": 75000,
      "gross": 75000,
      "tax": 7500,
      "net": 67500
    }
  ]
}
```

> **Lưu ý:** `tax` = 10% của `total`, `net` = 90% của `total`. Điều chỉnh thuế suất ở BE nếu cần.

**Mapping FE `reportData`:**

| FE field | BE field |
|----------|----------|
| `date` | `date` |
| `code` | `code` (sku sản phẩm) |
| `name` | `name` |
| `price` | `price` |
| `qty` | `qty` |
| `total` | `total` |
| `gross` | `gross` |
| `tax` | `tax` |
| `net` | `net` |

---

### 5.6 Báo cáo tồn kho

> Tương ứng FE data: `productInventoryData.js`, `productSaleReportData.js`

```http
GET /reports/inventory
GET /reports/inventory?branchId=uuid
```

**Response 200:**
```json
{
  "branchId": null,
  "data": [
    {
      "inventoryItemId": "uuid",
      "name": "BÁNH OREO",
      "unit": "GÓI",
      "quantity": 50,
      "branchId": "uuid-branch",
      "updatedAt": "2026-05-07T10:00:00.000Z"
    },
    {
      "inventoryItemId": "uuid",
      "name": "NƯỚC SUỐI AQUAFINA",
      "unit": "CHAI",
      "quantity": 40,
      "branchId": "uuid-branch",
      "updatedAt": "2026-05-07T10:00:00.000Z"
    }
  ]
}
```

> **Mapping FE `productInventoryData`:** `name` → `name`, `unit` → `unit`, `quantity` → `stockEnd` (tồn hiện tại). Các trường `week1..week6`, `totalImport`, `warning`, `order` là logic FE tính từ `stock_transactions` — có thể mở rộng API sau.

---

### 5.7 Tổng kết ca làm việc

```http
GET /reports/shifts/:shiftId/summary
```

**Response 200:**
```json
{
  "shift": {
    "id": "uuid",
    "branchId": "uuid",
    "cashierId": "uuid",
    "openedAt": "2026-05-07T06:00:00.000Z",
    "closedAt": "2026-05-07T14:00:00.000Z",
    "status": "CLOSED",
    "openingCash": 500000,
    "closingCash": 1200000
  },
  "orders": {
    "count": 45,
    "totalRevenue": 1800000,
    "cashRevenue": 900000,
    "walletRevenue": 900000,
    "otherRevenue": 0
  },
  "cashMovements": {
    "cashIn": 200000,
    "cashOut": 0,
    "items": []
  },
  "expectedCash": 1600000,
  "differenceCash": -400000
}
```

---

## Error Responses

| Status | Ý nghĩa |
|--------|---------|
| 400 | Dữ liệu không hợp lệ (validation failed) |
| 401 | Chưa đăng nhập / token hết hạn |
| 403 | Không có quyền |
| 404 | Không tìm thấy resource |
| 500 | Lỗi server |

**Format lỗi chung:**
```json
{
  "statusCode": 404,
  "message": "Employee not found",
  "error": "Not Found"
}
```

---

## Enums tham khảo

```ts
type EmployeeStatus = 'working' | 'quit';

type ShiftType = 'morning' | 'afternoon' | 'full';

type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN' | 'STAFF';
```

---

## Tóm tắt nhanh — API Map

| FE Data File | API Endpoint | Method |
|--------------|-------------|--------|
| `employeeData.js` | `/employees` | GET |
| `employeeData.js` | `/employees` | POST |
| `employeeData.js` | `/employees/:id` | PUT / DELETE |
| `timeSheetData.js` | `/work-schedules/timesheet?from=&to=` | GET |
| `workScheduleData.js` | `/work-schedules/monthly?year=&month=` | GET |
| `workScheduleData.js` | `/work-schedules` | POST |
| `workScheduleData.js` | `/work-schedules/:id` | DELETE |
| `mockExamData.js` (products) | `/products` | GET |
| `productSaleData.js` (topSelling) | `/reports/top-products` | GET |
| `productSaleData.js` (lowSelling) | `/reports/bottom-products` | GET |
| `reportDataEndDay.js` | `/reports/end-of-day` | GET |
| `productInventoryData.js` | `/reports/inventory` | GET |
| `productSaleReportData.js` | `/reports/inventory` | GET |
