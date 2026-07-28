// utils/placeLabels.ts
export const PLACE_LABELS: Record<number, string> = {
  0: "Home",
  1: "Gym",
  2: "Outdoors",
};

export function getPlaceLabel(place: number | string): string {
  if (typeof place === "number") {
    return PLACE_LABELS[place] ?? `Unknown (${place})`;
  }
  return place;
}