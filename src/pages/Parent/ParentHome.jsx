import React  from "react";
import ParentLeft from "../../components/Parent/ParentLeft";
import ParentRight from "../../components/Parent/ParentRight";

export default function ParentHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ">
        Good Morning!
      </h1>
      <ParentRight />

      {/* nội dung dashboard */}
    </div>
  );
}