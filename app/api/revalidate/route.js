import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Called by the dashboard after saving. Verifies the Firebase ID token belongs to ADMIN_EMAIL.
export async function POST(req) {
  try {
    const { idToken } = await req.json();
    const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const admin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (!idToken || !key || !admin) return NextResponse.json({ ok: false }, { status: 401 });

    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const data = await r.json();
    const email = (data?.users?.[0]?.email || "").toLowerCase();
    if (!r.ok || email !== admin) return NextResponse.json({ ok: false }, { status: 401 });

    revalidateTag("content");
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
