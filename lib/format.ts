/** Parse a French-formatted amount string ("1 283,48") into a number. */
export function parseAmount(value: string | null | undefined): number {
  return parseFloat(String(value || '').replace(/\s/g, '').replace(',', '.'));
}

/** Format a number back into a French-formatted amount string ("1283.48" -> "1283,48"). */
export function formatAmount(n: number): string {
  return isNaN(n) ? '' : n.toFixed(2).replace('.', ',');
}
