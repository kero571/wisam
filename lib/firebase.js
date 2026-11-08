import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, indexedDBLocalPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let cache = null;

// Lazy: only runs in the browser inside /admin, never during build/SSR.
// initializeAuth without a popup resolver => no Google scripts/iframes (works with the strict CSP).
export function fb() {
  if (!cache) {
    const app = getApps().length
      ? getApp()
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        });
    let auth;
    try {
      auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
    } catch {
      auth = getAuth(app);
    }
    cache = { auth, db: getFirestore(app) };
  }
  return cache;
}
