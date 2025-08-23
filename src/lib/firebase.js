import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// 환경변수 기반 Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID, // 필요하면 추가
};

// 이미 초기화된 게 있으면 재사용, 없으면 새로 초기화
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// FCM 지원 브라우저에서만 messaging 가져오기
export const messagingPromise = isSupported().then((ok) => {
  if (!ok) {
    console.warn("이 브라우저는 FCM을 지원하지 않습니다.");
    return null;
  }
  return getMessaging(app);
});

// 개발 환경에서 환경변수 제대로 들어오는지 체크
if (import.meta.env.DEV) {
  console.log("[Firebase Config Check]", firebaseConfig);
}
