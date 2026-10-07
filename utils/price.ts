/**
 * Normalises a displayed price so the same amount compares equal across pages.
 * Results cards and details pages format some amounts differently, for example
 * "₹1 Lac" and "₹1.0 Lac". Both become "1Lac".
 */
export function normalisePrice(text: string): string {
  const compact = text.replace(/[₹,\s]/g, '');
  const [, amount, unit] = compact.match(/^([\d.]+)(.*)$/) ?? [];
  return amount ? `${parseFloat(amount)}${unit}` : compact;
}
