import { fb } from "@/lib/firebase";

const LIMITS = { image: 10, video: 100 }; // MB (Cloudinary free plan)

// Fallback poster straight from Cloudinary (frame at second `at`). Only used if the browser can't grab the frame.
export function videoPoster(url, at = 2) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) return "";
  return url.replace("/upload/", `/upload/so_${at},w_960,q_auto/`).replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
}

// Big JPEG/WebP photos are shrunk in the browser first (max 2400px) => faster upload, faster site.
async function shrink(file) {
  if (!/^image\/(jpeg|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 2.5 * 1024 * 1024) {
      bmp.close?.();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close?.();
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    return blob && blob.size < file.size
      ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })
      : file;
  } catch {
    return file;
  }
}

// Signed upload: asks /api/cloudinary/sign for a signature, then uploads straight to Cloudinary.
export async function uploadToCloudinary(original, onProgress) {
  const resourceType = original.type.startsWith("video/") ? "video" : "image";
  const file = resourceType === "image" ? await shrink(original) : original;
  if (file.size > LIMITS[resourceType] * 1024 * 1024) {
    const err = new Error(
      `${original.name} حجمه ${(file.size / 1024 / 1024).toFixed(1)}MB والحد ${LIMITS[resourceType]}MB — صغّره وجرّب تاني`
    );
    err.perFile = true; // only this file is a problem, the rest can still upload
    throw err;
  }

  const user = fb().auth.currentUser;
  if (!user) throw new Error("سجّل الدخول الأول");
  const token = await user.getIdToken();

  const res = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: "{}",
  });
  const sig = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(sig.error || "فشل تجهيز الرفع");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("folder", sig.folder);
  form.append("signature", sig.signature);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let body = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
        resolve({ url: body.secure_url, type: resourceType, width: body.width || 0, height: body.height || 0 });
      } else {
        reject(new Error(body?.error?.message || "فشل الرفع"));
      }
    };
    xhr.onerror = () => reject(new Error("مشكلة في الاتصال أثناء الرفع"));
    xhr.send(form);
  });
}
