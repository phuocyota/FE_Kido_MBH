import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import BoardingOrderAdmin from "../../components/BoardingOrder/BoardingOrderAdmin";

export default function BoardingOrder() {
  return (
    <BoardingOrderAdmin
      headerActions={
        <Link
          to="/boarding-orders/demo"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-semibold text-amber-800 hover:bg-amber-100"
        >
          <ExternalLink size={15} />
          Mở trang demo
        </Link>
      }
    />
  );
}
