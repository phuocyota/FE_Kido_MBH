# API Contract - FE Kido MBH

Version: draft  
Base URL: `{{API_BASE_URL}}`  
Auth: `Authorization: Bearer <accessToken>` for all private APIs unless noted.

## Response Envelope

Use one response format consistently:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Sai tài khoản hoặc mật khẩu",
  "errorCode": "INVALID_CREDENTIALS"
}
```

Pagination:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 100,
  "totalPages": 5
}
```

## Shared Models

### Student

```json
{
  "id": "u_001",
  "studentCode": "HS001",
  "cardId": "123456789",
  "name": "Nguyễn Văn A",
  "avatarUrl": "https://...",
  "school": "THPT Nguyễn Trãi",
  "className": "12A1",
  "balance": 50000,
  "status": "active"
}
```

### Product

```json
{
  "id": "p_001",
  "code": "SP000001",
  "name": "Trà sữa",
  "category": "Nước",
  "menuType": "Đồ uống",
  "itemType": "Hàng hóa thường",
  "price": 20000,
  "cost": 10000,
  "stock": 100,
  "imageUrl": "https://...",
  "isActive": true
}
```

### Order

```json
{
  "id": "o_001",
  "orderNumber": 1,
  "studentId": "u_001",
  "studentName": "Nguyễn Văn A",
  "cardId": "123456789",
  "items": [
    {
      "productId": "p_001",
      "name": "Trà sữa",
      "price": 20000,
      "quantity": 2,
      "note": "Ít đá"
    }
  ],
  "total": 40000,
  "status": "pending",
  "paymentMethod": "card",
  "pickupType": "now",
  "isRefunded": false,
  "cancelReason": null,
  "createdAt": "2026-05-26T09:00:00+07:00",
  "updatedAt": "2026-05-26T09:00:00+07:00"
}
```

Enums:

- `order.status`: `cash`, `pending`, `done`, `cancelled`
- `order.paymentMethod`: `card`, `cash`, `momo`, `vnpay`
- `order.pickupType`: `now`, `break_time`, `after_school`
- `student.status`: `active`, `inactive`, `blocked`

## Auth

### POST `/auth/login/student`

Current FE already calls this endpoint.

Request:

```json
{
  "username": "HS001",
  "password": "123456",
  "deviceId": "device-12345"
}
```

Response:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "userId": "u_001",
    "role": "student"
  }
}
```

### POST `/auth/login/admin`

Replaces hardcoded admin login `123/123`.

Request:

```json
{
  "username": "admin",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "userId": "admin_001",
    "role": "admin"
  }
}
```

## Students / Card Scan

### GET `/students/{id}`

Current FE has `GET /users/{id}`. Prefer aligning to `/students/{id}` or keep `/users/{id}` if BE already uses users.

Response:

```json
{
  "success": true,
  "data": {
    "id": "u_001",
    "studentCode": "HS001",
    "cardId": "123456789",
    "name": "Nguyễn Văn A",
    "avatarUrl": "https://...",
    "school": "THPT Nguyễn Trãi",
    "className": "12A1",
    "balance": 50000,
    "status": "active"
  }
}
```

### GET `/students/by-card/{cardId}`

Replaces `studentsMock` random student on card scan.

Response:

```json
{
  "success": true,
  "data": {
    "id": "u_001",
    "studentCode": "HS001",
    "cardId": "123456789",
    "name": "Nguyễn Văn A",
    "avatarUrl": "https://...",
    "school": "THPT Nguyễn Trãi",
    "className": "12A1",
    "balance": 50000,
    "status": "active"
  }
}
```

## Products / Menu

### GET `/products`

Replaces `mockExamData.products` and hardcoded student order products.

Query:

- `page`: number, default `1`
- `pageSize`: number, default `20`
- `keyword`: optional, searches `code`, `name`
- `category`: optional
- `menuType`: optional
- `itemType`: optional
- `isActive`: optional boolean

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "p_001",
        "code": "SP000001",
        "name": "Trà sữa",
        "category": "Nước",
        "menuType": "Đồ uống",
        "itemType": "Hàng hóa thường",
        "price": 20000,
        "cost": 10000,
        "stock": 100,
        "imageUrl": "https://...",
        "isActive": true
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

### GET `/product-categories`

Replaces hardcoded category/group filters.

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "cat_001",
      "name": "Nước",
      "type": "menu"
    },
    {
      "id": "grp_001",
      "name": "TEA",
      "type": "group"
    }
  ]
}
```

### POST `/products`

Used by admin "Thêm mới".

Request:

```json
{
  "code": "SP000001",
  "name": "Trà sữa",
  "category": "Nước",
  "menuType": "Đồ uống",
  "itemType": "Hàng hóa thường",
  "price": 20000,
  "cost": 10000,
  "stock": 100,
  "imageUrl": "https://...",
  "isActive": true
}
```

### PUT `/products/{id}`

Same fields as create. Used by product edit and price book update.

## Orders

### POST `/orders`

Replaces `localStorage("orders")` creation in student order page.

Request:

```json
{
  "studentId": "u_001",
  "cardId": "123456789",
  "items": [
    {
      "productId": "p_001",
      "quantity": 2,
      "note": "Ít đá"
    }
  ],
  "paymentMethod": "card",
  "pickupType": "now"
}
```

Response:

```json
{
  "success": true,
  "message": "Tạo đơn thành công",
  "data": {
    "id": "o_001",
    "orderNumber": 1,
    "studentId": "u_001",
    "studentName": "Nguyễn Văn A",
    "cardId": "123456789",
    "items": [
      {
        "productId": "p_001",
        "name": "Trà sữa",
        "price": 20000,
        "quantity": 2,
        "note": "Ít đá"
      }
    ],
    "total": 40000,
    "status": "pending",
    "paymentMethod": "card",
    "pickupType": "now",
    "isRefunded": false,
    "createdAt": "2026-05-26T09:00:00+07:00"
  }
}
```

Rules:

- If `paymentMethod = card`, BE deducts student balance atomically.
- If insufficient balance, return `success=false`, `errorCode=INSUFFICIENT_BALANCE`.
- If `paymentMethod = cash`, order status should be `cash`.

### GET `/orders`

Used by kitchen, parent history, admin history.

Query:

- `page`, `pageSize`
- `studentId`: optional
- `cardId`: optional
- `status`: optional, comma-separated allowed: `cash,pending,done,cancelled`
- `paymentMethod`: optional
- `fromDate`: `YYYY-MM-DD`
- `toDate`: `YYYY-MM-DD`

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 20,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

### GET `/orders/by-card/{cardId}/active`

Used by kitchen card scan to find active order.

Response:

```json
{
  "success": true,
  "data": {
    "id": "o_001",
    "orderNumber": 1,
    "studentName": "Nguyễn Văn A",
    "cardId": "123456789",
    "items": [],
    "total": 40000,
    "status": "pending",
    "paymentMethod": "card",
    "pickupType": "now"
  }
}
```

If not found:

```json
{
  "success": false,
  "message": "Sai thẻ học sinh hoặc không có đơn",
  "errorCode": "ORDER_NOT_FOUND"
}
```

### PATCH `/orders/{id}/status`

Used by kitchen to move order through `cash`, `pending`, `done`, `cancelled`.

Request:

```json
{
  "status": "done",
  "cancelReason": null
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "o_001",
    "status": "done",
    "isRefunded": false,
    "updatedAt": "2026-05-26T09:10:00+07:00"
  }
}
```

Rules:

- When status becomes `cancelled` and payment was `card`, BE refunds balance once.
- Cancel can be limited by BE rule, for example within 15 minutes after `createdAt`.

### DELETE `/orders/{id}`

Optional, replaces local remove action in kitchen.

## Parent Wallet / Topup

### GET `/students/{id}/wallet`

Response:

```json
{
  "success": true,
  "data": {
    "studentId": "u_001",
    "balance": 50000
  }
}
```

### POST `/students/{id}/topups`

Request:

```json
{
  "amount": 100000,
  "method": "momo",
  "returnUrl": "https://fe.example.com/topup/result"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "transactionId": "topup_001",
    "amount": 100000,
    "method": "momo",
    "status": "pending",
    "paymentUrl": "https://payment-gateway/..."
  }
}
```

### GET `/students/{id}/topups`

Query: `page`, `pageSize`, `fromDate`, `toDate`, `status`.

## Dashboard / Reports

### GET `/dashboard/summary`

Replaces hardcoded `Summary`.

Query:

- `date`: `YYYY-MM-DD`, default today

Response:

```json
{
  "success": true,
  "data": {
    "completedOrders": 3,
    "revenue": 8031000,
    "yesterdayRevenue": 1512000,
    "servingOrders": 0,
    "customers": 7,
    "yesterdayCustomers": 8
  }
}
```

### GET `/dashboard/sales-chart`

Replaces hardcoded `SalesChart`.

Query:

- `range`: `today`, `yesterday`, `last7days`, `thisMonth`, `lastMonth`
- `groupBy`: `hour`, `day`, `weekday`

Response:

```json
{
  "success": true,
  "data": {
    "title": "DOANH SỐ THÁNG TRƯỚC",
    "totalRevenue": 43575000,
    "labels": ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    "values": [9000000, 1500000, 4000000, 14000000, 4500000, 3500000, 5500000]
  }
}
```

### GET `/dashboard/top-products`

Replaces hardcoded `TopProducts`.

Query:

- `range`: `today`, `yesterday`, `last7days`, `thisMonth`, `lastMonth`
- `mode`: `quantity`, `revenue`
- `limit`: default `10`

Response:

```json
{
  "success": true,
  "data": [
    {
      "productId": "p_001",
      "name": "Trà sữa",
      "value": 58
    }
  ]
}
```

If `mode=revenue`, `value` is amount in VND.

### GET `/dashboard/recent-activities`

Replaces hardcoded `RecentActivities`.

Query:

- `limit`: default `20`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "act_001",
      "type": "sale",
      "user": "Hương - Kế Toán",
      "text": "vừa bán đơn hàng",
      "amount": 300000,
      "createdAt": "2026-05-26T09:00:00+07:00"
    }
  ]
}
```

### GET `/reports/student-spending`

Replaces parent `Stats` mock order calculations.

Query:

- `studentId`: required
- `filter`: `today`, `week`, `month`, `7days`, `30days`, `custom`
- `fromDate`: required if custom
- `toDate`: required if custom

Response:

```json
{
  "success": true,
  "data": {
    "totalMoney": 120000,
    "totalOrders": 5,
    "avgPerDay": 17142.86,
    "chart": {
      "labels": ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      "values": [10000, 20000, 0, 30000, 40000, 20000, 0]
    },
    "topFoods": [
      {
        "name": "Trà sữa",
        "quantity": 3
      }
    ]
  }
}
```

## Inventory / Stock Takes

### GET `/stock-takes`

Replaces empty mock table in stock takes.

Query:

- `page`, `pageSize`
- `keyword`: stock take code or product code/name
- `status`: optional
- `fromDate`, `toDate`

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "st_001",
        "code": "KK000001",
        "createdAt": "2026-05-26T09:00:00+07:00",
        "balancedAt": "2026-05-26T10:00:00+07:00",
        "totalDifference": 100000,
        "increaseQty": 5,
        "decreaseQty": 2,
        "note": "",
        "status": "completed"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

### POST `/stock-takes`

Request:

```json
{
  "note": "Kiểm kho cuối ngày",
  "items": [
    {
      "productId": "p_001",
      "actualQty": 95,
      "note": ""
    }
  ]
}
```

## File Upload

### POST `/upload/single`

Current FE already defines this endpoint for avatar upload.

Request: `multipart/form-data`

- `file`: binary

Response:

```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "fileName": "avatar.png",
    "mimeType": "image/png",
    "size": 123456
  }
}
```

## Current Mock Replacement Map

| FE file | Current mock/local data | API replacement |
| --- | --- | --- |
| `src/pages/Student/Welcome.jsx` | `studentsMock` random scan | `GET /students/by-card/{cardId}` |
| `src/pages/Student/Order.jsx` | hardcoded `products`, `localStorage("orders")` | `GET /products`, `POST /orders` |
| `src/pages/Staff/Kitchen.jsx` | `localStorage("orders")`, `localStorage("students")` | `GET /orders`, `GET /orders/by-card/{cardId}/active`, `PATCH /orders/{id}/status` |
| `src/pages/Parent/History.jsx` | hardcoded `ordersData` | `GET /orders?studentId=...` |
| `src/pages/Parent/Stats.jsx` | `mockOrders` | `GET /reports/student-spending` |
| `src/components/Home/Summary.jsx` | hardcoded numbers | `GET /dashboard/summary` |
| `src/components/Home/SalesChart.jsx` | hardcoded chart data | `GET /dashboard/sales-chart` |
| `src/components/Home/TopProducts.jsx` | hardcoded top products | `GET /dashboard/top-products` |
| `src/components/Home/RecentActivities.jsx` | hardcoded activity list | `GET /dashboard/recent-activities` |
| `src/components/Products/TableProduct.jsx` | `mockExamData.products` | `GET /products` |
| `src/components/PriceBook/TablePrice.jsx` | `mockExamData.products` | `GET /products`, `PUT /products/{id}` |
| `src/components/StockTakes/TableStock.jsx` | empty sample data | `GET /stock-takes` |
| `src/pages/Admin/Login.jsx` | hardcoded `123/123` | `POST /auth/login/admin` |

