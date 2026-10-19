import React, { useState } from "react";

import StockFilterPanel from "./StockFilterPanel";

const defaultFilterValues = {
  documentType: "Tất cả",
  secondaryStatus: "Tất cả",
  fromDate: "01/01/2026",
  toDate: "22/06/2026",
};

export default function StockSidebarFilters({ type, filters, onFiltersChange, onApplyFilters, onResetFilters }) {
  const [localValues, setValues] = useState(defaultFilterValues);
  const values = filters || localValues;

  return (
    <StockFilterPanel
      type={type}
      values={values}
      onChange={(field, value) => onFiltersChange ? onFiltersChange({ ...values, [field]: value }) : setValues((current) => ({ ...current, [field]: value }))}
      onReset={() => onResetFilters ? onResetFilters() : setValues(defaultFilterValues)}
      onApply={() => onApplyFilters?.(values)}
      embedded
    />
  );
}
