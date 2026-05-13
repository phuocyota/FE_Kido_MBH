# FE_Kido_MBH Overview

## 1. Tong quan

Day la frontend React/Vite cho mot ung dung canteen/truong hoc cua Kido. Source hien tai gom 3 nhom chuc nang chinh:

- Student: man hinh scan QR/NFC/Face ID, chon mon, tao don hang.
- Staff/Kitchen: man hinh bep/thu ngan de xu ly don theo trang thai.
- Admin: cac man hinh quan ly hang hoa, bang gia, kiem kho dang o muc UI/mock.

Ung dung dang dung nhieu du lieu local trong `localStorage` va mock data. Mot phan Face ID co goi backend that qua Axios.

## 2. Tech stack

- Build tool: Vite 7.
- UI: React 19.
- Routing: `react-router-dom` 7.
- Styling: Tailwind CSS 4 qua `@tailwindcss/vite`.
- Icon: `lucide-react`, `react-icons`.
- Chart: `chart.js`, `react-chartjs-2`, `recharts`.
- Date range: `react-date-range`, `date-fns`.
- Camera/Face/QR: `face-api.js`, `jsqr`, `html5-qrcode`.
- HTTP: `axios` va wrapper `window.fetch`.

Scripts trong `package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run deploy
```

## 3. Cau hinh runtime

### `vite.config.js`

Vite server dang cau hinh:

- `host: "0.0.0.0"`
- `port: 5173`
- `allowedHosts: true`
- Proxy `/api` toi `https://be.kidostudent.kidoedu.vn`, sau do rewrite bo prefix `/api`.

Plugin `basicSsl` dang import nhung bi comment trong danh sach plugin.

### `.env`

Hien co:

```env
VITE_TEST_ID=test
VITE_TEST_PASSWORD=123
VITE_USER_NAME=Nguyen Van A
```

API client moi trong `src/api/client.js` doc them:

- `VITE_API_URL`
- `VITE_API_BASE_URL`
- `VITE_API_PREFIX`

Nhung cac bien nay hien chua co trong `.env`.

## 4. Entry point va routes

### Entry point

`src/main.jsx` render app vao `#root`, boc `App` trong `BrowserRouter`, import global CSS va CSS cua `react-date-range`.

### Routes thuc te trong `src/App.jsx`

Routes hien dang mount:

- `/login`: `src/pages/Admin/Login.jsx`
- `/`: `src/pages/Student/Welcome.jsx`
- `/register`: `src/components/FaceId/RegisterFace.tsx`
- `/order`: `src/pages/Student/Order.jsx`
- `/kitchen`: `src/pages/Staff/Kitchen.jsx`

Luu y: cac page Admin nhu `Products`, `PriceBook`, `StockTakes` co file rieng nhung chua duoc mount trong `App.jsx`. Component layout `src/components/layout/Header.jsx` co menu toi `/products`, `/price-book`, `/stock-takes`, nhung header nay dang bi comment trong `App.jsx`, nen cac route admin do hien khong truy cap duoc qua router chinh.

## 5. Luong Student

### `src/pages/Student/Welcome.jsx`

Day la man vao dau tien cua student. Man hinh co 2 tab:

- QR/NFC card
- Face ID

Luang keyboard scan:

- Bat su kien `keydown`.
- Gom cac ky tu so vao buffer.
- Khi gap `Enter`, goi `handleScan(buffer)`.
- Neu data khong phai so thi alert QR khong hop le.

Logic `handleScan(data)`:

- Chon ngau nhien mot student mock tu `studentsMock`.
- Gan `cardId = data`.
- Neu `Number(data) <= 20000`: coi nhu QR tien va navigate sang `/order` voi state `{ type: "qr", amount }`.
- Neu lon hon 20000: coi nhu the hoc sinh va navigate sang `/order` voi state `{ type: "student", student }`.

Face/QR camera:

- Dung `FaceVerify`.
- Neu callback tra ve `{ type: "qr", value }`, tiep tuc xu ly nhu QR.
- Neu callback tra ve user face, navigate sang `/order` voi `type: "student"`.

### `src/pages/Student/Order.jsx`

Day la man chon mon va thanh toan.

Du lieu dau vao khi load:

- Uu tien `location.state`.
- Neu `state.type === "qr"`: set `amount`, `remaining`, khong set student.
- Neu `state.type === "student"`: set `student`.
- Neu reload trang: fallback doc `localStorage.student` hoac `localStorage.amount`.
- Neu khong co `student` va khong co `amount`: hien `Loading...`.

Du lieu san pham:

- Categories va products dang hardcode truc tiep trong file.
- Anh san pham import tu `src/assets`.
- Filter san pham theo category.
- Neu dang dung QR tien, chi hien san pham co `price <= amount`.

Gio hang:

- Click san pham de them vao gio.
- Neu dang dung QR tien, tru `remaining` khi them/tang so luong.
- Xoa/giam so luong se hoan lai `remaining`.
- Ho tro ghi chu tung item qua modal.

Thanh toan:

- Neu gio hang rong thi alert.
- Neu thanh toan bang the va `total > student.balance` thi alert khong du tien.
- Modal xac nhan cho chon:
  - Hinh thuc nhan: `Lay lien`, `Ra choi lay`, `Ra ve lay`
  - Thanh toan: `card` hoac `cash`
- Sau confirm:
  - Neu khong phai cash va co student: tru balance trong `localStorage.student` va `localStorage.students`.
  - Tao so thu tu bang `localStorage.orderNumber`.
  - Ghi don vao `localStorage.orders`.
  - Hien modal thanh cong va nut OK navigate ve `/`.

LocalStorage lien quan:

- `student`
- `students`
- `amount`
- `orders`
- `orderNumber`

### Components Order

`src/components/Order/Header.jsx`

- Hien banner chay ngang tu `header1.png` den `header4.png`.
- Neu QR tien: hien so tien con lai.
- Neu student: hien avatar, ten, truong, lop, balance.

`src/components/Order/Left.jsx`

- Hien category scroll ngang, search input, grid product.
- Search input hien chua co state/filter logic.
- Product card click de them vao cart.
- Nen pattern background bang `left_order.png`.

`src/components/Order/Right.jsx`

- Hien cart, tang/giam/xoa item, ghi chu, tong tien.
- Quan ly modal ghi chu, confirm order, success order.
- Sau success OK navigate ve `/`.

## 6. Luong Staff/Kitchen

### `src/pages/Staff/Kitchen.jsx`

Man hinh chia don thanh cac cot theo status:

- `cash`: don cho thanh toan tien mat.
- `pending`: don cho che bien.
- `done`: don da xong/cho lay.

Data source:

- Doc `localStorage.orders`.
- Poll lai moi 1 giay bang `setInterval`.

Scan the hoc sinh:

- Tuong tu Welcome, gom keyboard digits cho toi `Enter`.
- Tim don co `studentId === cardId` va `status !== "cancelled"`.
- Neu thay thi mo modal don.

Update order:

- `pending`: doi status sang `pending`.
- `done`: doi status sang `done`.
- `cancel`: doi status sang `cancelled`, set `isRefunded`, luu `cancelReason`.
- `remove`: xoa don khoi `localStorage.orders`.

Cancel/refund:

- Chi hien nut huy neu don `cash` hoac `pending` va con trong 15 phut tu `createdAt`.
- Don card se goi `refundToCard`, cong tien vao `localStorage.students`.
- Don cash hien alert tra tien mat.

### Components Staff

`CashOrders.jsx`

- Cot don tien mat.
- Moi card co nut chuyen don sang `pending`.

`PendingOrders.jsx`

- Cot don cho che bien.
- Moi card hien countdown 15 phut.
- Nut `Hoan thanh` chuyen status sang `done`.

`DoneOrders.jsx`

- Cot don da xong/cho lay.
- Nut `Nhan mon` goi callback xoa don.

## 7. Luong Admin

### `src/pages/Admin/Login.jsx`

Login co 2 tab:

- Tai khoan/mat khau.
- Face ID.

Tai khoan hardcode:

- Username: `123`
- Password: `123`

Login thanh cong:

- Set `localStorage.isLogin = "true"`.
- Toast thanh cong.
- Navigate ve `/`.

Face tab hien dang render `RegisterFace`, tuc la dang la dang ky face hon la verify/login face.

### `Products.jsx`

- Layout 2 cot: `SidebarFilter` va `TableProduct`.
- `TableProduct` dung `mockExamData.products`.
- Co pagination 22 item/page.
- Cac nut `Them moi`, `Import`, `Xuat file` hien chi la UI.
- Sidebar co cac filter UI va modal them/sua nhom hang, chua co logic filter that.

### `PriceBook.jsx`

- Layout 2 cot: `SidebarPrice` va `TablePrice`.
- `TablePrice` dung `mockExamData.products`.
- Gia moi la input trong bang nhung chua co logic save.
- Sidebar co modal them bang gia, hien chi la UI.

### `StockTakes.jsx`

- Layout 2 cot: `SidebarFilterStock` va `TableStock`.
- `TableStock` hien data rong va empty state.
- Sidebar co search, status filter, quick time filter, date range popup.

### `components/layout/Header.jsx`

Header admin/menu tong hop:

- Menu desktop co dropdown.
- Mobile sidebar.
- User menu dua tren `localStorage.isLogin`.

Hien component nay chua duoc dung trong `App.jsx`.

## 8. Face ID va QR camera

### Models

Model face-api nam trong `public/models`:

- `tiny_face_detector_model-*`
- `face_landmark_68_model-*`
- `face_recognition_model-*`

Vite se serve cac file nay tai `/models`.

### `FaceVerify.tsx`

Dung cho verify face hoac scan QR:

- Load models tu `/models`.
- Mo camera bang `navigator.mediaDevices.getUserMedia`.
- Mode `qr`: dung `jsQR` doc frame video.
- Mode `face`: detect face, check mat nam trong khung oval, lay descriptor, goi `faceApi.login`.
- Login thanh cong luu `access_token` vao `localStorage`.
- Callback `onSuccess` tra user data kem balance/avatar/school/class mock.

### `RegisterFace.tsx`

Dung cho dang ky face:

- Nguoi dung nhap ten.
- Mo camera, load face models.
- Check mat nam trong khung du 1.5 giay.
- Lay face descriptor va goi `faceApi.register(descriptor, name)`.
- Luu `token` vao `localStorage`.

## 9. API/service layer

Co 2 kieu API client song song.

### `src/service/api.ts`

Axios instance:

```ts
baseURL: "https://sales.kidoedu.vn"
```

Interceptor Authorization dang bi comment.

Dang duoc dung boi:

- `src/service/face.ts`
- `src/service/employee.ts`

### `src/service/face.ts`

- `POST /face/login`
- `POST /face/register`

### `src/service/employee.ts`

CRUD va truy van employee:

- `GET /employees`
- `POST /employees`
- `GET /employees?departmentId=...`
- `GET /employees/regions-by-department/:departmentId`
- `GET /employees/by-department-region`
- `GET /employees/:regionId/available-employees`
- `GET /employees/getbyid/:userId`
- `POST /employees/:employeeId/regions`
- `DELETE /employees/:employeeId/regions/:regionId`
- `DELETE /employees/:id`
- `POST /employees/register-face`
- `GET /employees/face-data`
- `DELETE /employees/:employeeId/faces`
- province APIs va change password.

Nhieu ham employee hien chua thay duoc UI goi truc tiep.

### `src/api/client.js`

Fetch wrapper moi:

- Build `BASE_URL`, `API_BASE_URL` tu env.
- `buildApiUrl`, `buildAssetUrl`.
- Wrapper `fetch` tu dong gan Authorization tu `localStorage.accessToken`.
- `parseResponse` xu ly JSON/text va throw error neu response khong OK.
- `apiRequest` tu dong set `Content-Type: application/json`.

### `src/api/endpoint.js`

Khai bao endpoint cho:

- Auth student.
- Grade.
- Exam set.
- Student profile/avatar.
- Attempt.

### `src/api/*.js`

- `auth.js`: `loginStudent`.
- `student.js`: upload avatar, update avatar/profile, get user detail.
- `grade.js`: get grades, exam set detail.
- `attempt.js`: start/submit/review/history/list attempt.

Phan API nay co ve lien quan den exam/student app cu hoac module khac, hien khong duoc route Student Order/Kitchen su dung.

## 10. Mock data va assets

### Mock data

`src/datas/mockExamData.js` chua danh sach products cho admin table. Du lieu co mot so item lap lai id/code o nua sau file.

### Assets

`src/assets` chua:

- Anh nen canteen/background.
- Anh san pham order.
- Avatar hoc sinh.
- Banner header.
- Pattern background cho cac cot/order.
- Icon/image phu.

`public/kido.jpg` va `src/assets/kido.jpg` cung ton tai.

## 11. Luu tru localStorage

Cac key dang duoc dung:

- `isLogin`: trang thai login admin mock.
- `student`: thong tin student hien tai.
- `students`: danh sach student mock/local, dung de update balance/refund.
- `amount`: so tien QR khi reload order.
- `orders`: danh sach don hang.
- `orderNumber`: counter so thu tu don.
- `access_token`: token face login.
- `token`: token face register.
- `accessToken`: token fetch wrapper trong `src/api/client.js`.

Luu y co 3 ten token khac nhau: `access_token`, `token`, `accessToken`.

## 12. Cac diem can luu y/technical debt

1. Encoding tieng Viet trong nhieu file dang bi mojibake, vi du `ÄÄƒng nháº­p`, `Káº¹o`, `Giá» hÃ ng`. Can chuan hoa UTF-8 de hien thi va maintain tot hon.

2. `Order.jsx` dang tao don sai o 2 field:

```js
items: cart | 0
studentName: student?.name | 0
```

Dung bitwise OR voi array/string se lam mat du lieu. Nen sua thanh:

```js
items: cart
studentName: student?.name || ""
```

3. `Right.jsx`, `Kitchen.jsx`, `CashOrders.jsx`, `PendingOrders.jsx`, `DoneOrders.jsx` deu assume `order.items` la array. Neu bug tren chua sua, man Kitchen se loi khi `.map`.

4. `Login.jsx` la file `.jsx` nhung co cu phap giong TypeScript:

```js
const [tab, setTab] = useState < "account" | "face" > ("account");
```

Nen sua thanh:

```js
const [tab, setTab] = useState("account");
```

5. Admin routes co file nhung chua mount trong `App.jsx`. Menu trong `components/layout/Header.jsx` tro toi cac route chua ton tai trong router hien tai.

6. `FaceVerify` luu token vao `access_token`, `RegisterFace` luu vao `token`, con fetch client doc `accessToken`. Nen thong nhat mot key.

7. `localStorage.amount` duoc doc trong `Order.jsx` nhung luong QR trong `Welcome.jsx` hien navigate bang state, khong thay set `amount` vao localStorage. Reload `/order` sau QR co the mat data.

8. Search input trong `Order/Left.jsx` chua co logic filter.

9. Admin filter/sidebar va cac nut CRUD/import/export hien chu yeu la UI, chua noi API.

10. `README.md` van la README mac dinh cua Vite, chua mo ta project thuc te.

11. Co file `src/pages/Student/Welcome copy.jsx` la ban copy, chua duoc route su dung. Nen xac dinh co can giu khong.

12. Co 2 API layer song song (`src/api/*` fetch wrapper va `src/service/*` Axios). Nen thong nhat de tranh lech base URL/token/error handling.

## 13. Huong phat trien de noi backend that

Thu tu nen lam:

1. Sua cac bug du lieu don hang va encoding truoc.
2. Chuan hoa route va layout admin: mount `/products`, `/price-book`, `/stock-takes` neu con dung.
3. Tao contract API cho product/category/order/student balance.
4. Thay products hardcode trong `Order.jsx` bang API.
5. Thay `localStorage.orders` bang API order lifecycle.
6. Thong nhat auth/token storage.
7. Tach cac model/data type chinh: `Student`, `Product`, `CartItem`, `Order`.
8. Them loading/error/empty state ro rang cho tung page.

## 14. So do luong order hien tai

```text
Welcome
  -> scan QR/card/face
  -> navigate /order voi location.state

Order
  -> doc student hoac amount
  -> chon san pham hardcode
  -> them vao cart
  -> confirm payment
  -> ghi don vao localStorage.orders

Kitchen
  -> poll localStorage.orders moi 1 giay
  -> hien theo status cash/pending/done
  -> cap nhat status hoac xoa don
```

