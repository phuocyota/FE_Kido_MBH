# API Contract: Đầu Vào, Đầu Ra Và Vị Trí Gọi API

Tài liệu này mô tả các API cần có để thay thế `localStorage` và mock data trong luồng canteen hiện tại. Frontend chỉ nên giữ state tạm thời cho UI, còn dữ liệu thật, tính tiền, trừ tiền, hoàn tiền, sinh số thứ tự và trạng thái đơn hàng phải do backend quản lý.

## 1. Quy Ước Chung

### Base URL

Frontend nên cấu hình qua `.env`:

```env
VITE_API_BASE_URL=https://your-api-domain.vn
```

### Authentication

Các request cần đăng nhập gửi kèm:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Thống nhất token key ở frontend:

```text
accessToken
```

Không dùng lẫn lộn các key hiện tại:

```text
access_token
token
accessToken
```

### Response Thành Công

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

### Response Lỗi

```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "errorCode": "ERROR_CODE",
  "details": {}
}
```

## 2. Auth Admin/Staff

### `POST /auth/login`

Gọi ở:

```text
src/pages/Admin/Login.jsx -> handleLogin
```

Thay cho:

```text
Hardcode username/password 123
localStorage.isLogin = "true"
```

Request:

```json
{
  "username": "123",
  "password": "123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "u01",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

Frontend xử lý:

```js
localStorage.setItem("accessToken", response.data.accessToken);
navigate("/");
```

### `GET /auth/me`

Gọi ở:

```text
src/App.jsx hoặc auth provider
src/components/layout/Header.jsx nếu cần hiển thị user menu
```

Mục đích:

```text
Kiểm tra phiên đăng nhập khi reload app.
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "u01",
    "name": "Admin",
    "role": "admin"
  }
}
```

### `POST /auth/logout`

Gọi ở:

```text
Header.jsx -> nút đăng xuất
```

Response:

```json
{
  "success": true,
  "message": "Đã đăng xuất"
}
```

## 3. Nhận Diện Học Sinh

### Luồng quét thẻ học sinh

```text
Mỗi thẻ học sinh có một mã riêng in/gắn trên thẻ.
Mỗi lần máy quét đọc được mã thẻ, frontend gọi API này để hỏi backend mã đó thuộc học sinh nào.
Frontend không tự đoán học sinh, không chọn học sinh mock, không lưu danh sách học sinh ở localStorage để tự tìm.
```

Ví dụ:

```text
Quét thẻ có mã 30001
-> GET /students/by-card/30001
-> Backend trả về học sinh Nguyễn Văn A
-> Frontend navigate sang /order với studentId = s01
```

### `GET /students/by-card/{cardId}`

Gọi ở:

```text
src/pages/Student/Welcome.jsx -> handleScan(data)
src/pages/Staff/Kitchen.jsx -> handleScan(cardId), nếu chỉ cần lấy thông tin học sinh
```

Thay cho:

```text
studentsMock
logic chọn ngẫu nhiên học sinh
localStorage.student
localStorage.students
```

Input path:

```text
cardId=30001
```

Luồng xử lý ở `Welcome.jsx`:

```text
1. Máy quét thẻ nhập chuỗi mã vào browser như bàn phím.
2. Frontend gom ký tự cho đến khi gặp Enter.
3. Frontend lấy buffer cuối cùng làm cardId.
4. Gọi GET /students/by-card/{cardId}.
5. Nếu backend trả về học sinh hợp lệ, chuyển sang màn /order với studentId.
6. Nếu backend báo không tìm thấy hoặc thẻ bị khóa, hiển thị lỗi và ở lại màn Welcome.
```

Response thành công:

```json
{
  "success": true,
  "data": {
    "id": "s01",
    "cardId": "30001",
    "name": "Nguyễn Văn A",
    "school": "Kido School",
    "className": "3A",
    "avatarUrl": "https://...",
    "balance": 120000,
    "active": true
  }
}
```

Response khi không tìm thấy mã thẻ:

```json
{
  "success": false,
  "message": "Không tìm thấy học sinh theo mã thẻ",
  "errorCode": "STUDENT_CARD_NOT_FOUND"
}
```

Response khi thẻ/học sinh bị khóa:

```json
{
  "success": false,
  "message": "Thẻ học sinh không còn hoạt động",
  "errorCode": "STUDENT_CARD_INACTIVE"
}
```

Frontend xử lý trong `Welcome.jsx`:

```js
navigate("/order", {
  state: {
    mode: "student",
    studentId: response.data.id
  }
});
```

Không nên truyền nguyên object `student` qua router state. Màn `/order` nên nhận `studentId` rồi gọi lại API để lấy số dư mới nhất.

### `GET /students/{studentId}`

Gọi ở:

```text
src/pages/Student/Order.jsx -> useEffect khi vào màn bằng studentId
```

Thay cho:

```text
location.state.student object
localStorage.student
localStorage.students
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "s01",
    "cardId": "30001",
    "name": "Nguyễn Văn A",
    "school": "Kido School",
    "className": "3A",
    "avatarUrl": "https://...",
    "balance": 120000
  }
}
```

Frontend xử lý:

```text
setStudent(response.data)
Hiển thị tên, lớp, trường, avatar, số dư trên Header order.
```

### `POST /students/verify-face`

Gọi ở:

```text
src/components/FaceId/FaceVerify.tsx
```

Thay cho:

```text
faceApi.login cũ nếu endpoint khác contract
mock balance/avatar/school/class trong FaceVerify
localStorage.access_token
```

Request:

```json
{
  "descriptor": [0.012, -0.034, 0.056]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "face-session-token",
    "student": {
      "id": "s01",
      "cardId": "30001",
      "name": "Nguyễn Văn A",
      "school": "Kido School",
      "className": "3A",
      "avatarUrl": "https://...",
      "balance": 120000
    }
  }
}
```

Frontend xử lý trong `FaceVerify.tsx`:

```js
localStorage.setItem("accessToken", response.data.accessToken);
onSuccess(response.data.student);
```

Frontend xử lý trong `Welcome.jsx`:

```js
navigate("/order", {
  state: {
    mode: "student",
    studentId: student.id
  }
});
```

### `POST /students/register-face`

Gọi ở:

```text
src/components/FaceId/RegisterFace.tsx
```

Request:

```json
{
  "studentId": "s01",
  "descriptor": [0.012, -0.034, 0.056]
}
```

Response:

```json
{
  "success": true,
  "message": "Đã đăng ký khuôn mặt"
}
```

## 4. QR Tiền

### `POST /payment-qr/verify`

Gọi ở:

```text
src/pages/Student/Welcome.jsx -> handleScan(data)
```

Thay cho:

```text
logic Number(data) <= 20000
localStorage.amount
```

Request:

```json
{
  "code": "123456"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "qrSessionId": "qr-session-01",
    "type": "money",
    "amount": 50000,
    "remaining": 50000,
    "expiresAt": "2026-05-12T10:30:00.000Z"
  }
}
```

Frontend xử lý:

```js
navigate("/order", {
  state: {
    mode: "qr_money",
    qrSessionId: response.data.qrSessionId
  }
});
```

### `GET /payment-qr/sessions/{qrSessionId}`

Gọi ở:

```text
src/pages/Student/Order.jsx -> useEffect khi vào màn bằng qrSessionId
```

Mục đích:

```text
Lấy lại số tiền QR khi reload /order hoặc khi cần đồng bộ số tiền còn lại.
```

Response:

```json
{
  "success": true,
  "data": {
    "qrSessionId": "qr-session-01",
    "amount": 50000,
    "remaining": 50000,
    "expiresAt": "2026-05-12T10:30:00.000Z",
    "status": "active"
  }
}
```

## 5. Category Và Product

### `GET /categories`

Gọi ở:

```text
src/pages/Student/Order.jsx -> useEffect khi mount
```

Thay cho:

```text
categories hardcode trong Order.jsx
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "cat-food",
      "name": "Đồ ăn",
      "sortOrder": 1,
      "active": true
    }
  ]
}
```

Frontend xử lý:

```text
setCategories(response.data)
setSelectedCategory(response.data[0]?.id)
Truyền categories xuống src/components/Order/Left.jsx
```

### `GET /products`

Gọi ở:

```text
src/pages/Student/Order.jsx -> useEffect khi selectedCategory/search thay đổi
```

Thay cho:

```text
products hardcode trong Order.jsx
filter category/search ở frontend
```

Query:

```text
categoryId=cat-food
search=banh
available=true
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "p01",
      "code": "SP001",
      "name": "Bánh mì",
      "categoryId": "cat-food",
      "price": 15000,
      "imageUrl": "https://...",
      "available": true,
      "stockQuantity": 30
    }
  ]
}
```

Frontend xử lý:

```text
setProducts(response.data)
Truyền products xuống src/components/Order/Left.jsx
```

Nếu đang thanh toán bằng QR tiền, frontend có thể ẩn hoặc disable món vượt quá `remaining`, nhưng backend vẫn phải validate lại khi tạo đơn.

### `GET /products/{productId}`

Chỉ cần dùng khi có màn chi tiết món hoặc cần lấy lại một sản phẩm riêng lẻ.

Response:

```json
{
  "success": true,
  "data": {
    "id": "p01",
    "code": "SP001",
    "name": "Bánh mì",
    "categoryId": "cat-food",
    "price": 15000,
    "imageUrl": "https://...",
    "available": true,
    "stockQuantity": 30
  }
}
```

## 6. Tạo Đơn Hàng

### `POST /orders`

Gọi ở:

```text
Khuyến nghị: src/pages/Student/Order.jsx -> handleSubmitOrder
src/components/Order/Right.jsx chỉ emit event confirm lên Order.jsx
```

Thay cho:

```text
localStorage.orders
localStorage.orderNumber
localStorage.student balance update
localStorage.students balance update
```

Request thanh toán bằng thẻ:

```json
{
  "studentId": "s01",
  "paymentMethod": "card",
  "receiveType": "take_now",
  "items": [
    {
      "productId": "p01",
      "quantity": 2,
      "note": "Ít cay"
    }
  ]
}
```

Request thanh toán bằng QR tiền:

```json
{
  "qrSessionId": "qr-session-01",
  "paymentMethod": "qr_money",
  "receiveType": "take_now",
  "items": [
    {
      "productId": "p01",
      "quantity": 1,
      "note": ""
    }
  ]
}
```

Request thanh toán tiền mặt:

```json
{
  "studentId": "s01",
  "paymentMethod": "cash",
  "receiveType": "after_class",
  "items": [
    {
      "productId": "p01",
      "quantity": 1,
      "note": ""
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "o01",
    "orderNumber": 25,
    "studentId": "s01",
    "studentName": "Nguyễn Văn A",
    "paymentMethod": "card",
    "receiveType": "take_now",
    "status": "pending",
    "totalAmount": 30000,
    "remainingBalance": 90000,
    "createdAt": "2026-05-12T10:00:00.000Z",
    "items": [
      {
        "productId": "p01",
        "productName": "Bánh mì",
        "price": 15000,
        "quantity": 2,
        "note": "Ít cay",
        "lineTotal": 30000
      }
    ]
  }
}
```

Backend cần tự xử lý:

```text
Tính tổng tiền
Kiểm tra tồn kho
Kiểm tra số dư học sinh
Trừ tiền hoặc khóa QR session
Sinh orderNumber
Tạo trạng thái đầu tiên
```

Trạng thái đầu tiên mong muốn:

```text
card hoặc qr_money -> pending
cash -> cash
```

## 7. Kitchen Và Staff

### `GET /orders`

Gọi ở:

```text
src/pages/Staff/Kitchen.jsx -> useEffect khi mount
src/pages/Staff/Kitchen.jsx -> refetch mỗi 3-5 giây, hoặc thay bằng WebSocket/SSE sau này
```

Thay cho:

```text
localStorage.orders
setInterval đọc localStorage mỗi 1 giây
```

Query:

```text
status=cash,pending,done
date=2026-05-12
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "o01",
      "orderNumber": 25,
      "studentId": "s01",
      "studentName": "Nguyễn Văn A",
      "studentCardId": "30001",
      "paymentMethod": "card",
      "receiveType": "take_now",
      "status": "pending",
      "totalAmount": 30000,
      "canCancel": true,
      "cancelDeadline": "2026-05-12T10:15:00.000Z",
      "createdAt": "2026-05-12T10:00:00.000Z",
      "items": [
        {
          "productId": "p01",
          "productName": "Bánh mì",
          "price": 15000,
          "quantity": 2,
          "note": "Ít cay",
          "lineTotal": 30000
        }
      ]
    }
  ]
}
```

Frontend xử lý:

```text
setOrders(response.data)
cashOrders = orders.filter(status === "cash")
pendingOrders = orders.filter(status === "pending")
doneOrders = orders.filter(status === "done")
```

### `GET /orders/{orderId}`

Gọi khi cần mở chi tiết đơn từ modal hoặc từ route chi tiết sau này.

Response giống một item trong `GET /orders`, nhưng đầy đủ hơn nếu backend có thêm metadata.

### `GET /orders/active-by-card/{cardId}`

Gọi ở:

```text
src/pages/Staff/Kitchen.jsx -> handleScan(cardId)
```

Thay cho:

```text
Tìm đơn trong localStorage.orders theo studentId/cardId
```

Response khi có đơn:

```json
{
  "success": true,
  "data": {
    "id": "o01",
    "orderNumber": 25,
    "studentId": "s01",
    "studentName": "Nguyễn Văn A",
    "status": "done",
    "paymentMethod": "card",
    "totalAmount": 30000,
    "items": [
      {
        "productName": "Bánh mì",
        "quantity": 2,
        "note": "Ít cay"
      }
    ]
  }
}
```

Response khi không có đơn:

```json
{
  "success": false,
  "message": "Không có đơn đang hoạt động",
  "errorCode": "ACTIVE_ORDER_NOT_FOUND"
}
```

### `POST /orders/{orderId}/complete-payment`

Gọi ở:

```text
src/components/Staff/CashOrders.jsx -> onCompletePayment(orderId)
src/pages/Staff/Kitchen.jsx -> handleCompletePayment(orderId)
```

Mục đích:

```text
Xác nhận đã thu tiền mặt, chuyển đơn từ cash sang pending.
```

Request:

```json
{
  "paidAmount": 30000
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "o01",
    "status": "pending",
    "paymentStatus": "paid"
  }
}
```

### `PATCH /orders/{orderId}/status`

Gọi ở:

```text
src/components/Staff/PendingOrders.jsx -> onDone(orderId)
src/pages/Staff/Kitchen.jsx -> handleUpdateStatus(orderId, "done")
```

Mục đích:

```text
Chuyển đơn từ pending sang done khi bếp làm xong.
```

Request:

```json
{
  "status": "done"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "o01",
    "status": "done",
    "updatedAt": "2026-05-12T10:10:00.000Z"
  }
}
```

### `POST /orders/{orderId}/pickup`

Gọi ở:

```text
src/components/Staff/DoneOrders.jsx -> onPickup(orderId)
src/pages/Staff/Kitchen.jsx -> handlePickup(orderId)
```

Thay cho:

```text
Xóa đơn khỏi localStorage.orders
```

Request: không có body.

Response:

```json
{
  "success": true,
  "data": {
    "id": "o01",
    "status": "picked_up",
    "pickedUpAt": "2026-05-12T10:20:00.000Z"
  }
}
```

### `POST /orders/{orderId}/cancel`

Gọi ở:

```text
src/pages/Staff/Kitchen.jsx -> handleCancel(orderId, reason)
```

Thay cho:

```text
Set status cancelled trong localStorage.orders
refundToCard local
cộng tiền vào localStorage.students
```

Request:

```json
{
  "reason": "Học sinh đặt nhầm"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "o01",
    "status": "cancelled",
    "isRefunded": true,
    "refundAmount": 30000,
    "cancelReason": "Học sinh đặt nhầm",
    "cancelledAt": "2026-05-12T10:05:00.000Z"
  }
}
```

Frontend chỉ hiển thị kết quả hoàn tiền. Không tự cộng tiền ở frontend.

## 8. Số Dư Và Lịch Sử Giao Dịch

### `GET /students/{studentId}/transactions`

Gọi khi có màn lịch sử giao dịch hoặc cần xem chi tiết số dư.

Query:

```text
from=2026-05-01
to=2026-05-12
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "tx01",
      "type": "debit",
      "amount": 30000,
      "balanceAfter": 90000,
      "description": "Thanh toán đơn #25",
      "createdAt": "2026-05-12T10:00:00.000Z"
    }
  ]
}
```

## 9. Admin Product

### `GET /admin/products`

Gọi ở:

```text
src/pages/Admin/Products.jsx -> useEffect khi page/filter/search thay đổi
```

Thay cho:

```text
src/datas/mockExamData.js
TableProduct dùng mockExamData.products
```

Query:

```text
page=1
pageSize=22
search=banh
categoryId=cat-food
active=true
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "p01",
        "code": "SP001",
        "name": "Bánh mì",
        "categoryId": "cat-food",
        "categoryName": "Đồ ăn",
        "price": 15000,
        "costPrice": 10000,
        "stockQuantity": 30,
        "active": true
      }
    ],
    "page": 1,
    "pageSize": 22,
    "total": 100
  }
}
```

### `POST /admin/products`

Gọi ở:

```text
Products.jsx hoặc modal thêm sản phẩm
```

Request:

```json
{
  "code": "SP001",
  "name": "Bánh mì",
  "categoryId": "cat-food",
  "price": 15000,
  "costPrice": 10000,
  "imageUrl": "https://...",
  "active": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "p01"
  }
}
```

### `PATCH /admin/products/{productId}`

Gọi ở:

```text
Products.jsx hoặc modal sửa sản phẩm
```

Request:

```json
{
  "name": "Bánh mì thịt",
  "price": 18000,
  "active": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "p01"
  }
}
```

### `DELETE /admin/products/{productId}`

Gọi ở:

```text
Products.jsx -> nút xóa sản phẩm
```

Response:

```json
{
  "success": true,
  "message": "Đã xóa sản phẩm"
}
```

## 10. Admin Price Book

### `GET /admin/price-books`

Gọi ở:

```text
src/pages/Admin/PriceBook.jsx -> useEffect khi mount
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "pb01",
      "name": "Bảng giá canteen",
      "active": true,
      "createdAt": "2026-05-12T09:00:00.000Z"
    }
  ]
}
```

### `GET /admin/price-books/{priceBookId}/items`

Gọi ở:

```text
PriceBook.jsx -> khi chọn một bảng giá
TablePrice nhận items qua props
```

Thay cho:

```text
mockExamData.products trong TablePrice
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "productId": "p01",
      "productName": "Bánh mì",
      "currentPrice": 15000,
      "newPrice": 18000
    }
  ]
}
```

### `PATCH /admin/price-books/{priceBookId}/items`

Gọi ở:

```text
PriceBook.jsx -> handleSavePrices
```

Request:

```json
{
  "items": [
    {
      "productId": "p01",
      "price": 18000
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Đã cập nhật bảng giá"
}
```

## 11. Admin Stock Take

### `GET /admin/stock-takes`

Gọi ở:

```text
src/pages/Admin/StockTakes.jsx -> useEffect khi page/filter/date range thay đổi
```

Query:

```text
page=1
pageSize=20
status=draft
from=2026-05-01
to=2026-05-12
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "st01",
        "code": "KK001",
        "status": "draft",
        "createdAt": "2026-05-12T09:00:00.000Z",
        "createdBy": "Admin"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

### `POST /admin/stock-takes`

Gọi ở:

```text
StockTakes.jsx -> handleCreateStockTake
```

Request:

```json
{
  "note": "Kiểm kho đầu ngày"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "st01",
    "code": "KK001",
    "status": "draft"
  }
}
```

### `PATCH /admin/stock-takes/{stockTakeId}`

Gọi ở:

```text
StockTakes.jsx hoặc màn chi tiết phiếu kiểm kho sau này
```

Request:

```json
{
  "items": [
    {
      "productId": "p01",
      "actualQuantity": 28,
      "note": "Lệch 2"
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Đã cập nhật phiếu kiểm kho"
}
```

### `POST /admin/stock-takes/{stockTakeId}/complete`

Gọi ở:

```text
StockTakes.jsx hoặc màn chi tiết phiếu kiểm kho sau này
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "st01",
    "status": "completed"
  }
}
```

## 12. Component Nào Nên Gọi API

### Nên gọi API ở page/container

```text
Welcome.jsx
Order.jsx
Kitchen.jsx
Login.jsx
Products.jsx
PriceBook.jsx
StockTakes.jsx
```

Lý do:

```text
Dễ quản lý loading/error state
Dễ refetch sau khi mutation
Component con chỉ cần nhận props và emit event
```

### Không nên gọi API trực tiếp ở component con

```text
src/components/Order/Header.jsx
src/components/Order/Left.jsx
src/components/Order/Right.jsx
src/components/Staff/CashOrders.jsx
src/components/Staff/PendingOrders.jsx
src/components/Staff/DoneOrders.jsx
```

Các component này nên nhận props:

```text
data
loading
onSubmit
onCancel
onDone
onPickup
onSearchChange
onCategoryChange
```

## 13. Enum Cần Thống Nhất

### Payment Method

```text
card
cash
qr_money
```

### Receive Type

```text
take_now
break_time
after_class
```

Mapping UI hiện tại:

```text
Lấy liền    -> take_now
Ra chơi lấy -> break_time
Ra về lấy   -> after_class
```

### Order Status

```text
cash
pending
done
picked_up
cancelled
```

### Payment Status

```text
unpaid
paid
refunded
failed
```

## 14. LocalStorage Cần Loại Bỏ

```text
student       -> GET /students/{studentId}
students      -> backend student database
amount        -> POST /payment-qr/verify và GET /payment-qr/sessions/{qrSessionId}
orders        -> GET /orders, POST /orders, PATCH/POST order actions
orderNumber   -> backend tự sinh
isLogin       -> GET /auth/me và accessToken
access_token  -> accessToken
token         -> accessToken
```

## 15. Tóm Tắt Nhanh Theo File

```text
src/pages/Student/Welcome.jsx
  GET  /students/by-card/{cardId}
  POST /payment-qr/verify

src/components/FaceId/FaceVerify.tsx
  POST /students/verify-face

src/components/FaceId/RegisterFace.tsx
  POST /students/register-face

src/pages/Student/Order.jsx
  GET  /students/{studentId}
  GET  /payment-qr/sessions/{qrSessionId}
  GET  /categories
  GET  /products
  POST /orders

src/components/Order/Header.jsx
  Không gọi API, nhận data từ Order.jsx

src/components/Order/Left.jsx
  Không gọi API, nhận categories/products từ Order.jsx

src/components/Order/Right.jsx
  Khuyến nghị không gọi API, emit confirm lên Order.jsx

src/pages/Staff/Kitchen.jsx
  GET   /orders
  GET   /orders/active-by-card/{cardId}
  POST  /orders/{orderId}/complete-payment
  PATCH /orders/{orderId}/status
  POST  /orders/{orderId}/pickup
  POST  /orders/{orderId}/cancel

src/components/Staff/CashOrders.jsx
  Không gọi API, emit event lên Kitchen.jsx

src/components/Staff/PendingOrders.jsx
  Không gọi API, emit event lên Kitchen.jsx

src/components/Staff/DoneOrders.jsx
  Không gọi API, emit event lên Kitchen.jsx

src/pages/Admin/Login.jsx
  POST /auth/login

src/App.jsx hoặc auth provider
  GET /auth/me

src/pages/Admin/Products.jsx
  GET    /admin/products
  POST   /admin/products
  PATCH  /admin/products/{productId}
  DELETE /admin/products/{productId}

src/pages/Admin/PriceBook.jsx
  GET   /admin/price-books
  GET   /admin/price-books/{priceBookId}/items
  PATCH /admin/price-books/{priceBookId}/items

src/pages/Admin/StockTakes.jsx
  GET   /admin/stock-takes
  POST  /admin/stock-takes
  PATCH /admin/stock-takes/{stockTakeId}
  POST  /admin/stock-takes/{stockTakeId}/complete
```

## 16. Thứ Tự Tích Hợp Đề Xuất

1. Thống nhất API client và token `accessToken`.
2. `Welcome.jsx`: thay mock scan card/QR/face bằng API nhận diện.
3. `Order.jsx`: thay hardcode category/product bằng API.
4. `Order.jsx`: thay tạo đơn trong `localStorage.orders` bằng `POST /orders`.
5. `Kitchen.jsx`: thay poll `localStorage.orders` bằng `GET /orders`.
6. `Kitchen.jsx`: thay update/xóa/refund local bằng các API status/cancel/pickup.
7. Admin: nối product, price book, stock take sau khi luồng student/staff chạy ổn định.
