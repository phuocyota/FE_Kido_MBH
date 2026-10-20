const validUnit = (unit) => unit && unit.isActive !== false &&
  Number.isFinite(Number(unit.factorToBase)) && Number(unit.factorToBase) > 0;

export function compatibleStockUnits(baseUnitId, units) {
  const base = units.find((unit) => unit.id === baseUnitId);
  if (!validUnit(base)) return [];
  return units.filter((unit) => validUnit(unit) && unit.dimension === base.dimension);
}

export function convertStockLineUnit(item, from, to) {
  if (!validUnit(from) || !validUnit(to) || from.dimension !== to.dimension)
    throw new Error('Đơn vị quy đổi không tương thích.');
  const quantity = Number(item.quantity);
  const price = Number(item.price);
  if (!Number.isFinite(quantity) || quantity < 0 || !Number.isFinite(price) || price < 0)
    throw new Error('Kiểm tra số lượng và đơn giá trước khi đổi đơn vị.');
  const ratio = Number(from.factorToBase) / Number(to.factorToBase);
  const nextQuantity = Number((quantity * ratio).toPrecision(12));
  const nextPrice = Number((price / ratio).toPrecision(12));
  if (!Number.isFinite(nextQuantity) || !Number.isFinite(nextPrice))
    throw new Error('Số lượng hoặc đơn giá sau quy đổi vượt giới hạn.');
  return {
    quantity: nextQuantity, price: nextPrice, unitId: to.id, unit: to.code,
    inputToBaseFactor: Number(item.inputToBaseFactor || 1) / ratio,
    allocations: undefined,
  };
}
