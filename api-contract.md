# API Contract

## Parent Home

Endpoint gom data cho man Home phu huynh/hoc sinh.

```http
GET /api/parent/home
Authorization: Bearer <accessToken>
```

### Response 200

```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "user": {
      "id": "39a7e314-c4d4-43f1-90d5-08ce8d56dc39",
      "fullName": "Test Student 5000",
      "avatarUrl": null
    },
    "wallet": {
      "balance": 0
    },
    "notifications": [],
    "todayOrder": null,
    "recentHistory": [
      {
        "id": "c802f7f9-8750-4769-8a3e-bb319066424c",
        "type": "ORDER_PAYMENT",
        "title": "Thanh toan don hang",
        "amount": -5000,
        "status": "COMPLETED",
        "statusText": "Hoan thanh",
        "createdAt": "2026-05-26T01:27:36.147Z",
        "orderId": "5a1118e7-d887-4d63-bfe3-0dca43532799"
      }
    ],
    "statistics": {
      "week": {
        "spent": 10000,
        "limit": 50000
      },
      "month": {
        "spent": 15000,
        "limit": 50000
      }
    }
  }
}
```

### Field Notes

- Response thanh cong duoc boc trong wrapper `success`, `message`, `data`.
- `data.user.avatarUrl`: co the la `null` neu hoc sinh chua co avatar.
- `data.wallet.balance`: so du hien tai cua vi, kieu number.
- `data.notifications`: danh sach thong bao gan nhat cho man Home, co the rong.
- `data.todayOrder`: tra `null` neu hom nay chua co order.
- `data.recentHistory`: danh sach giao dich gan nhat cho man Home, co the rong.
- `data.statistics.week.limit` va `data.statistics.month.limit`: dung de tinh thanh progress.
- `createdAt` va `orderedAt`: tra ISO datetime. API hien co the tra UTC dang `Z`.
- Frontend se format tien, ngay, gio va text hien thi.

### Enums

```ts
type OrderStatus = "PENDING" | "PREPARING" | "READY" | "RECEIVED" | "CANCELLED";

type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

type NotificationType =
  | "ORDER_CREATED"
  | "ORDER_RECEIVED"
  | "PAYMENT_DEDUCTED"
  | "TOPUP_SUCCESS"
  | "SYSTEM";

type TransactionType = "ORDER_PAYMENT" | "TOPUP" | "REFUND";
```

### Error Response

```json
{
  "message": "Unauthorized",
  "error": "UNAUTHORIZED",
  "statusCode": 401
}
```
