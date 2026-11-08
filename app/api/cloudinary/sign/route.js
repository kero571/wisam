import crypto from "crypto";
import { NextResponse } from "next/server";

const FOLDER = "wisam";

// Returns a Cloudinary upload signature, only for the admin (verified via Firebase ID token).
export async function POST(req) {
  try {
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const fbKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const admin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (!token || !fbKey || !admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "إعدادات Cloudinary ناقصة في السيرفر" }, { status: 500 });
    }

    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${fbKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });
    const data = await r.json();
    const email = (data?.users?.[0]?.email || "").toLowerCase();
    if (!r.ok || email !== admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash("sha1")
      .update(`folder=${FOLDER}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    return NextResponse.json({ cloudName, apiKey, timestamp, folder: FOLDER, signature });
  } catch {
    return NextResponse.json({ error: "فشل تجهيز الرفع" }, { status: 500 });
  }
}
