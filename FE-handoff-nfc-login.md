# FE Handoff: Dang nhap bang NFC card

Base path: `/auth`

Xac thuc:

- Khong can token

## 1. API dang nhap bang cardId

Endpoint:

```http
POST /auth/login
Content-Type: application/json
```

Muc dich:

- FE gui `cardId` doc tu NFC card.
- Backend tim user co `user.nfcId` trung voi `cardId`.
- Neu tim thay user, backend tao JWT va luu token nhu cac API dang nhap hien co.
- Response co cung shape voi login thuong de FE co the reuse auth flow hien tai.

Request body:

```json
{
  "cardId": "04AABBCCDD"
}
```

Danh sach field:

| Truong   | Bat buoc | Kieu     | Ghi chu                          |
| -------- | -------- | -------- | -------------------------------- |
| `cardId` | Co       | `string` | ID doc tu NFC card, se duoc trim |

Vi du response thanh cong:

```json
{
  "accessToken": "<jwt_token>",
  "userId": "7233abe3-1961-4af5-a482-542f1227d844",
  "userType": "STUDENT",
  "deviceId": "04AABBCCDD"
}
```

Luu y response:

- `accessToken` la JWT dung cho header `Authorization: Bearer <accessToken>` o cac API can dang nhap.
- `deviceId` trong response hien duoc set bang `cardId` de giu cung format voi login username/password.
- `userType` co the la `ADMIN`, `TEACHER`, hoac `STUDENT` tuy user duoc gan NFC card.

## 2. Xu ly loi

| Ma HTTP | Truong hop                                     | FE nen lam gi                              |
| ------- | ---------------------------------------------- | ------------------------------------------ |
| `400`   | Thieu `cardId` hoac `cardId` rong sau khi trim | Yeu cau quet lai the                       |
| `401`   | Khong co user nao duoc gan voi `cardId` nay    | Hien thong bao the chua duoc gan tai khoan |

## 3. Flow de xuat cho FE

1. Doc NFC card lay `cardId`.
2. Goi `POST /auth/login` voi body `{ "cardId": "<cardId>" }`.
3. Neu thanh cong, luu `accessToken`, `userId`, `userType`, `deviceId` nhu login thuong.
4. Gan header `Authorization: Bearer <accessToken>` cho cac request tiep theo.
