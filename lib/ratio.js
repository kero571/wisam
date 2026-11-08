// Card aspect ratios for videos, stored as "w:h" (e.g. "9:16").
export const RATIOS = [
  ["9:16", "طولي 9:16 (ريلز / ستوري)"],
  ["16:9", "عرضي 16:9 (فيلم)"],
  ["1:1", "مربع 1:1"],
  ["4:5", "بورتريه 4:5"],
  ["3:4", "بورتريه 3:4"],
  ["4:3", "عرضي 4:3"],
];

const parse = (r, fallback) => {
  const [w, h] = String(r || fallback).split(":").map(Number);
  return w > 0 && h > 0 ? [w, h] : String(fallback).split(":").map(Number);
};

export const ratioCss = (r, fallback = "16:9") => parse(r, fallback).join(" / ");
export const isWide = (r, fallback = "16:9") => {
  const [w, h] = parse(r, fallback);
  return w > h;
};

// Snap a real width/height to the nearest standard ratio (within ~4%), else keep the exact one.
export function snapRatio(w, h) {
  if (!(w > 0 && h > 0)) return "";
  const x = w / h;
  for (const [key] of RATIOS) {
    const [a, b] = key.split(":").map(Number);
    if (Math.abs(Math.log(x / (a / b))) < 0.04) return key;
  }
  return `${Math.round(w)}:${Math.round(h)}`;
}
