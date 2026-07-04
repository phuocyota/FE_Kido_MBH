import React, { useState, useMemo } from "react";

import BoardingOrderFilter from "../../components/BoardingOrder/BoardingOrderFilter";
import BoardingOrderHeader from "../../components/BoardingOrder/BoardingOrderHeader";
import BoardingOrderTable from "../../components/BoardingOrder/BoardingOrderTable";

const formatDate = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const getLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeeksOfMonth = (year, month) => {
  const weeks = [];
  const firstDay = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDay.getDay();
  const diffToMonday = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  const startMonday = new Date(firstDay);
  startMonday.setDate(firstDay.getDate() + diffToMonday);

  const currentMonday = new Date(startMonday);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDay = today.getDay();
  const diffToThisMonday = todayDay === 0 ? -6 : 1 - todayDay;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() + diffToThisMonday);
  
  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);

  while (true) {
    const sunday = new Date(currentMonday);
    sunday.setDate(currentMonday.getDate() + 6);
    
    const lastDayOfMonth = new Date(year, month, 0);
    if (currentMonday > lastDayOfMonth) {
      break;
    }
    
    let suffix = "";
    if (currentMonday.getTime() === thisMonday.getTime()) {
      suffix = " (Tuần này)";
    } else if (currentMonday.getTime() === nextMonday.getTime()) {
      suffix = " (Tuần tới)";
    }

    const label = `${formatDate(currentMonday)} - ${formatDate(sunday)}${suffix}`;
    
    weeks.push({
      start: new Date(currentMonday),
      end: sunday,
      label,
      key: getLocalDateKey(currentMonday),
    });
    
    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  
  return weeks;
};

export default function BoardingOrder() {
  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1;

  const [level, setLevel] = useState("preschool");
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);

  const weeks = useMemo(() => getWeeksOfMonth(year, month), [year, month]);

  const defaultWeekIndex = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDay = today.getDay();
    const diffToThisMonday = todayDay === 0 ? -6 : 1 - todayDay;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() + diffToThisMonday);
    const thisMondayKey = getLocalDateKey(thisMonday);

    const idx = weeks.findIndex((w) => w.key === thisMondayKey);
    return idx !== -1 ? idx : 0;
  }, [weeks]);

  const [weekIndex, setWeekIndex] = useState(defaultWeekIndex);

  // Reset weekIndex to 0 if weeks list changes and index is out of bounds
  React.useEffect(() => {
    if (weekIndex >= weeks.length) {
      setWeekIndex(0);
    }
  }, [weeks, weekIndex]);

  const activeWeek = weeks[weekIndex] || weeks[0] || null;

  return (
    <div className="flex min-h-full rounded-2xl bg-white shadow-xl shadow-slate-200/70 ring-1 ring-white/80">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white">
        <BoardingOrderHeader />

        <BoardingOrderFilter
          level={level}
          setLevel={setLevel}
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
          weeks={weeks}
          weekIndex={weekIndex}
          setWeekIndex={setWeekIndex}
        />

        <div className="min-h-0 flex-1 overflow-auto bg-white">
          <BoardingOrderTable level={level} activeWeek={activeWeek} />
        </div>
      </div>
    </div>
  );
}
