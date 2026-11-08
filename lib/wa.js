export const waDigits = (n) => String(n || "").replace(/\D/g, "");
export const waLink = (number, message) =>
  `https://wa.me/${waDigits(number)}?text=${encodeURIComponent(message || "")}`;
