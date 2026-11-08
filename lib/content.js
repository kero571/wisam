import { DEFAULT_CONTENT } from "@/data/defaults";
import { mergeContent } from "@/lib/merge";

// Server-side read of the saved content (Firestore REST => no Firebase SDK in the public bundle).
// Cached by Next; the dashboard calls /api/revalidate after each save.
export async function getContent() {
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!project || !key) return DEFAULT_CONTENT;
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/site/content?key=${key}`,
      { next: { revalidate: 3600, tags: ["content"] } }
    );
    if (!res.ok) return DEFAULT_CONTENT;
    const doc = await res.json();
    const raw = doc?.fields?.json?.stringValue;
    return raw ? mergeContent(DEFAULT_CONTENT, JSON.parse(raw)) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}
