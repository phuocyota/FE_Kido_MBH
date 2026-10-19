// Generate once when selecting a product, then keep the code in the document row.
export function createStockLotCode() {
  return `LO-${crypto.randomUUID()}`;
}
