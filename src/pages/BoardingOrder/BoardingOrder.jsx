import React from "react";
import { Link } from "react-router-dom";

import BoardingOrderAdmin from "../../components/BoardingOrder/BoardingOrderAdmin";

export default function BoardingOrder() {
  return (
    <>
        <div className="flex justify-end bg-slate-50 px-6 pt-4">
          <Link to="/boarding-orders/demo" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100">
            Mở trang demo
          </Link>
        </div>
      <BoardingOrderAdmin />
    </>
  );
}
