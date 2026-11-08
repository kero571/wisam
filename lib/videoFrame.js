import { uploadToCloudinary } from "@/lib/cloudinary";

function openVideo(src, cross) {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    if (cross) v.crossOrigin = "anonymous";
    const t = setTimeout(() => reject(new Error("timeout")), 15000);
    v.onloadeddata = () => {
      clearTimeout(t);
      resolve(v);
    };
    v.onerror = () => {
      clearTimeout(t);
      reject(new Error("video"));
    };
    v.src = src;
    v.load();
  });
}

function seekTo(v, at) {
  return new Promise((resolve, reject) => {
    const max = Number.isFinite(v.duration) ? Math.max(0, v.duration - 0.1) : at;
    const target = Math.min(at, max);
    if (Math.abs(v.currentTime - target) < 0.01) return resolve();
    const t = setTimeout(() => reject(new Error("seek")), 10000);
    v.onseeked = () => {
      clearTimeout(t);
      resolve();
    };
    v.onerror = () => {
      clearTimeout(t);
      reject(new Error("seek"));
    };
    v.currentTime = target;
  });
}

// Draws one frame of a video (blob: URL of a local file, or a remote URL) into a JPEG blob.
export async function grabFrame(src, { at = 1, cross = false, maxSide = 960 } = {}) {
  const v = await openVideo(src, cross);
  try {
    await seekTo(v, at);
    const scale = Math.min(1, maxSide / Math.max(v.videoWidth, v.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(v.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(v.videoHeight * scale));
    canvas.getContext("2d").drawImage(v, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    if (!blob) throw new Error("blob");
    return { blob, width: v.videoWidth, height: v.videoHeight };
  } finally {
    v.removeAttribute("src");
    v.load();
  }
}

// Grabs a frame, uploads it to Cloudinary as a normal image and returns its URL.
// If the browser can't do it, returns fallbackUrl (a Cloudinary-generated frame) instead.
export async function makePoster(src, { at = 1, cross = false, fallbackUrl = "" } = {}) {
  try {
    const f = await grabFrame(src, { at, cross });
    const r = await uploadToCloudinary(new File([f.blob], "poster.jpg", { type: "image/jpeg" }));
    return { url: r.url, width: f.width, height: f.height, fallback: false };
  } catch {
    return { url: fallbackUrl, width: 0, height: 0, fallback: true };
  }
}
