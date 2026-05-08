import React, { useState } from "react";

import ReportProductFilter from "../../components/reports/reportProduct/ReportProductFilter";
import ReportProductContent from "../../components/reports/reportProduct/ReportProductContent";

export default function ReportProduct() {

  const [viewType, setViewType] =
    useState("chart");

  const [interest, setInterest] =
    useState("Bán hàng");

  const [branch, setBranch] =
    useState("Chi nhánh trung tâm");

  const [timeType, setTimeType] =
    useState("week");

  const [productKeyword, setProductKeyword] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [foodTypes, setFoodTypes] =
    useState([]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4">

      <div className="max-w-[1800px] mx-auto">

        <h1 className="text-3xl font-bold mb-5">
          Báo cáo hàng hóa
        </h1>

        <div className="flex flex-col 2xl:flex-row gap-4">

          {/* FILTER */}
          <div className="w-full 2xl:w-[360px] shrink-0">

            <ReportProductFilter
              viewType={viewType}
              setViewType={setViewType}

              interest={interest}
              setInterest={setInterest}

              branch={branch}
              setBranch={setBranch}

              timeType={timeType}
              setTimeType={setTimeType}

              productKeyword={productKeyword}
              setProductKeyword={
                setProductKeyword
              }

              category={category}
              setCategory={setCategory}

              foodTypes={foodTypes}
              setFoodTypes={setFoodTypes}
            />

          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">

            <ReportProductContent
              viewType={viewType}
              interest={interest}
            />

          </div>

        </div>
      </div>
    </div>
  );
}