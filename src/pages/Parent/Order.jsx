import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Cookie,
  CupSoda,
  Sandwich,
  Soup,
  UtensilsCrossed,
} from "lucide-react";

import OrderHeader from "../../components/OrderParent/OrderHeader";
import CategoryBar from "../../components/OrderParent/CategoryBar";
import ProductList from "../../components/OrderParent/ProductList";
import BottomCheckout from "../../components/OrderParent/BottomCheckout";

import { buildAssetUrl } from "../../api/client";
import { getProductsFull } from "../../api/products";

const ALL_CATEGORY = {
  id: "all",
  name: "Tất cả",
  icon: UtensilsCrossed,
};

const normalizeText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const getCategoryIcon = (name = "") => {
  const normalizedName = normalizeText(name);

  if (normalizedName.includes("nuoc") || normalizedName.includes("uong")) {
    return CupSoda;
  }

  if (normalizedName.includes("banh mi")) {
    return Sandwich;
  }

  if (normalizedName.includes("banh")) {
    return Cookie;
  }

  if (normalizedName.includes("com") || normalizedName.includes("mon")) {
    return Soup;
  }

  return UtensilsCrossed;
};

const readJsonStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const readCheckoutStorage = () => {
  try {
    const raw = sessionStorage.getItem("parentOrderCheckout");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function Order() {
  const { homeData, loading, error, refreshHome } = useOutletContext() || {};
  const navigate = useNavigate();
  const [storedStudent] = useState(() =>
    readJsonStorage("student")
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState(() => readCheckoutStorage()?.items || []);
  const [noteModal, setNoteModal] = useState(null);
  const [noteValue, setNoteValue] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState("");
  const cachedBranchId = localStorage.getItem("parent_branch_id") || "";
  const cachedLimit = Number(localStorage.getItem("parent_advance_limit") || 0);

  const branchId = homeData?.user?.branchId || storedStudent?.branchId || cachedBranchId;
  const advanceAmount = Number(
    homeData?.statistics?.month?.limit ??
    homeData?.statistics?.week?.limit ??
    storedStudent?.advanceAmount ??
    cachedLimit
  );

  useEffect(() => {
    // Nếu chưa có branchId từ cache mà trang đang tải thông tin chung thì đợi tải xong
    if (!branchId && loading) return;

    if (!branchId) {
      setMenuData([]);
      setMenuError("Không tìm thấy chi nhánh của học sinh");
      return;
    }

    let ignore = false;

    const fetchProducts = async () => {
      try {
        setMenuLoading(true);
        setMenuError("");
        const data = await getProductsFull({
          branchId,
          maxPrice: advanceAmount || undefined,
          isCanteenItem: true,
        });

        if (!ignore) {
          setMenuData(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Fetch products error:", err);

        if (!ignore) {
          setMenuData([]);
          setMenuError(err.message || "Không tải được danh sách sản phẩm");
          toast.error(err.message || "Không tải được danh sách sản phẩm");
        }
      } finally {
        if (!ignore) {
          setMenuLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [advanceAmount, branchId, loading]);

  const student = useMemo(() => {
    const user = homeData?.user;

    if (!user && !storedStudent) return null;

    return {
      id: user?.id ?? storedStudent?.id ?? localStorage.getItem("userId") ?? "",
      name: user?.fullName ?? storedStudent?.name ?? "Học sinh",
      avatar: buildAssetUrl(user?.avatarUrl) || storedStudent?.avatar || "",
      cardId:
        storedStudent?.cardId ??
        user?.studentCode ??
        user?.code ??
        user?.id ??
        localStorage.getItem("userId") ??
        "",
      balance: Number(homeData?.wallet?.balance ?? storedStudent?.balance ?? 0),
      advanceAmount: Number(advanceAmount || 0),
      branchId,
    };
  }, [advanceAmount, branchId, homeData, storedStudent]);

  const categories = useMemo(() => {
    const apiCategories = menuData
      .filter((item) =>
        (item.products || []).some(
          (product) => !advanceAmount || Number(product.price || 0) <= advanceAmount
        )
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        icon: getCategoryIcon(item.name),
      }));

    return [ALL_CATEGORY, ...apiCategories];
  }, [advanceAmount, menuData]);

  const products = useMemo(() => {
    return menuData.flatMap((category) =>
      (category.products || [])
        .filter((item) => !advanceAmount || Number(item.price || 0) <= advanceAmount)
        .map((item) => ({
          id: item.id,
          name: item.name,
          image: buildAssetUrl(item.imageUrl) || "/kido.jpg",
          category: category.name,
          categoryId: category.id,
          price: Number(item.price || 0),
          oldPrice: item.oldPrice ? Number(item.oldPrice) : null,
          sold: Number(item.sold || 0),
          likes: Number(item.likes ?? item.like ?? 0),
          remain: Number(item.remain ?? item.quantity ?? 0),
          description: item.description || "",
          unit: item.unit || "",
        }))
    );
  }, [advanceAmount, menuData]);



  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchCategory =
        activeCategory === "all"
          ? true
          : activeCategory === "flash"
            ? item.flashSale
            : item.categoryId === activeCategory;

      const matchSearch =
        !keyword ||
        [item.name, item.description, item.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword));

      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, search]);

  const addToCart = (product) => {
    const currentItem = cart.find((item) => item.id === product.id);
    const currentQty = currentItem?.qty || 0;

    if (product.remain > 0 && currentQty >= product.remain) {
      toast.error("Số lượng món đã đạt giới hạn còn lại");
      return;
    }

    setCart((prev) => {
      const exist = prev.find((x) => x.id === product.id);

      if (exist) {
        return prev.map((x) =>
          x.id === product.id
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }

      return [...prev, { ...product, qty: 1, note: "" }];
    });

    if (!currentItem) {
      setNoteModal(product);
      setNoteValue("");
    }
  };

  const openNoteModal = (item) => {
    setNoteModal(item);
    setNoteValue(item.note || "");
  };

  const saveNote = () => {
    if (!noteModal) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === noteModal.id
          ? { ...item, note: noteValue.trim() }
          : item
      )
    );
    setNoteModal(null);
    setNoteValue("");
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;

        if (x.remain > 0 && x.qty >= x.remain) {
          toast.error("Số lượng món đã đạt giới hạn còn lại");
          return x;
        }

        return { ...x, qty: x.qty + 1 };
      })
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((x) =>
          x.id === id
            ? { ...x, qty: x.qty - 1 }
            : x
        )
        .filter((x) => x.qty > 0)
    );
  };

  const clearCart = () => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa các món đã chọn?");

    if (!confirmed) return;

    setCart([]);
    setNoteModal(null);
    setNoteValue("");
    sessionStorage.removeItem("parentOrderCheckout");
    toast.success("Đã xóa giỏ hàng");
  };

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [cart]);

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Chưa có món trong giỏ hàng");
      return;
    }

    if (!student) {
      toast.error("Không tìm thấy thông tin học sinh");
      return;
    }

    sessionStorage.setItem(
      "parentOrderCheckout",
      JSON.stringify({
        items: cart,
        total,
        student,
        branchId,
        createdAt: Date.now(),
      })
    );

    if (typeof refreshHome === "function") {
      refreshHome();
    }

    navigate("/order/payment");
  };

  if (loading && !student) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white p-6 text-center text-gray-600">
        {error || "Không tìm thấy thông tin học sinh"}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-slate-100 -m-4 md:-m-6">
      <OrderHeader
        student={student}
        search={search}
        setSearch={setSearch}
      />

      <CategoryBar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <ProductList
        products={filteredProducts}
        loading={menuLoading}
        error={menuError}
        cart={cart}
        addToCart={addToCart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        openNoteModal={openNoteModal}
      />

      <BottomCheckout
        cart={cart}
        total={total}
        onCheckout={handlePayment}
        onClearCart={clearCart}
      />

      {noteModal && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-800">Ghi chú món</h2>
            <p className="mt-1 text-sm font-medium text-gray-600">
              {noteModal.name}
            </p>

            <textarea
              value={noteValue}
              onChange={(event) => setNoteValue(event.target.value)}
              rows={4}
              maxLength={160}
              placeholder="Ví dụ: ít đá, không hành, thêm tương ớt..."
              className="mt-4 w-full rounded-xl border border-gray-300 p-3 text-sm outline-none transition focus:border-indigo-500"
            />

            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>Có thể bỏ trống nếu không cần ghi chú.</span>
              <span>{noteValue.length}/160</span>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setNoteModal(null);
                  setNoteValue("");
                }}
                className="flex-1 rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Bỏ qua
              </button>
              <button
                type="button"
                onClick={saveNote}
                className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}


    </div>
  );
}
