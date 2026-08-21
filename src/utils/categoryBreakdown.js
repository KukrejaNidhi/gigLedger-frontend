/**
 * Aggregates a flat list of transactions into per-category totals for the
 * Analytics category pie chart. Fixed hue order (never cycled) — beyond the
 * 5th real category, the remainder folds into "Other".
 */
const VARIANT_ORDER = ['sky', 'coral', 'emerald', 'yellow', 'steel', 'olive'];
const MAX_SLICES = 5;

export function buildCategoryBreakdown(transactions, categories) {
  const categoryById = new Map(categories.map((c) => [c._id, c]));

  const totalsById = new Map();
  for (const tx of transactions) {
    const key = tx.category || 'uncategorized';
    totalsById.set(key, (totalsById.get(key) || 0) + (Number(tx.amount) || 0));
  }

  const rows = Array.from(totalsById.entries())
    .map(([id, total]) => ({
      id,
      name: id === 'uncategorized' ? 'Uncategorized' : categoryById.get(id)?.name || 'Unknown',
      total,
    }))
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  const top = rows.slice(0, MAX_SLICES);
  const rest = rows.slice(MAX_SLICES);
  const otherTotal = rest.reduce((sum, r) => sum + r.total, 0);
  if (otherTotal > 0) {
    top.push({ id: 'other', name: 'Other', total: otherTotal });
  }

  const grandTotal = top.reduce((sum, r) => sum + r.total, 0);
  if (grandTotal === 0) return [];

  return top.map((row, idx) => ({
    name: row.name,
    total: row.total,
    percent: Math.round((row.total / grandTotal) * 100),
    variant: row.id === 'uncategorized' || row.id === 'other' ? 'muted' : VARIANT_ORDER[idx % VARIANT_ORDER.length],
  }));
}
