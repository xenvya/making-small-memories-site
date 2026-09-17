// The supplied PDF contains no priced offers, package names, installment terms,
// or testimonials. Keep this empty until the client approves those facts.
export interface Offer {
  id: string;
  name: string;
  serviceId: string;
  description: string;
  fullPriceLabel: string;
  installmentLabel?: string;
}
export function parseOffers(raw: string | undefined): Offer[] {
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value))
    throw new Error("PUBLIC_OFFERS_JSON must be an array.");
  const ids = new Set<string>();
  const services = [
    "travel",
    "coaching",
    "benefits",
    "retirement",
    "investment",
  ];
  return value.map((offer: unknown) => {
    if (!offer || typeof offer !== "object")
      throw new Error("Each offer must be an object.");
    const o = offer as Record<string, unknown>;
    for (const key of [
      "id",
      "name",
      "serviceId",
      "description",
      "fullPriceLabel",
    ]) {
      if (typeof o[key] !== "string" || !o[key].trim())
        throw new Error(`Offer is missing ${key}.`);
    }
    if (!services.includes(String(o.serviceId)) || ids.has(String(o.id)))
      throw new Error("Offer needs a valid service and unique ID.");
    ids.add(String(o.id));
    if (
      o.installmentLabel !== undefined &&
      (typeof o.installmentLabel !== "string" || !o.installmentLabel.trim())
    )
      throw new Error("Installment label must contain approved terms.");
    return {
      id: String(o.id),
      name: String(o.name),
      serviceId: String(o.serviceId),
      description: String(o.description),
      fullPriceLabel: String(o.fullPriceLabel),
      installmentLabel: o.installmentLabel as string | undefined,
    };
  });
}
export const offers = parseOffers(import.meta.env.PUBLIC_OFFERS_JSON);
export function calLink(value: string | undefined): string | null {
  return value && /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(value) ? value : null;
}
