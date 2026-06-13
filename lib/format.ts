/** Parse a French-formatted amount string ("1 283,48") into a number. */
export function parseAmount(value: string | null | undefined): number {
  return parseFloat(String(value || '').replace(/\s/g, '').replace(',', '.'));
}

/** Format a number back into a French-formatted amount string ("1283.48" -> "1283,48"). */
export function formatAmount(n: number): string {
  return isNaN(n) ? '' : n.toFixed(2).replace('.', ',');
}

/** Restrict a raw amount input to digits with a single decimal separator (comma or dot) and up to 2 decimals. */
export function sanitizeAmountInput(value: string): string {
  let v = value.replace(/[^0-9.,]/g, '');
  v = v.replace('.', ',');

  const firstComma = v.indexOf(',');
  if (firstComma !== -1) {
    v = v.slice(0, firstComma + 1) + v.slice(firstComma + 1).replace(/,/g, '');
    const [intPart, decPart] = v.split(',');
    v = `${intPart},${decPart.slice(0, 2)}`;
  }

  return v;
}
