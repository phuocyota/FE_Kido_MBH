// Use wallet fields for debt; monthly spending statistics are not credit limits.
export function getParentDebt(wallet = {}) {
  const balance = Number(wallet?.balance ?? 0);
  const debtLimit = Math.max(0, Math.min(Number(wallet?.debtLimit ?? 50000), 50000));
  const debt = Math.max(0, -balance);
  return { balance, debtLimit, debt, availableDebtLimit: Math.max(0, debtLimit - debt) };
}
