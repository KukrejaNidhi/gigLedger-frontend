/**
 * Turns GET /api/dashboard/expense-by-category's server-aggregated rows
 * ({ categoryName, total, taxDeductible, percentage }) into CategoryPieChart
 * segments. Fixed hue order (never cycled) — beyond the 5th real category,
 * the remainder folds into "Other". The server already resolves names,
 * computes percentages, and buckets missing/deleted categories as
 * "Uncategorized" — no client-side aggregation needed here.
 */
const VARIANT_ORDER = ['sky', 'coral', 'emerald', 'yellow', 'violet', 'steel'];
const MAX_SLICES = 5;

export function buildCategoryBreakdown(breakdown) {
  const rows = (breakdown || [])
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  const top = rows.slice(0, MAX_SLICES);
  const rest = rows.slice(MAX_SLICES);
  const otherTotal = rest.reduce((sum, r) => sum + r.total, 0);
  if (otherTotal > 0) {
    top.push({ categoryName: 'Other', total: otherTotal });
  }

  const grandTotal = top.reduce((sum, r) => sum + r.total, 0);
  if (grandTotal === 0) return [];

  return top.map((row, idx) => ({
    name: row.categoryName,
    total: row.total,
    percent: Math.round((row.total / grandTotal) * 100),
    variant:
      row.categoryName === 'Uncategorized' || row.categoryName === 'Other'
        ? 'muted'
        : VARIANT_ORDER[idx % VARIANT_ORDER.length],
  }));
}
