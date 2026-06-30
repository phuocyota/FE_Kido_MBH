import React, { useState } from "react";

import BoardingOrderFilter from "../../components/BoardingOrder/BoardingOrderFilter";
import BoardingOrderHeader from "../../components/BoardingOrder/BoardingOrderHeader";
import BoardingOrderTable from "../../components/BoardingOrder/BoardingOrderTable";

export default function BoardingOrder() {
  const [level, setLevel] = useState("preschool");
  const [week, setWeek] = useState("this");

  return (
    <div className="flex min-h-full rounded-2xl bg-white shadow-xl shadow-slate-200/70 ring-1 ring-white/80">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white">
        <BoardingOrderHeader />

        <BoardingOrderFilter
          level={level}
          setLevel={setLevel}
          week={week}
          setWeek={setWeek}
        />

        <div className="min-h-0 flex-1 overflow-auto bg-white">
          <BoardingOrderTable level={level} week={week} />
        </div>
      </div>
    </div>
  );
}
