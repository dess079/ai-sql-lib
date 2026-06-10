/**
 * Value formatting utilities for chart tooltips.
 * Infers semantic type (date, amount, number) from the column key name and value shape.
 */

/** Keys that suggest a monetary or currency amount. */
const CURRENCY_KEY =
  /montant|amount|total|prix|price|cost|co[uû]t|revenue|income|salary|salaire|budget|solde|value|valeur|fee|frais/i;

/** Keys that suggest a date or timestamp. */
const DATE_KEY = /date|_at$|_on$|time|created|updated|modified|timestamp/i;

/** Returns true when the string starts with an ISO-8601 date fragment. */
function isIsoDate(val: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(val);
}

/**
 * Formats a chart tooltip value according to its column key semantics.
 *
 * - Date key or ISO date string → `Intl.DateTimeFormat` (short month)
 * - Number + monetary key → `Intl.NumberFormat` with 2 decimal places
 * - Other numbers → `Intl.NumberFormat` up to 4 decimal places
 * - Otherwise → raw `String(value)`
 *
 * @param value - raw value from the data row
 * @param key   - column name used to infer the semantic type
 * @returns human-readable string
 */
export function formatChartValue(value: unknown, key: string): string {
  if (value == null) return "—";

  if (DATE_KEY.test(key) || (typeof value === "string" && isIsoDate(value))) {
    const d = new Date(String(value));

    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  if (typeof value === "number" && CURRENCY_KEY.test(key)) {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(value);
  }

  return String(value);
}
