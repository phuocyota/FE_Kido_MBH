export const feedbackStatuses = {
  pending: { label: "Chờ tiếp nhận", className: "bg-blue-50 text-blue-700 border-blue-100" },
  processing: { label: "Đang xử lý", className: "bg-amber-50 text-amber-700 border-amber-100" },
  resolved: { label: "Đã xử lý", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
};

// Sample records for the feedback interface, pending backend integration.
export const foodFeedbackData = [
  { id: "PA010", service: "canteen", date: "2026-10-15", mealName: "Bánh mì trứng", reason: "Món ăn không đảm bảo", description: "Bánh mì hơi nguội khi nhận món, mong căn tin giữ món nóng hơn.", status: "pending", createdAt: "2026-10-15T08:10:00+07:00", response: "", images: [] },
  { id: "PA009", service: "boarding", date: "2026-10-14", mealName: "Cơm gà kho gừng", reason: "Khẩu phần không đủ", description: "Phần rau và cơm hơi ít so với khẩu phần thường ngày của bé.", status: "processing", createdAt: "2026-10-14T12:30:00+07:00", response: "Nhà bếp đang kiểm tra định lượng khẩu phần.", images: [] },
  { id: "PA008", service: "canteen", date: "2026-10-13", mealName: "Sữa tươi ít đường", reason: "Sai món đã đặt", description: "Đặt sữa ít đường nhưng nhận sữa có đường.", status: "resolved", createdAt: "2026-10-13T09:15:00+07:00", response: "Căn tin đã đổi lại đúng loại sữa và nhắc nhân viên kiểm tra đơn.", images: [] },
  { id: "PA007", service: "boarding", date: "2026-10-12", mealName: "Canh rau ngót thịt bằm", reason: "Món ăn không đảm bảo", description: "Canh hơi mặn, mong nhà bếp điều chỉnh gia vị phù hợp với học sinh.", status: "processing", createdAt: "2026-10-12T13:00:00+07:00", response: "Nhà bếp đã ghi nhận và đang rà soát công thức nêm nếm.", images: [] },
  { id: "PA006", service: "canteen", date: "2026-10-09", mealName: "Bún thịt nướng", reason: "Thái độ phục vụ", description: "Nhân viên chưa hướng dẫn rõ vị trí nhận món khi bé hỏi.", status: "resolved", createdAt: "2026-10-09T10:20:00+07:00", response: "Đã trao đổi với nhân viên và bổ sung hướng dẫn nhận món.", images: [] },
  { id: "PA005", service: "boarding", date: "2026-10-08", mealName: "Cơm cá sốt cà", reason: "Khác", description: "Mong nhà bếp kiểm tra kỹ xương cá trước khi chia phần cho các bé.", status: "resolved", createdAt: "2026-10-08T12:45:00+07:00", response: "Nhà bếp đã bổ sung bước kiểm tra xương cá khi chia suất.", images: [] },
  { id: "PA004", service: "canteen", date: "2026-10-07", mealName: "Xôi gà", reason: "Khẩu phần không đủ", description: "Phần thịt gà ít hơn những lần đặt trước.", status: "pending", createdAt: "2026-10-07T08:00:00+07:00", response: "", images: [] },
  { id: "PA003", service: "boarding", date: "2026-10-06", mealName: "Mì xào bò", reason: "Sai món đã đặt", description: "Đăng ký mì xào bò nhưng bé nhận cơm thịt kho.", status: "resolved", createdAt: "2026-10-06T12:15:00+07:00", response: "Đã xác nhận nhầm suất và điều chỉnh quy trình đối chiếu thực đơn.", images: [] },
  { id: "PA002", service: "canteen", date: "2026-10-05", mealName: "Nước cam", reason: "Món ăn không đảm bảo", description: "Nước cam có nhiều đá dù đã ghi chú ít đá.", status: "processing", createdAt: "2026-10-05T14:00:00+07:00", response: "Căn tin đang kiểm tra ghi chú của đơn hàng.", images: [] },
  { id: "PA001", service: "boarding", date: "2026-10-02", mealName: "Súp gà nấm", reason: "Khác", description: "Mong có thêm lựa chọn súp không nấm cho học sinh không ăn được nấm.", status: "resolved", createdAt: "2026-10-02T12:30:00+07:00", response: "Đã ghi nhận để cân nhắc khi xây dựng thực đơn tuần tới.", images: [] },
];
