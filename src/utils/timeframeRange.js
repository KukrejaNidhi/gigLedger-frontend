/**
 * Calendar date ranges for the CashFlowCard timeframe filter. Deliberately
 * calendar-quarter based (Jan-Mar, Apr-Jun, ...), not the fiscal-year
 * quarters used in the Tax Center — this is a general cash-flow view, not a
 * tax-period one.
 */
export function timeframeRange(label, now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (label) {
    case 'This Month':
      return { start: new Date(year, month, 1), end: new Date(year, month + 1, 0, 23, 59, 59, 999) };
    case 'Last Month':
      return { start: new Date(year, month - 1, 1), end: new Date(year, month, 0, 23, 59, 59, 999) };
    case 'This Quarter': {
      const quarterStartMonth = Math.floor(month / 3) * 3;
      return { start: new Date(year, quarterStartMonth, 1), end: new Date(year, quarterStartMonth + 3, 0, 23, 59, 59, 999) };
    }
    case 'Year to Date':
      return { start: new Date(year, 0, 1), end: new Date(year, 11, 31, 23, 59, 59, 999) };
    default:
      return { start: new Date(0), end: now };
  }
}

/** Sums income/expense totals for transactions whose date falls within the given timeframe. */
export function sumByTimeframe(transactions, label) {
  const { start, end } = timeframeRange(label);
  let spending = 0;
  let income = 0;

  for (const tx of transactions) {
    const d = new Date(tx.date);
    if (Number.isNaN(d.getTime()) || d < start || d > end) continue;
    if (tx.type === 'income') income += Number(tx.amount) || 0;
    else spending += Number(tx.amount) || 0;
  }

  return { spending, income };
}
