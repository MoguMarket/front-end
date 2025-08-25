// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
};

// Firebase App 초기화
export const app = initializeApp(firebaseConfig);

// VAPID Key (웹푸시용) 환경변수에서 불러오기
export const vapidKey = import.meta.env.VITE_FB_VAPID_KEY;

// 일부 브라우저/환경 미지원 방지
export const messagingPromise = (async () => {
    try {
        if (typeof window !== "undefined" && "Notification" in window) {
            return getMessaging(app);
        }
    } catch (e) {
        console.error("Firebase Messaging 초기화 실패:", e);
    }
    return null;
})();

// 개발환경에서 환경변수 확인용 로그
const cfg = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
    vapidKey: import.meta.env.VITE_FB_VAPID_KEY, // ✅ 확인 추가
};

if (import.meta.env.DEV) {
    console.log("[FB cfg]", cfg);
    // 전부 문자열로 찍혀야 OK (undefined/빈문자면 문제)
}
