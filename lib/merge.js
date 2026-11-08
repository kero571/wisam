const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

// Deep-merge saved content over defaults (arrays are replaced, objects are merged).
export function mergeContent(base, extra) {
  const out = { ...base };
  for (const k of Object.keys(extra || {})) {
    out[k] = isObj(base[k]) && isObj(extra[k]) ? mergeContent(base[k], extra[k]) : extra[k];
  }
  return out;
}
