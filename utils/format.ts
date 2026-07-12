export function currency(value: number) {
  return value.toLocaleString("fr-FR", { style: "currency", currency: "XAF" });
}
