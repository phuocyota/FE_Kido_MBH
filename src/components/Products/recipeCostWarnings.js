export function ingredientProductsWithoutCost(recipe) {
  const missing = new Map();
  for (const item of recipe.items || []) {
    const product = item.ingredientProduct;
    const cost = product?.costPrice;
    if (cost == null || cost === '' || !Number.isFinite(Number(cost)) || Number(cost) < 0) {
      const id = item.ingredientProductId || product?.id || item.id;
      missing.set(id, { ...product, id, name: product?.name || id });
    }
  }
  return [...missing.values()];
}

export function ingredientsWithoutCost(recipe) {
  return ingredientProductsWithoutCost(recipe).map((product) => product.name);
}

export function costPerBaseUnit(value, inputUnit, baseUnit) {
  if (value === '' || value == null || !Number.isFinite(Number(value)) || Number(value) < 0)
    throw new Error('Nhập giá vốn hợp lệ, lớn hơn hoặc bằng 0.');
  if (!baseUnit || !inputUnit || inputUnit.dimension !== baseUnit.dimension ||
    !(Number(inputUnit.factorToBase) > 0) || !(Number(baseUnit.factorToBase) > 0))
    throw new Error('Nguyên liệu cần có đơn vị tồn chuẩn và đơn vị nhập giá tương thích.');
  const raw = Number(value) * Number(baseUnit.factorToBase) / Number(inputUnit.factorToBase);
  const cost = Math.round((raw + Number.EPSILON) * 100) / 100;
  if (!Number.isFinite(cost) || cost >= 1e10 || (Number(value) > 0 && cost === 0))
    throw new Error('Giá quy đổi nằm ngoài khoảng lưu được (0,01 đến 9.999.999.999,99 đ/đơn vị tồn chuẩn).');
  return cost;
}
